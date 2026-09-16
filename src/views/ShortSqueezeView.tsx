import { useState, useEffect } from 'react';
import { PixelIcon } from '../components/PixelIcon';

interface ShortSqueeze {
  id: number;
  symbol: string;
  name: string;
  shortRatio: number;
  squeezeScore: number;
  priceChange: number;
  volumeSurgeRatio: number;
  updatedAt: string;
}

export default function ShortSqueezeView() {
  const [data, setData] = useState<ShortSqueeze[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/radar/short-squeeze');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setCountdown(10);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s
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
      <div className="bg-[#1a103c] border-2 border-orange-500/50 rounded-xl p-6 relative overflow-hidden brutal-shadow">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center gap-3">
              <PixelIcon name="fire" className="w-8 h-8 text-orange-500" /> 숏 스퀴즈 레이더
            </h1>
            <p className="text-orange-200/60 mt-2 font-pixel text-sm">
              공매도 잔고 상위 종목 거래량 급등 실시간 감시 (10초 주기)
            </p>
          </div>
          <div className="flex items-center gap-3 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <PixelIcon name="reload" className={`w-4 h-4 text-orange-400 ${countdown === 0 ? 'animate-spin' : ''}`} />
            <span className="text-orange-400 font-mono text-sm font-bold">{countdown}s</span>
          </div>
        </div>

        <div className="bg-orange-950/20 border border-orange-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
            <PixelIcon name="info-box" className="w-4 h-4" /> 지표 설명
          </h4>
          <ul className="text-sm text-orange-200/70 space-y-1 ml-6 list-disc marker:text-orange-500">
            <li><strong className="text-orange-300">기관 피눈물 게이지 (Squeeze Score):</strong> 공매도 잔고가 높은 상태에서 비정상적인 거래량 급등과 상승 흐름이 겹칠 때 상승합니다. 게이지가 80 이상이면 기관의 강제 숏커버링(환매수)이 폭발하기 직전일 수 있습니다.</li>
            <li><strong className="text-orange-300">거래량 급등률 (Volume Surge):</strong> 최근 평균 거래량 대비 현재 거래량이 얼마나 폭증했는지를 나타냅니다. 숏 스퀴즈의 가장 중요한 선행 지표입니다.</li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <PixelIcon name="loader" className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item) => {
              const isHighSqueeze = item.squeezeScore > 80;
              return (
                <div 
                  key={item.id} 
                  className={`border rounded-xl p-5 relative overflow-hidden transition-all duration-300 ${
                    isHighSqueeze 
                      ? 'bg-[#2a1309] border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] scale-[1.02]' 
                      : 'bg-[#12082b] border-orange-500/20 hover:border-orange-500/40'
                  }`}
                >
                  {isHighSqueeze && (
                    <div className="absolute top-0 right-0 p-2">
                      <span className="animate-pulse flex items-center gap-1 text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                        <PixelIcon name="warning-diamond" className="w-3 h-3" /> SQUEEZE
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {item.name}
                        <span className="text-xs text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{item.symbol}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-sm font-bold ${item.priceChange >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                          {item.priceChange > 0 ? '+' : ''}{item.priceChange}%
                        </span>
                        <span className="text-xs text-orange-200/60 bg-orange-900/40 px-2 py-0.5 rounded-full border border-orange-500/20">
                          잔고 {item.shortRatio}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">거래량 급등률 (Volume Surge)</span>
                        <span className="text-orange-400 font-mono font-bold">{item.volumeSurgeRatio}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${Math.min(item.volumeSurgeRatio / 5, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">기관 피눈물 게이지 (Squeeze Score)</span>
                        <span className={`font-black ${isHighSqueeze ? 'text-red-500' : 'text-yellow-500'}`}>
                          {item.squeezeScore}/100
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                        <div 
                          className={`h-full rounded-full relative ${
                            isHighSqueeze 
                              ? 'bg-gradient-to-r from-red-600 to-yellow-400 animate-pulse' 
                              : 'bg-gradient-to-r from-yellow-700 to-orange-500'
                          }`}
                          style={{ width: `${item.squeezeScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
            {data.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">데이터를 수집 중입니다...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
