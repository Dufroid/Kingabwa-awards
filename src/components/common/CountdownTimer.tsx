import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`flex items-center justify-center ${compact ? 'gap-2 sm:gap-4 my-4' : 'gap-3 sm:gap-6 my-6'}`}>
      {[
        { label: 'Jours', value: timeLeft.days },
        { label: 'Heures', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Secondes', value: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className={`${compact ? 'w-12 h-12 sm:w-16 sm:h-16 rounded-xl' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl'} glass-card border border-gold-400/30 flex items-center justify-center shadow-gold-glow`}>
            <span className={`font-serif ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-black text-gold-gradient`}>
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className={`${compact ? 'text-[9px] mt-1.5' : 'text-[10px] sm:text-xs mt-2'} uppercase tracking-widest text-slate-400 font-bold`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
