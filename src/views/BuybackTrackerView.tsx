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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 px-2 sm:px-0">
      <div className="relative rounded-3xl overflow-hidden border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 mb-2 shadow-[0_0_30px_rgba(249,115,22,0.5)]">
            <span className="text-4xl animate-bounce">🔥</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500 tracking-tight drop-shadow-lg">
            국장 자사주 소각장
          </h2>
          <p className="text-orange-100/80 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            국내 주주가치를 높이는 최고의 호재, <strong className="text-orange-400">자사주 매입 및 소각!</strong><br />
            실시간 공시를 기반으로 국내 기업들이 약속한 자사주를 얼마나 불태우고 있는지 추적합니다.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/40 p-4 rounded-2xl border border-orange-500/20">
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
                {displayList.map((buyback) => {
                  const percentage = Math.min(100, Math.max(0, (buyback.currentValue / buyback.targetValue) * 100));
                  const isCompleted = percentage >= 100;
                  
                  return (
                    <div key={buyback.id} className={`bg-slate-900/80 backdrop-blur-sm border ${isCompleted ? 'border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-slate-700/50 hover:border-orange-500/50'} rounded-2xl p-4 sm:p-5 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] group relative overflow-hidden flex flex-col justify-between h-full`}>
                      
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r ${isCompleted ? 'from-yellow-500/10 to-yellow-600/10' : 'from-orange-500/5 to-red-500/5'} opacity-0 group-hover:opacity-100 transition-opacity`} 
                        style={{ width: `${percentage}%` }}
                      ></div>

                      <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {buyback.ticker}
                            </span>
                            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5 truncate">
                              {buyback.companyName}
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 whitespace-nowrap">
                                  👑 완료
                                </span>
                              )}
                            </h3>
                          </div>
                          <p className="text-orange-400 font-bold text-xs sm:text-sm line-clamp-2 leading-snug">
                            {buyback.comment}
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
                          <span>{buyback.currentValue.toLocaleString()} {buyback.unit}</span>
                          <span>목표 {buyback.targetValue.toLocaleString()} {buyback.unit}</span>
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
