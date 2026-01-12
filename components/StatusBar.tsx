
import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  isIncognito?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isIncognito }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className={`h-8 ${isIncognito ? 'bg-zinc-950 text-zinc-400' : 'bg-white text-black'} flex items-center justify-between px-6 text-xs font-medium transition-colors duration-500`}>
      <span>{formattedTime}</span>
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-signal"></i>
        <i className="fa-solid fa-wifi"></i>
        <i className="fa-solid fa-battery-full"></i>
      </div>
    </div>
  );
};

export default StatusBar;
