import React, { useState, useEffect } from 'react';

interface TickerData {
  symbol: string;
  name: string;
  current: number;
  change_amt: number;
  change_pct: number;
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

  const renderCard = (item: TickerData, prefix = '') => {
    const isUp = item.change_pct >= 0;
    const colorClass = isUp ? 'text-red-400' : 'text-blue-400';

    return (
      <div key={item.symbol} className="bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl p-4 transition-colors">
        <h4 className="font-bold text-slate-300 text-sm mb-2">{item.name}</h4>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black text-white">
            {prefix}{item.current.toLocaleString(undefined, { minimumFractionDigits: item.current < 100 ? 2 : 0, maximumFractionDigits: item.current < 100 ? 2 : 0 })}
          </span>
          <span className={`text-sm font-bold ${colorClass}`}>
            {isUp ? '+' : ''}{item.change_pct.toFixed(1)}%
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          {item.symbol.replace('=F', '').replace('=X', '')}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(item => renderCard(item, prefix))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 flex items-center gap-2">
            <span className="bg-cyan-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-widest mr-1">LIVE</span>
            나이트 스카우터 (야간 추종 시황)
          </h2>
          <p className="text-slate-400 text-sm font-medium">글로벌 야간 선물과 ETF 움직임으로 내일의 국장 추종치를 확인하세요.</p>
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
        <div className="space-y-2">
          {renderSection("KR한국 주식", data.kr_stocks, "₩")}
          {renderSection("ETF", data.etf)}
          {renderSection("미국 주식", data.us_stocks, "$")}
          {renderSection("지수", data.indices)}
          {renderSection("환율 / 원자재", data.fx_commodities)}
          {renderSection("가상화폐", data.crypto)}
        </div>
      ) : (
        <div className="text-center py-20 text-red-400">데이터 로드 실패</div>
      )}
    </div>
  );
};
