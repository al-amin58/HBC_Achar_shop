import { useState, useEffect } from "react";

/**
 * CountdownTimer
 * @prop {string|null} endTime - ISO datetime string from DB (flashSaleEndsAt)
 * endTime না থাকলে "00:00:00" দেখাবে
 */
const CountdownTimer = ({ endTime }) => {
  const calcRemaining = () => {
    if (!endTime) return { h: 0, m: 0, s: 0, expired: true };
    const diff = Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000));
    return {
      h: Math.floor(diff / 3600),
      m: Math.floor((diff % 3600) / 60),
      s: diff % 60,
      expired: diff === 0,
    };
  };

  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(() => {
      const next = calcRemaining();
      setTime(next);
      if (next.expired) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n) => String(n).padStart(2, "0");
  const labels = { h: "ঘণ্টা", m: "মিনিট", s: "সেকেন্ড" };

  if (time.expired) {
    return (
      <span className="text-xs font-bold text-red-400 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
        Flash Sale শেষ হয়েছে
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {["h", "m", "s"].map((unit, i) => (
        <div key={unit} className="flex items-center gap-1">
          {/* Time block */}
          <div className="flex flex-col items-center">
            <span className="bg-red-600 text-white text-sm font-bold w-9 h-9 rounded-lg flex items-center justify-center shadow-md tabular-nums">
              {pad(time[unit])}
            </span>
            <span className="text-[9px] text-red-400 font-medium mt-0.5 tracking-wide">
              {labels[unit]}
            </span>
          </div>
          {/* Colon separator */}
          {i < 2 && (
            <span className="text-red-500 font-extrabold text-lg mb-3 mx-0.5">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;