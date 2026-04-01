import { useState } from 'react';
import { Utensils, XCircle, Eye, EyeOff } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LoginView = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-2xl border-slate-800 bg-slate-900">
        <div className="text-center mb-8">
          <div className="bg-amber-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Utensils className="text-amber-500" size={40}/>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">T! Traigo</h1>
          <p className="text-slate-400 mt-2 text-sm">Panel Administrativo</p>
        </div>
        {error && <div className="bg-red-950 border border-red-900 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-2"><XCircle size={18}/> {error}</div>}
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, pass); }} className="space-y-5">
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" 
            placeholder="Correo electrónico" 
            required
          />
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all" 
              placeholder="Contraseña" 
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button type="submit" className="w-full py-4 text-lg mt-2" disabled={loading}>
            {loading ? 'Accediendo...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginView;