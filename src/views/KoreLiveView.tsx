import React, { useState, useEffect } from 'react';

interface TickerData {
  symbol: string;
  name: string;
  current: number;
  change_amt: number;
  change_pct: number;
}

interface FuturesData {
  indices: TickerData[];
  tech: TickerData[];
  crypto: TickerData[];
}

export const KoreLiveView: React.FC = () => {
  const [data, setData] = useState<FuturesData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchFutures();
    const interval = setInterval(fetchFutures, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderCard = (item: TickerData) => {
    const isUp = item.change_pct >= 0;
    const colorClass = isUp ? 'text-red-400' : 'text-blue-400';
    const bgClass = isUp ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20';

    return (
      <div key={item.symbol} className={`relative p-5 rounded-2xl border ${bgClass} transition-all hover:bg-slate-800/80 hover:border-slate-600`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-white text-base sm:text-lg">{item.name}</h4>
            <span className="text-xs text-slate-500 font-medium">{item.symbol.replace('=F', '')}</span>
          </div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isUp ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {isUp ? '▲' : '▼'}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-white">
            {item.symbol.includes('BTC') ? '$' : ''}{item.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className={`mt-2 font-bold text-sm sm:text-base ${colorClass}`}>
          {isUp ? '+' : ''}{item.change_amt.toFixed(2)} ({isUp ? '+' : ''}{item.change_pct.toFixed(2)}%)
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
            KORU LIVE
          </h2>
          <p className="text-slate-400 font-medium">전 세계 주요 지수와 메가테크 종목의 실시간/야간 시황을 한눈에 확인하세요.</p>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
          마지막 업데이트: {lastUpdated.toLocaleTimeString()} (10초 자동 갱신)
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold">글로벌 시황 데이터를 수집 중입니다...</p>
        </div>
      ) : data ? (
        <div className="space-y-10">
          <section>
            <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span> 글로벌 지수 선물
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.indices.map(renderCard)}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> 빅테크 핫스탁 (프리마켓/실시간)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.tech.map(renderCard)}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">💎</span> 암호화폐
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.crypto.map(renderCard)}
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center py-20 text-red-400">데이터를 불러오는 데 실패했습니다.</div>
      )}
    </div>
  );
};
