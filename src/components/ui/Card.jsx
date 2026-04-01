const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-5 ${className}`}>{children}</div>
);
export default Card;