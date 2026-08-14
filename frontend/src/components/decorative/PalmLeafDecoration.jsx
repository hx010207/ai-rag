import React from 'react';

export default function PalmLeafDecoration({ position = 'top-right' }) {
  const isRight = position.includes('right');

  return (
    <div className={`absolute pointer-events-none opacity-20 hover:opacity-40 transition-opacity z-0 ${
      isRight ? '-top-6 -right-6' : '-bottom-6 -left-6 transform rotate-180'
    }`}>
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 95C50 95 55 70 85 50C95 43 98 35 98 25C98 15 90 5 80 5C70 5 60 15 55 25C50 35 50 95 50 95Z"
          fill="url(#palmGradient)"
        />
        <path
          d="M50 95C50 95 45 70 15 50C5 43 2 35 2 25C2 15 10 5 20 5C30 5 40 15 45 25C50 35 50 95 50 95Z"
          fill="url(#palmGradient)"
        />
        <defs>
          <linearGradient id="palmGradient" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
