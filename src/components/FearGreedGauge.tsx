import React from 'react';

interface FearGreedGaugeProps {
  value: number;
  classification: string;
  title: string;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ value, classification, title }) => {
  // 0-25: Red (Extreme Fear)
  // 26-45: Orange (Fear)
  // 46-55: Yellow (Neutral)
  // 56-75: Lime (Greed)
  // 76-100: Green (Extreme Greed)
  
  const getColor = (val: number) => {
    if (val <= 25) return '#ef4444'; // red-500
    if (val <= 45) return '#f97316'; // orange-500
    if (val <= 55) return '#eab308'; // yellow-500
    if (val <= 75) return '#84cc16'; // lime-500
    return '#22c55e'; // green-500
  };

  const getEmoji = (val: number) => {
    if (val <= 25) return '😱';
    if (val <= 45) return '😨';
    if (val <= 55) return '😐';
    if (val <= 75) return '😏';
    return '🤑';
  };

  const color = getColor(value);
  const emoji = getEmoji(value);
  
  // Calculate rotation for the needle (-90deg to 90deg)
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 relative overflow-hidden flex-1">
      {/* Subtle background glow based on current state */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ background: `radial-gradient(circle at bottom, ${color} 0%, transparent 70%)` }}
      />
      
      <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 z-10 text-center">
        {title}
      </h3>
      
      {/* Gauge Container */}
      <div className="relative w-40 h-20 mb-2 z-10">
        {/* SVG Half Circle */}
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          {/* Background Track */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="#334155" 
            strokeWidth="20" 
            strokeLinecap="round" 
          />
          {/* Colored Segments */}
          <path d="M 20 100 A 80 80 0 0 1 44.7 42.4" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" className="opacity-80" />
          <path d="M 44.7 42.4 A 80 80 0 0 1 80 22.7" fill="none" stroke="#f97316" strokeWidth="20" className="opacity-80" />
          <path d="M 80 22.7 A 80 80 0 0 1 120 22.7" fill="none" stroke="#eab308" strokeWidth="20" className="opacity-80" />
          <path d="M 120 22.7 A 80 80 0 0 1 155.3 42.4" fill="none" stroke="#84cc16" strokeWidth="20" className="opacity-80" />
          <path d="M 155.3 42.4 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" strokeWidth="20" strokeLinecap="round" className="opacity-80" />
          
          {/* Needle pivot */}
          <circle cx="100" cy="100" r="8" fill="#cbd5e1" />
          
          {/* Needle */}
          <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 100px', transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <polygon points="96,100 104,100 100,20" fill="#f8fafc" filter="drop-shadow(0 0 4px rgba(255,255,255,0.5))" />
          </g>
        </svg>
      </div>
      
      <div className="flex flex-col items-center mt-2 z-10">
        <span className="text-3xl font-black mb-1" style={{ color, textShadow: `0 0 10px ${color}80` }}>
          {value}
        </span>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-slate-900/50 border whitespace-nowrap" style={{ color, borderColor: `${color}40` }}>
          {emoji} {classification}
        </span>
      </div>
    </div>
  );
};
