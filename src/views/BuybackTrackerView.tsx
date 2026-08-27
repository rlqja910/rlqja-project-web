import React, { useState, useEffect } from 'react';

type Buyback = {
  id: number;
  companyName: string;
  ticker: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  comment: string;
  updatedAt: string;
};

export const BuybackTrackerView: React.FC = () => {
  const [buybacks, setBuybacks] = useState<Buyback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBuybacks();
  }, []);

  const fetchBuybacks = async () => {
    try {
      const response = await fetch('/api/buybacks');
      if (response.ok) {
        const data = await response.json();
        setBuybacks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        {/* Animated fiery background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 mb-2 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
            <span className="text-4xl animate-bounce">🔥</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 tracking-tight drop-shadow-lg">
            국장 자사주 소각장
          </h2>
          <p className="text-orange-100/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            국내 주주가치를 높이는 최고의 호재, <strong className="text-orange-400">자사주 매입 및 소각!</strong><br />
            실시간 공시를 기반으로 국내 기업들이 약속한 자사주를 얼마나 불태우고 있는지 추적합니다.<br />
            <span className="inline-block mt-3 px-3 py-1 bg-red-900/50 border border-red-500/50 text-red-200 text-xs sm:text-sm rounded-full font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              ⚠️ 100억 원 이상의 굵직한 빅딜(Big Deal) 공시만 취급합니다!
            </span>
          </p>
          
          <button 
            onClick={fetchBuybacks}
            className="mt-6 px-6 py-2.5 bg-black/40 hover:bg-black/60 border border-orange-500/30 text-orange-400 rounded-full font-bold text-sm transition-all flex items-center gap-2 mx-auto"
          >
            <span>현황 업데이트</span> 🔄
          </button>
        </div>
      </div>

      {/* Tracker List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 text-orange-500/50 animate-pulse font-bold text-lg">
            🔥 용광로 온도 올리는 중...
          </div>
        ) : buybacks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-500">
            아직 추적 중인 기업이 없습니다.<br/>
            (곧 역대급 소각 기업이 추가될 예정입니다!)
          </div>
        ) : (
          <div className="grid gap-6">
            {buybacks.map((buyback) => {
              const percentage = Math.min(100, Math.max(0, (buyback.currentValue / buyback.targetValue) * 100));
              
              return (
                <div key={buyback.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 hover:border-orange-500/50 rounded-3xl p-6 sm:p-8 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group relative overflow-hidden">
                  
                  {/* Subtle background glow based on progress */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" 
                    style={{ width: `${percentage}%` }}
                  ></div>

                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                          {buyback.ticker}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{buyback.companyName}</h3>
                      </div>
                      <p className="text-orange-400 font-bold text-sm sm:text-base">
                        {buyback.comment}
                      </p>
                    </div>
                    
                    <div className="text-left sm:text-right bg-black/30 p-4 rounded-2xl border border-slate-800/80 shrink-0">
                      <div className="text-xs text-slate-500 font-medium mb-1">소각 목표 진행률</div>
                      <div className="text-3xl font-black text-white flex items-baseline gap-1 justify-start sm:justify-end">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                          {percentage.toFixed(1)}
                        </span>
                        <span className="text-lg text-orange-500">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Area */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-400">현재 <span className="text-white">{buyback.currentValue.toLocaleString()}</span> {buyback.unit}</span>
                      <span className="text-slate-500">목표 <span className="text-slate-300">{buyback.targetValue.toLocaleString()}</span> {buyback.unit}</span>
                    </div>
                    
                    <div className="h-4 sm:h-6 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 relative overflow-hidden transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      >
                        {/* Shimmer effect inside the bar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <span className="text-8xl">🔥</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
