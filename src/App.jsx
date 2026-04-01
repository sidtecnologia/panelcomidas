import React, { useState, useEffect } from 'react';
import { LogOut, ShoppingBag, Package, BarChart3 } from 'lucide-react';
import useApi from './hooks/useApi';
import { CONFIG, API_URLS } from './lib/config';
import LoginView from './views/LoginView';
import PedidosTab from './components/tabs/PedidosTab';
import ProductosTab from './components/tabs/ProductosTab';
import ContabilidadTab from './components/tabs/ContabilidadTab';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pedidos');

  useEffect(() => {
    const t = localStorage.getItem('sb_token');
    if (t) setSession({ access_token: t });
  }, []);

  const api = useApi(session?.access_token);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URLS.AUTH}/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': CONFIG.SB_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || 'Error de acceso');
      
      setSession(data);
      localStorage.setItem('sb_token', data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sb_token');
    setSession(null);
  };

  if (!session) return <LoginView onLogin={login} loading={loading} error={error} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/favicon.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-xl text-white tracking-tight">Panel Administrativo</span>
        </div>
        <button onClick={logout} className="p-2 text-slate-400 hover:text-amber-500 bg-slate-800 rounded-lg">
          <LogOut size={20}/>
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {activeTab === 'pedidos' && <PedidosTab api={api} />}
        {activeTab === 'productos' && <ProductosTab api={api} token={session.access_token} />}
        {activeTab === 'contabilidad' && <ContabilidadTab api={api} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-50 pb-safe">
        <button onClick={() => setActiveTab('pedidos')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'pedidos' ? 'text-amber-500 bg-slate-800' : 'text-slate-500'}`}>
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold mt-1">Pedidos</span>
        </button>
        <button onClick={() => setActiveTab('productos')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'productos' ? 'text-amber-500 bg-slate-800' : 'text-slate-500'}`}>
          <Package size={24} />
          <span className="text-[10px] font-bold mt-1">Productos</span>
        </button>
        <button onClick={() => setActiveTab('contabilidad')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'contabilidad' ? 'text-amber-500 bg-slate-800' : 'text-slate-500'}`}>
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold mt-1">Balance</span>
        </button>
      </nav>
    </div>
  );
}