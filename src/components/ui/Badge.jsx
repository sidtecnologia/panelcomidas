const Badge = ({ children, color = 'gray' }) => {
  const styles = {
    gray: 'bg-slate-800 text-slate-300 border-slate-700',
    green: 'bg-emerald-950 text-emerald-400 border-emerald-900',
    red: 'bg-red-950 text-red-400 border-red-900',
    yellow: 'bg-amber-950 text-amber-500 border-amber-900/50'
  };
  return <span className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${styles[color] || styles.gray}`}>{children}</span>;
};
export default Badge;