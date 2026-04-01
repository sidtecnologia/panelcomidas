import { useState, useEffect } from 'react';

const Timer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const calculate = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - start) / 1000);

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      const display = h > 0 
        ? `${h}h ${m}m ${s}s` 
        : `${m}m ${s}s`;
      
      setElapsed(display);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const getUrgencyColor = () => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const minutes = (now - start) / 1000 / 60;

    if (minutes > 30) return 'text-red-500 font-black animate-pulse';
    if (minutes > 15) return 'text-amber-500 font-bold';
    return 'text-emerald-500';
  };

  return <span className={getUrgencyColor()}>{elapsed}</span>;
};

export default Timer;