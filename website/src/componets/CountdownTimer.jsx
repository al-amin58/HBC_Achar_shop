import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 4, m: 32, s: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 4; m = 32; s = 15; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5">
      {['h', 'm', 's'].map((unit, i) => (
        <div key={unit} className="flex items-center gap-1.5">
          <span className="bg-emerald-900  text-white text-2xl p-10  font-bold w-8 h-8 rounded-lg flex items-center justify-center">
            {pad(time[unit])}
          </span>
          {i < 2 && <span className="text-emerald-400 text-5xl sm:text-lg font-bold">:</span>}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;