import React, { useState, useEffect } from 'react';
import { useMagaMode } from '../hooks/useMagaMode';

interface TickerData {
  symbol: string;
  name: string;
  current: number;
  change_amt: number;
  change_pct: number;
  is_estimated?: boolean;
}

interface FuturesData {
  kr_stocks: TickerData[];
  etf: TickerData[];
  us_stocks: TickerData[];
  indices: TickerData[];
  fx_commodities: TickerData[];
  crypto: TickerData[];
}

export const KoreLiveView: React.FC = () => {
  const [data, setData] = useState<FuturesData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { isMagaMode } = useMagaMode();

  const fetchFutures = () => {
    fetch('/api/market-futures')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
          setLastUpdated(new Date());
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFutures();
    const interval = setInterval(fetchFutures, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderCard = (item: TickerData, sectionPrefix = '', index = 0) => {
    // Fake the data if MAGA mode is on
    const displayCurrent = isMagaMode ? item.current * 1.352 : item.current;
    const displayPct = isMagaMode ? Math.abs(item.change_pct) * 2.5 + 20.5 : item.change_pct;

    const isUp = displayPct >= 0;
    
    // 한국 주식/ETF 여부
    const isKorean = item.symbol.endsWith('.KS') || item.symbol.endsWith('.KQ');
    const finalPrefix = isKorean ? '₩' : sectionPrefix;
    const isKrw = finalPrefix === '₩';
    
    // 포맷팅
    const formatOptions = !isKrw 
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } 
      : { minimumFractionDigits: displayCurrent < 100 ? 2 : 0, maximumFractionDigits: displayCurrent < 100 ? 2 : 0 };

    // 지리는 프리미엄 스타일링 (Glassmorphism + Neon Glow)
    const bgBase = isMagaMode
      ? 'bg-gradient-to-br from-red-950/80 to-red-900/40 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]'
      : isUp
        ? 'bg-gradient-to-br from-[#1e1b4b]/80 to-[#0f172a]/90 border-red-500/30 shadow-[0_4px_20px_-5px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:border-red-400/60'
        : 'bg-gradient-to-br from-[#082f49]/80 to-[#0f172a]/90 border-blue-500/30 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:border-blue-400/60';

    const titleColor = isMagaMode 
      ? 'text-orange-200 group-hover:text-red-100'
      : 'text-slate-300 group-hover:text-white';

    const priceColor = isMagaMode
      ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]'
      : 'text-white';

    const badgeBg = isMagaMode
      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
      : isUp
        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

    return (
      <div 
        key={item.symbol} 
        className={`group relative backdrop-blur-xl border rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1 ${bgBase} animate-in fade-in slide-in-from-bottom-4`}
        style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
      >
        {/* 추정가 표시 (은은한 글로우 바) */}
        {item.is_estimated && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 blur-[1px]"></div>
        )}

        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-bold text-[13px] tracking-tight leading-snug transition-colors truncate pr-2 ${titleColor}`}>
            {item.name}
          </h4>
          {item.is_estimated && (
            <span className="text-[9px] font-black tracking-widest text-cyan-300 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/30 shadow-[0_0_5px_rgba(34,211,238,0.4)] whitespace-nowrap">EST</span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1 mb-1.5">
            {!isKrw && <span className="text-slate-400 text-sm font-semibold">{finalPrefix}</span>}
            <span className={`text-lg sm:text-[22px] font-black tracking-tighter ${priceColor}`}>
              {displayCurrent.toLocaleString(undefined, formatOptions)}
            </span>
            {isKrw && <span className="text-slate-400 text-sm font-semibold ml-0.5">원</span>}
          </div>
          
          <div className="flex items-center">
            <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm transition-colors ${badgeBg}`}>
              {isUp ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {Math.abs(displayPct).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, items: TickerData[], prefix = '', icon = '') => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-8 animate-in fade-in duration-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px bg-gradient-to-r from-slate-700 to-transparent flex-1"></div>
          <h3 className="text-sm font-black text-slate-300 tracking-widest flex items-center gap-2 uppercase">
            <span className="text-lg">{icon}</span> {title}
          </h3>
          <div className="h-px bg-gradient-to-l from-slate-700 to-transparent flex-1"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item, idx) => renderCard(item, prefix, idx))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12 overflow-hidden">
      {/* 프리미엄 헤더 영역 */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/80 pb-6">
        {/* 장식용 글로우 배경 */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-10 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            </span>
            <span className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/50">
              Live Tracker
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-slate-400 tracking-tight drop-shadow-sm mb-3">
            GLOBAL MARKET
          </h2>
          
          <p className="text-slate-400 text-[13px] sm:text-sm font-medium leading-relaxed max-w-2xl">
            글로벌 금융 시장의 심장 박동을 실시간으로 추적합니다.<br />
            <span className="inline-flex items-center gap-1.5 mt-2 bg-slate-800/60 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-lg text-xs shadow-inner">
              <span className="text-cyan-400">💡</span> 한국 주식 야간 추정가는 미국 및 글로벌 시황을 종합하여 실시간으로 계산됩니다.
            </span>
          </p>
        </div>

        <div className="relative z-10 flex flex-row items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Updated</span>
            <div className="text-sm font-mono font-bold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-inner">
              {lastUpdated.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </div>
          </div>
          
          <button
            onClick={() => { setIsLoading(true); fetchFutures(); }}
            className="group relative flex items-center justify-center w-10 h-10 bg-gradient-to-b from-slate-700 to-slate-800 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-slate-600 hover:border-cyan-400 active:scale-95"
            title="수동 갱신"
          >
            <span className="group-hover:rotate-180 transition-transform duration-500 ease-in-out">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
          </div>
          <span className="text-xs font-bold text-cyan-400 tracking-widest animate-pulse">CONNECTING...</span>
        </div>
      ) : data ? (
        <div className="space-y-6 relative z-10">
          {renderSection("한국 주식 (추정가)", data.kr_stocks, "₩", "🇰🇷")}
          {renderSection("글로벌 지수", data.indices, "", "📈")}
          {renderSection("미국 주식", data.us_stocks, "$", "🇺🇸")}
          {renderSection("주요 ETF", data.etf, "$", "📊")}
          {renderSection("환율 및 원자재", data.fx_commodities, "", "💱")}
          {renderSection("가상화폐", data.crypto, "$", "🪙")}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 space-y-3">
          <div className="w-12 h-12 bg-red-950/50 rounded-full flex items-center justify-center border border-red-500/30">
            <span className="text-xl">⚠️</span>
          </div>
          <div className="text-center font-bold text-red-400">데이터를 불러오지 못했습니다.</div>
          <button 
            onClick={() => { setIsLoading(true); fetchFutures(); }}
            className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors border border-slate-700"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
};
