import Card from './Card';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
    <Card className="w-full max-w-lg relative max-h-[90vh] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><X size={20} /></button>
      </div>
      <div className="overflow-y-auto no-scrollbar pb-4">
        {children}
      </div>
    </Card>
  </div>
);
export default Modal;