import React, { useState, useEffect } from 'react';
import { PORTAL_MENUS } from '../config/menu';

interface MarketPredict {
  ewy: { current: number; change_amt: number; change_pct: number; };
  usdkrw: { current: number; change_amt: number; change_pct: number; };
  kospi: { current: number; predicted: number; change_amt: number; change_pct: number; };
  kosdaq: { current: number; predicted: number; change_amt: number; change_pct: number; };
}

export const HomeView: React.FC = () => {
  const [expandedCats, setExpandedCats] = useState<string[]>(['finance', 'utilities', 'trends']);
  const [marketStatus, setMarketStatus] = useState<{ kr_closed: boolean, us_closed: boolean } | null>(null);
  const [predictData, setPredictData] = useState<MarketPredict | null>(null);
  const [fearAndGreed, setFearAndGreed] = useState<{ value: number, classification: string } | null>(null);

  useEffect(() => {
    fetch('/api/market-status?t=' + new Date().getTime(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setMarketStatus(data))
      .catch(err => console.error(err));

    fetch('/api/fear-and-greed?t=' + new Date().getTime(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFearAndGreed({ value: data.value, classification: data.classification });
      })
      .catch(err => console.error(err));

    const fetchPredict = () => {
      fetch('/api/market-predict?t=' + new Date().getTime(), { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.success) setPredictData(data);
        })
        .catch(err => console.error(err));
    };
    fetchPredict();
    const interval = setInterval(fetchPredict, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };
  const handleCardClick = (id: string, isReady: boolean) => {
    if (!isReady) {
      alert("열심히 개발 중인 기능입니다! 🛠️");
      return;
    }
    window.location.hash = id;
  };

  return (
    <section className="space-y-10 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8 sm:py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[800px] h-64 bg-purple-600/10 rounded-[100%] blur-3xl pointer-events-none"></div>
        {marketStatus && (
          <div className="flex justify-center gap-4 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${marketStatus.kr_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              🇰🇷 한국증시: {marketStatus.kr_closed ? '휴장' : '개장'}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${marketStatus.us_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              🇺🇸 미국증시: {marketStatus.us_closed ? '휴장' : '개장'}
            </span>
          </div>
        )}
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight break-keep tracking-tight">
          당신의 모든 것을 위한 <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            KOREKORE 
          </span>
        </h2>
        <p className="relative text-base sm:text-lg text-slate-400 max-w-2xl mx-auto break-keep">
          투자 분석부터 일상 편의 도구까지, 상상하는 모든 기능이 이곳에 모입니다. 원하는 도구를 선택해보세요!
        </p>

        {fearAndGreed && (
          <div className="mt-8 max-w-sm mx-auto bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-[11px] sm:text-xs font-black text-slate-400 tracking-widest mb-1 uppercase">글로벌 위험자산 선호도 (Crypto)</h3>
              <div className="text-[10px] text-slate-500 mb-2">공포 탐욕 지수 (Fear & Greed Index)</div>
              
              <div className="relative flex items-center justify-center mb-3">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {fearAndGreed.value}
                </div>
              </div>

              <div className="w-full h-2 sm:h-2.5 bg-slate-800 rounded-full overflow-hidden relative mb-2">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    fearAndGreed.value <= 25 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                    fearAndGreed.value <= 45 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' :
                    fearAndGreed.value <= 55 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' :
                    fearAndGreed.value <= 75 ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.8)]' :
                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                  }`}
                  style={{ width: `${Math.min(Math.max(fearAndGreed.value, 0), 100)}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[9px] font-bold text-slate-500 px-1 mb-2">
                <span>0 (공포)</span>
                <span>50 (중립)</span>
                <span>100 (탐욕)</span>
              </div>

              <div className={`mt-1 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm border backdrop-blur-sm ${
                fearAndGreed.value <= 25 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                fearAndGreed.value <= 45 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                fearAndGreed.value <= 55 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                fearAndGreed.value <= 75 ? 'bg-lime-500/20 text-lime-400 border-lime-500/30' :
                'bg-green-500/20 text-green-400 border-green-500/30'
              }`}>
                {
                  fearAndGreed.value <= 25 ? '😱 극단적 공포 (Extreme Fear)' :
                  fearAndGreed.value <= 45 ? '😨 공포 (Fear)' :
                  fearAndGreed.value <= 55 ? '😐 중립 (Neutral)' :
                  fearAndGreed.value <= 75 ? '😏 탐욕 (Greed)' :
                  '🤑 극단적 탐욕 (Extreme Greed)'
                }
              </div>
            </div>
          </div>
        )}

        {predictData && (
          <div className="mt-8 max-w-3xl mx-auto bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 sm:p-5 relative flex flex-col items-center gap-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
              <span>🔮 국장 라이브 예측</span>
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-6 text-xs sm:text-base w-full px-1">
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span className="text-slate-400">코스피</span>
                <span className="font-bold text-white">{predictData.kospi.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`font-bold ${predictData.kospi.change_pct >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {predictData.kospi.change_pct >= 0 ? '▲' : '▼'}{Math.abs(predictData.kospi.change_amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span className="text-slate-400">코스닥</span>
                <span className="font-bold text-white">{predictData.kosdaq.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`font-bold ${predictData.kosdaq.change_pct >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {predictData.kosdaq.change_pct >= 0 ? '▲' : '▼'}{Math.abs(predictData.kosdaq.change_amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-slate-700"></div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span className="text-slate-400">EWY</span>
                <span className={`font-bold ${predictData.ewy.change_pct >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {predictData.ewy.change_pct > 0 ? '+' : ''}{predictData.ewy.change_pct}%
                </span>
              </div>
              {predictData.usdkrw && (
                <>
                  <div className="hidden sm:block w-px h-3 bg-slate-700"></div>
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <span className="text-slate-400">환율</span>
                    <span className="font-bold text-white">{predictData.usdkrw.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`font-bold ${predictData.usdkrw.change_pct >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                      {predictData.usdkrw.change_pct > 0 ? '+' : ''}{predictData.usdkrw.change_pct}%
                    </span>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => window.location.hash = 'kore-live'}
              className="mt-2 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold text-cyan-300 transition-colors flex items-center gap-1 shadow-lg"
            >
              한국 주식 24h 라이브 <span className="text-lg leading-none">›</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8 sm:space-y-12">
        {PORTAL_MENUS.map((main) => {
          const isExpanded = expandedCats.includes(main.id);
          return (
            <div key={main.id} className="space-y-4">
              <div 
                className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 cursor-pointer group select-none"
                onClick={() => toggleCategory(main.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl transition-transform group-hover:scale-110">{main.icon}</span>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{main.label}</h3>
                </div>
                <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 !m-0'}`}>
                {main.subCategories.map((sub) => (
                  sub.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.id, item.isReady)}
                      className={`relative overflow-hidden group rounded-2xl p-4 transition-all duration-300 ${
                        item.isReady
                          ? 'bg-slate-800/30 hover:bg-slate-800/80 border-slate-700/50 hover:border-cyan-500/50 cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]'
                          : 'bg-slate-900/30 border-slate-800/50 cursor-not-allowed opacity-60 grayscale'
                      } border backdrop-blur-sm flex items-center text-left gap-4`}
                    >
                      {!item.isReady && (
                        <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg border-b border-l border-slate-700">
                          준비 중
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${item.isReady ? 'bg-slate-700/50 group-hover:bg-cyan-500/10' : 'bg-slate-800/50'}`}>
                        <span className={`text-2xl transition-transform duration-300 ${item.isReady ? 'group-hover:scale-110' : ''}`}>
                          {item.icon}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm sm:text-[15px] font-bold mb-0.5 break-keep leading-tight transition-colors ${item.isReady ? 'text-slate-200 group-hover:text-cyan-300' : 'text-slate-500'}`}>
                          {item.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 break-keep leading-tight mt-1">
                          {sub.label}
                        </p>
                      </div>
                    </div>
                  ))
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
