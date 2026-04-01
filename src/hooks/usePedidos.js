import { useState, useCallback, useEffect } from 'react';

const usePedidos = (api, statusFilter = 'Pendiente', fetchInterval = 30000) => {
  const [orders, setOrders] = useState([]);

  const load = useCallback(async () => {
    try {
      const endpoint = `/orders?select=*&order=created_at.desc&payment_status=eq.${statusFilter}`;
      const data = await api.request(endpoint);
      setOrders(data || []);
    } catch (e) {
      setOrders([]);
    }
  }, [api, statusFilter]);

  useEffect(() => {
    load();
    if (fetchInterval) {
      const id = setInterval(load, fetchInterval);
      return () => clearInterval(id);
    }
  }, [load, fetchInterval]);

  const updateStatus = async (id, payload) => {
    await api.request(`/orders?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    await load();
  };

  const confirmAndMove = async (order) => {
    try {
      const confirmedPayload = { ...order };
      delete confirmedPayload.id;
      delete confirmedPayload.isNew;

      confirmedPayload.order_status = 'Pendiente';
      confirmedPayload.payment_status = 'Confirmado';
      confirmedPayload.created_at = new Date().toISOString();

      await api.request('/orders_confirmed', { 
        method: 'POST', 
        body: JSON.stringify(confirmedPayload) 
      });

      await api.request(`/orders?id=eq.${order.id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      throw e;
    }
  };

  const markAsDispatched = async (id) => {
    await api.request(`/orders_confirmed?id=eq.${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify({ order_status: 'Despachado' }) 
    });
  };

  return { orders, load, updateStatus, confirmAndMove, markAsDispatched };
};

export default usePedidos;