import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../lib/config';
import { Calendar, DollarSign, PackageCheck, RefreshCw, Filter } from 'lucide-react';

const ContabilidadTab = ({ api }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({ periodTotal: 0, count: 0 });
  const [filter, setFilter] = useState('Hoy');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.request('/orders_confirmed?select=*&order=created_at.desc');
      const orders = data || [];
      setAllOrders(orders);
      applyFilter(orders, filter);
    } catch (e) {
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (orders, timeRange) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filtered = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      
      if (timeRange === 'Hoy') {
        return orderDate >= startOfToday;
      }
      
      if (timeRange === 'Semana') {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return orderDate >= lastWeek;
      }
      
      if (timeRange === 'Mes') {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return orderDate >= lastMonth;
      }
      
      return true;
    });

    const total = filtered.reduce((acc, o) => acc + (o.total_amount || 0), 0);
    setFilteredOrders(filtered);
    setStats({ periodTotal: total, count: filtered.length });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilter(allOrders, filter);
  }, [filter, allOrders]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-white tracking-tight">Balance de Ventas</h2>
        <button onClick={loadData} className="text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 gap-1">
        {['Hoy', 'Semana', 'Mes'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              filter === f ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-amber-500 border-none shadow-lg shadow-amber-500/20">
          <div className="flex items-center gap-4 text-slate-900">
            <div className="p-4 bg-white/20 rounded-2xl"><DollarSign size={32} /></div>
            <div>
              <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Total {filter}</p>
              <h4 className="text-3xl font-black text-white">{formatCurrency(stats.periodTotal)}</h4>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-slate-900 border-slate-800">
          <div className="p-3 bg-slate-800 rounded-xl text-amber-500"><PackageCheck size={24} /></div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase">Pedidos en el periodo</p>
            <h4 className="text-xl font-bold text-white">{stats.count} pedidos</h4>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-2 text-slate-400">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Historial Detallado ({filter})</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {filteredOrders.length === 0 && (
            <div className="text-center p-12 text-slate-600 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              No hay registros para este periodo.
            </div>
          )}
          {filteredOrders.map(o => (
            <div key={o.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors">
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{o.customer_name || 'Sin Nombre'}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {new Date(o.created_at).toLocaleDateString('es-CO')} • {new Date(o.created_at).toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-amber-500">{formatCurrency(o.total_amount)}</p>
                <Badge color={o.order_status === 'Despachado' ? 'green' : 'gray'}>{o.order_status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContabilidadTab;