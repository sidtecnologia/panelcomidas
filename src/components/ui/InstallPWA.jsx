import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setShowToast(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!showToast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in fade-in slide-in-from-top-8 duration-500">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div className="h-full bg-amber-500 animate-[progress_5s_linear_forwards]" />
        </div>

        <div className="flex items-center gap-4 mt-1">
          <div className="shrink-0">
            <img src="/favicon.png" alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm">Instalar Panel</h3>
            <p className="text-slate-400 text-[11px] leading-tight">Accede más rápido desde tu pantalla de inicio</p>
            
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleInstall}
                className="flex-[2] bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black py-2 rounded-lg transition-colors flex items-center justify-center gap-1 uppercase tracking-tighter"
              >
                <Download size={14} />
                Instalar
              </button>
              <button 
                onClick={() => setShowToast(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold py-2 rounded-lg transition-colors uppercase tracking-tighter"
              >
                Después
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowToast(false)}
          className="absolute top-3 right-3 text-slate-600 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
};

export default InstallPWA;