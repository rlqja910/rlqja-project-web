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

  const renderCard = (item: TickerData, prefix = '') => {
    const isUp = item.change_pct >= 0;
    const colorClass = isUp ? 'text-red-400' : 'text-blue-400';
    const isEst = item.is_estimated;

    return (
      <div key={item.symbol} className={`relative bg-slate-800/60 hover:bg-slate-700/80 border ${isEst ? 'border-purple-500/30' : 'border-slate-700/50'} rounded-lg p-2.5 transition-colors`}>
        {isEst && <div className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm">야간 추정</div>}
        <h4 className="font-bold text-slate-300 text-xs mb-1 truncate pr-6">{item.name.replace(' (추정)', '')}</h4>
        <div className="flex flex-col mb-1">
          <span className="text-sm sm:text-base font-black text-white leading-none">
            {prefix}{item.current.toLocaleString(undefined, { minimumFractionDigits: item.current < 100 ? 2 : 0, maximumFractionDigits: item.current < 100 ? 2 : 0 })}
          </span>
          <span className={`text-[11px] font-bold mt-0.5 ${colorClass}`}>
            {isUp ? '▲' : '▼'}{Math.abs(item.change_pct).toFixed(2)}%
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 flex items-center gap-2">
            <span className="bg-cyan-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-widest mr-1">LIVE</span>
            KORU NIGHT (야간 실시간 시황)
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            전 세계 주요 시황을 가장 빠르게 확인하세요. <br/>
            <span className="text-xs text-purple-400 font-bold mt-1 inline-block">※ 한국 주식의 야간 추정가는 24시간 실시간으로 변동하는 나스닥 100 선물(NQ=F) 지수의 등락률을 반영하여 1분 단위로 자동 계산됩니다.</span>
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
