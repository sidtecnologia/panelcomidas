import { useEffect, useState, useRef } from 'react';
import { CheckCircle, XCircle, Printer, Clock, Truck, MessageSquare, Timer as TimerIcon } from 'lucide-react';
import usePedidos from '../../hooks/usePedidos';
import useSound from '../../hooks/useSound';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Timer from '../ui/Timer'; // Importar el nuevo componente
import { formatCurrency } from '../../lib/config';
import { printThermalReceipt } from '../../lib/thermalPrint';

const PedidosTab = ({ api }) => {
  const { orders, load, updateStatus, confirmAndMove, markAsDispatched } = usePedidos(api, 'Pendiente');
  const { play } = useSound();
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const prevOrdersCount = useRef(0);

  const fetchHistory = async () => {
    try {
      const data = await api.request('/orders_confirmed?select=*&order=created_at.desc&limit=10');
      setHistory(data || []);
    } catch (e) {}
  };

  useEffect(() => {
    if (orders.length > prevOrdersCount.current) {
      play();
    }
    prevOrdersCount.current = orders.length;
  }, [orders, play]);

  useEffect(() => { 
    load(); 
    fetchHistory();
  }, [load]);

  const handleConfirm = async (order) => {
    await confirmAndMove(order);
    await fetchHistory();
    setSelected(null);
  };

  const handleDispatch = async (id) => {
    await markAsDispatched(id);
    await fetchHistory();
    setSelected(null);
  };

  const parseItems = (o) => {
    if (!o) return [];
    const items = o.order_items || o.items;
    if (typeof items === 'string') {
      try { return JSON.parse(items); } catch (e) { return []; }
    }
    return Array.isArray(items) ? items : [];
  };

  const handlePrint = (order) => {
    printThermalReceipt({
      title: 'T! Traigo',
      orderNumber: order.id,
      customerName: order.customer_name,
      customerAddress: order.customer_address,
      items: parseItems(order),
      total: order.total_amount,
      note: order.observation || order.notes
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Pedidos Nuevos</h2>
          <Badge color="yellow">{orders.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {orders.map(o => (
            <Card key={`act-${o.id}`} className="cursor-pointer active:scale-[0.98] transition-transform border-amber-500/30 bg-slate-900" >
              <div onClick={() => setSelected({ ...o, isNew: true })}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-white text-lg">{o.customer_name || 'Sin Nombre'}</h4>
                    <p className="text-slate-400 text-sm mt-1">{o.customer_address}</p>
                  </div>
                  <h4 className="font-bold text-amber-500 text-xl">{formatCurrency(o.total_amount)}</h4>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock size={14} /> {new Date(o.created_at).toLocaleTimeString('es-CO')}
                  </div>
                  <Badge color="yellow">Por Confirmar</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-lg font-bold text-slate-400 px-2 tracking-tight">En Espera de Despacho</h2>
        <div className="grid grid-cols-1 gap-3">
          {history.map(h => (
            <Card key={`hist-${h.id}`} className={`cursor-pointer active:scale-[0.98] transition-transform p-4 border-slate-800 ${h.order_status !== 'Despachado' ? 'bg-slate-900/50' : ''}`} >
              <div onClick={() => setSelected({ ...h, isNew: false })}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-300">{h.customer_name}</h4>
                  {h.order_status !== 'Despachado' && (
                    <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      <TimerIcon size={12} className="text-slate-500" />
                      <Timer startTime={h.created_at} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{new Date(h.created_at).toLocaleTimeString('es-CO')}</span>
                  <Badge color={h.order_status === 'Despachado' ? 'green' : 'gray'}>{h.order_status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selected && (
        <Modal title={`Orden #${String(selected.id).slice(0,8)}`} onClose={() => setSelected(null)}>
          <div className="space-y-4 mb-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm">Cliente: <span className="text-amber-500 font-bold text-lg">{selected.customer_name}</span></p>
                {!selected.isNew && selected.order_status !== 'Despachado' && (
                   <div className="text-right">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Tiempo en espera</p>
                     <div className="text-sm"><Timer startTime={selected.created_at} /></div>
                   </div>
                )}
              </div>
              <p className="text-slate-400 text-sm">Teléfono: <span className="text-white font-bold">{selected.phone || 'N/A'}</span></p>
              <p className="text-slate-400 text-sm">Dirección: <span className="text-white font-bold">{selected.customer_address}</span></p>
              
              {selected.observation && (
                <div className="mt-3 pt-3 border-t border-slate-900 flex gap-2">
                  <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Observaciones:</p>
                    <p className="text-sm text-slate-200 italic">"{selected.observation}"</p>
                  </div>
                </div>
              )}
            </div>

            <ul className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 px-4">
              {parseItems(selected).map((item, i) => (
                <li key={i} className="flex justify-between py-3 text-sm">
                  <span className="text-slate-200"><strong className="text-amber-500 mr-2">{item.qty}x</strong> {item.name}</span>
                  <span className="text-slate-400">{formatCurrency(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-bold text-sm">TOTAL</span>
              <span className="text-amber-500 font-bold text-2xl">{formatCurrency(selected.total_amount)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {selected.isNew ? (
              <>
                <Button variant="danger" icon={XCircle} onClick={() => { updateStatus(selected.id, { payment_status: 'Rechazado' }); setSelected(null); }}>Rechazar</Button>
                <Button variant="success" icon={CheckCircle} onClick={() => handleConfirm(selected)}>Confirmar</Button>
              </>
            ) : (
              selected.order_status !== 'Despachado' && (
                <Button variant="primary" className="col-span-2" icon={Truck} onClick={() => handleDispatch(selected.id)}>Despachar</Button>
              )
            )}
            <Button variant="secondary" icon={Printer} className="col-span-2" onClick={() => { handlePrint(selected); setSelected(null); }}>Imprimir</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PedidosTab;