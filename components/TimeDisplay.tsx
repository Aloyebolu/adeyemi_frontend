'use client';

import { useEffect, useState } from 'react';

export default function TimeDisplay() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-sm">{time}</span>;
}
