import React, { useState, useEffect } from 'react';

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

  const renderCard = (item: TickerData, sectionPrefix = '') => {
    const isUp = item.change_pct >= 0;
    const colorClass = isUp ? 'text-red-400' : 'text-blue-400';
    
    // 심볼이 .KS 또는 .KQ로 끝나면 무조건 한국 주식/ETF이므로 원화 기호 사용
    const isKorean = item.symbol.endsWith('.KS') || item.symbol.endsWith('.KQ');
    const finalPrefix = isKorean ? '₩' : sectionPrefix;
    const isKrw = finalPrefix === '₩';
    
    // 원화(한국 주식)만 소수점 0자리, 그 외(미주, 지수, 환율, 코인 등)는 무조건 소수점 2자리 강제
    const formatOptions = !isKrw 
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } 
      : { minimumFractionDigits: item.current < 100 ? 2 : 0, maximumFractionDigits: item.current < 100 ? 2 : 0 };

    return (
      <div key={item.symbol} className="group relative bg-[#0f172a]/80 backdrop-blur-md hover:bg-[#1e293b] border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-3 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]">
        <h4 className="font-bold text-slate-300 text-xs mb-1.5 truncate group-hover:text-cyan-400 transition-colors">{item.name}</h4>
        <div className="flex flex-col mb-1">
          <span className="text-[15px] sm:text-lg font-black text-white tracking-tight leading-none mb-1">
            {finalPrefix}{item.current.toLocaleString(undefined, formatOptions)}
          </span>
          <span className={`text-[11px] font-bold mt-0.5 flex items-center gap-0.5 ${colorClass}`}>
            {isUp ? '▲' : '▼'} {Math.abs(item.change_pct).toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, items: TickerData[], prefix = '') => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2">
          {title} <span className="animate-pulse bg-green-500 w-1.5 h-1.5 rounded-full"></span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {items.map(item => renderCard(item, prefix))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] px-2 py-1 rounded-md font-black tracking-widest shadow-lg animate-pulse">LIVE</span>
            GLOBAL MARKET TRACKER
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            글로벌 마켓 연동 24시간 실시간 시황 보드 <br />
            <span className="text-[11px] sm:text-xs text-cyan-400/80 font-bold mt-1.5 inline-block bg-cyan-950/30 px-2 py-1 rounded">※ 한국 주식 추정가는 야간에 열려있는 해외 코인 거래소, 미국 주식, 글로벌 환율 등 전 세계의 모든 데이터를 종합해 내일 아침의 예상 가격을 10초마다 보여줍니다.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsLoading(true); fetchFutures(); }}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg font-bold transition-colors shadow-lg"
          >
            🔄 수동 갱신
          </button>
          <div className="text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            업데이트: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {renderSection("🇰🇷 한국 주식 (추정가)", data.kr_stocks, "₩")}
          {renderSection("📈 글로벌 지수", data.indices)}
          {renderSection("🇺🇸 미국 주식", data.us_stocks, "$")}
          {renderSection("📊 주요 ETF", data.etf, "$")}
          {renderSection("💱 환율 및 원자재", data.fx_commodities)}
          {renderSection("🪙 가상화폐", data.crypto, "$")}
        </div>
      ) : (
        <div className="text-center py-20 text-red-400">데이터 로드 실패</div>
      )}
    </div>
  );
};
