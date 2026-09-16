import { useState, useEffect } from 'react';
import { PixelIcon } from '../components/PixelIcon';

interface RetailOverheat {
  id: number;
  symbol: string;
  name: string;
  searchRank: number;
  priceChange: number;
  volume: number;
  overheatScore: number;
  comment: string;
  updatedAt: string;
}

export default function RetailRadarView() {
  const [data, setData] = useState<RetailOverheat[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/radar/retail-overheat');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setCountdown(60);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="bg-[#1a103c] border-2 border-red-500/50 rounded-xl p-6 relative overflow-hidden brutal-shadow">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20">
          <div 
            className="h-full bg-red-500 transition-all duration-1000" 
            style={{ width: `${(countdown / 60) * 100}%` }}
          />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-red-500 tracking-tight flex items-center gap-3">
              <PixelIcon name="skull" className="w-8 h-8" /> 개미 무덤 탐지기
            </h1>
            <p className="text-red-400/80 mt-1 font-pixel text-sm">
              실시간 인기 검색어 기반 대중 과열도 추적 레이더
            </p>
          </div>
          <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30">
            <PixelIcon name="sync" className={`w-4 h-4 text-red-400 ${countdown === 0 ? 'animate-spin' : ''}`} />
            <span className="text-red-400 font-mono text-sm font-bold">{countdown}초 후 갱신</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <PixelIcon name="loader" className="w-10 h-10 text-red-500 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((item) => (
              <div key={item.id} className="bg-[#12082b] border border-red-500/20 rounded-lg p-5 hover:border-red-500/50 transition-colors relative overflow-hidden group">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 bg-red-950 rounded-lg flex items-center justify-center border border-red-500/30 font-black text-red-500 text-xl">
                      {item.searchRank}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {item.name}
                        <span className="text-xs text-slate-500 font-mono">{item.symbol}</span>
                      </h3>
                      <div className={`text-sm font-bold ${item.priceChange >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {item.priceChange > 0 ? '+' : ''}{item.priceChange}% 
                        <span className="text-slate-500 ml-2 text-xs">Vol: {(item.volume / 10000).toFixed(0)}만</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow w-full">
                    <div className="bg-red-950/30 rounded-md p-3 border border-red-900/50">
                      <p className="text-red-200/80 text-sm italic">
                        "{item.comment}"
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">과열도 (Overheat)</span>
                      <span className="text-red-400 font-bold">{item.overheatScore}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full relative"
                        style={{ width: `${item.overheatScore}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="text-center py-10 text-slate-500">데이터를 수집 중입니다...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
