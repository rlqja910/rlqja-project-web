import React from 'react';

interface FearGreedGaugeProps {
  value: number;
  classification: string;
  title: string;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ value, title }) => {
  const getColor = (val: number) => {
    if (val <= 25) return '#ef4444'; // Extreme Fear (Red)
    if (val <= 45) return '#f97316'; // Fear (Orange)
    if (val <= 55) return '#eab308'; // Neutral (Yellow)
    if (val <= 75) return '#84cc16'; // Greed (Lime)
    return '#22c55e'; // Extreme Greed (Green)
  };

  const getStatusText = (val: number) => {
    if (val <= 25) return '극심한 공포';
    if (val <= 45) return '공포';
    if (val <= 55) return '중립';
    if (val <= 75) return '탐욕';
    return '극심한 탐욕';
  };

  const color = getColor(value);
  const statusText = getStatusText(value);
  
  return (
    <div className="flex flex-col retro-panel p-4 flex-1 w-full max-w-sm">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-xs sm:text-sm font-pixel text-gray-300">
          {title}
        </h3>
        <span className="text-lg font-pixel pokemon-title drop-shadow-[2px_2px_0_#000]" style={{ color }}>
          {statusText}
        </span>
      </div>
      
      <div className="retro-health-bar-container h-6 sm:h-8 w-full mb-2 bg-black">
        <div 
          className="retro-health-bar-fill" 
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] sm:text-xs font-pixel text-gray-400">현재 상태</span>
        <span className="text-xs sm:text-sm font-pixel text-white">
          INDEX <span style={{ color }}>{value}</span> / 100
        </span>
      </div>
    </div>
  );
};
