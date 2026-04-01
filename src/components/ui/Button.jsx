const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon, type = 'button' }) => {
  const styles = {
    primary: 'bg-amber-500 text-slate-900 hover:bg-amber-400',
    secondary: 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700',
    danger: 'bg-red-950 text-red-400 border border-red-900 hover:bg-red-900',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    ghost: 'text-slate-400 hover:text-amber-500 hover:bg-slate-800'
  };
  return (
    <button type={type} onClick={onClick} className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${styles[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} />} {children}
    </button>
  );
};
export default Button;