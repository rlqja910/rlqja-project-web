import React, { useState, useEffect } from 'react';

type Buyback = {
  id: number;
  companyName: string;
  ticker: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  marketType: 'KOSPI' | 'KOSDAQ';
  comment: string;
  updatedAt: string;
};

export const BuybackTrackerView: React.FC = () => {
  const [buybacks, setBuybacks] = useState<Buyback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeMarket, setActiveMarket] = useState<'ALL' | 'KOSPI' | 'KOSDAQ'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'progress' | 'targetValue' | 'newest'>('targetValue');
  const [showHallOfFame, setShowHallOfFame] = useState(false);

  useEffect(() => {
    fetchBuybacks();
    const interval = setInterval(fetchBuybacks, 60000);
    return () => clearInterval(interval);
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

  const filteredAndSortedBuybacks = buybacks
    .filter(bb => {
      if (activeMarket !== 'ALL' && bb.marketType !== activeMarket) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return bb.companyName.toLowerCase().includes(query) || bb.ticker.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') {
        return (b.currentValue / b.targetValue) - (a.currentValue / a.targetValue);
      } else if (sortBy === 'targetValue') {
        return b.targetValue - a.targetValue;
      } else {
        return b.id - a.id;
      }
    });

  return (
    <div className="w-full mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/80 pb-6">
        {/* 장식용 글로우 배경 */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-10 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
            </span>
            <span className="text-xs font-black tracking-[0.2em] text-orange-400 uppercase bg-orange-950/40 px-2.5 py-1 rounded-md border border-orange-800/50">
              Live Tracker
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-100 to-red-400 tracking-tight drop-shadow-sm mb-3">
            자사주 소각 트래커
          </h2>
          
          <p className="text-slate-400 text-[13px] sm:text-sm font-medium leading-relaxed max-w-2xl mb-6">
            한국 주식 시장의 주주환원(자사주 취득 및 소각) 현황을 실시간으로 추적합니다.<br />
            <span className="inline-flex items-center gap-1.5 mt-2 bg-slate-800/60 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-lg text-xs shadow-inner">
              <span className="text-orange-400">💡</span> 진도율 100% 달성 시 명예의 전당으로 이동합니다.
            </span>
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="flex bg-slate-900 p-1 rounded-xl w-full md:w-auto">
              {['ALL', 'KOSPI', 'KOSDAQ'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveMarket(tab as any)}
                  className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeMarket === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab === 'ALL' ? '전체' : tab}
                </button>
              ))}
            </div>

            <div className="w-full relative">
              <input 
                type="text" 
                placeholder="검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-white px-3 py-2 text-sm rounded-xl border border-slate-700 focus:border-orange-500 outline-none"
              />
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full md:w-auto bg-slate-900 text-white px-3 py-2 text-sm rounded-xl border border-slate-700 outline-none cursor-pointer"
            >
              <option value="targetValue">🔥 규모 큰 순</option>
              <option value="progress">📈 진행률 높은 순</option>
              <option value="newest">✨ 최신 순</option>
            </select>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="bg-black/40 p-1 rounded-xl border border-slate-700/50 inline-flex">
              <button 
                onClick={() => setShowHallOfFame(false)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!showHallOfFame ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-slate-400 hover:text-white'}`}
              >
                🔥 소각 진행 중
              </button>
              <button 
                onClick={() => setShowHallOfFame(true)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${showHallOfFame ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'text-slate-400 hover:text-white'}`}
              >
                👑 명예의 전당
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 text-orange-500/50 animate-pulse font-bold text-lg">🔥 용광로 온도 올리는 중...</div>
        ) : (
          (() => {
            const displayList = filteredAndSortedBuybacks.filter(bb => {
              const isCompleted = (bb.currentValue / bb.targetValue) >= 1;
              return showHallOfFame ? isCompleted : !isCompleted;
            });

            if (displayList.length === 0) {
              return (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-500">
                  {showHallOfFame ? '아직 명예의 전당에 오른 종목이 없습니다.' : '조건에 맞는 진행 중인 공시가 없습니다.'}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayList.map((bb, index) => {
                  const percentage = Math.min(100, Math.max(0, (bb.currentValue / bb.targetValue) * 100));
                  const isCompleted = percentage >= 100;
                  
                  return (
                    <div 
                      key={bb.id} 
                      className={`relative overflow-hidden group bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)] hover:border-orange-500/50 animate-in fade-in slide-in-from-bottom-4`}
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full blur-2xl group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-colors"></div>
                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {bb.ticker}
                            </span>
                            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5 truncate">
                              {bb.companyName}
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 whitespace-nowrap">
                                  👑 완료
                                </span>
                              )}
                            </h3>
                          </div>
                          <p className="text-orange-400 font-bold text-xs sm:text-sm line-clamp-2 leading-snug">
                            {bb.comment}
                          </p>
                        </div>
                        
                        <div className="text-left sm:text-right bg-black/30 p-2 sm:p-3 rounded-xl border border-slate-800/80 shrink-0 self-start sm:self-center">
                          <div className="text-[10px] text-slate-500 font-medium mb-0.5">진행률</div>
                          <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1 justify-start sm:justify-end">
                            <span className={`text-transparent bg-clip-text ${isCompleted ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                              {percentage.toFixed(1)}
                            </span>
                            <span className={`text-[10px] ${isCompleted ? 'text-yellow-500' : 'text-orange-500'}`}>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-1.5 font-bold">
                          <span>{bb.currentValue.toLocaleString()} {bb.unit}</span>
                          <span>목표 {bb.targetValue.toLocaleString()} {bb.unit}</span>
                        </div>
                        
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                          <div 
                            className={`h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600'}`}
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                          </div>
                        </div>
                      </div>

                      <div className={`absolute top-2 right-4 transition-opacity pointer-events-none ${isCompleted ? 'opacity-20 drop-shadow-[0_0_10px_rgba(234,179,8,1)]' : 'opacity-5 group-hover:opacity-10'}`}>
                        <span className="text-6xl">{isCompleted ? '👑' : '🔥'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
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
