import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

interface WhaleStock {
  ticker: string;
  name: string;
  price: number;
  bbw: number;
  volume_ratio: number;
  reason: string;
}

export const WhaleDetectorView: React.FC = () => {
  const [stocks, setStocks] = useState<WhaleStock[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWhaleStocks = async () => {
      try {
        const response = await fetch('/api/smart-money?t=' + new Date().getTime());
        const data = await response.json();
        
        if (data.success) {
          setStocks(data.stocks);
          // Convert timestamp to readable time
          const date = new Date(data.updated_at * 1000);
          setUpdatedAt(date.toLocaleString('ko-KR'));
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Network error. Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchWhaleStocks();
  }, []);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col gap-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-pixel pokemon-title text-slate-100 flex items-center gap-2 drop-shadow-[2px_2px_0_#7c3aed]">
            <LucideIcons.Fish className="w-8 h-8 text-cyan-400 pixel-icon" />
            세력 포착기 <span className="text-sm font-pixel text-emerald-400 bg-emerald-400/10 px-2 py-1 brutal-border shadow-[0_0_10px_rgba(52,211,153,0.5)]">BETA</span>
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            폭발 전야의 에너지가 응축된 종목을 AI가 매일 장 마감 후 발굴합니다.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-medium">세력의 흔적을 추적하는 중...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <p className="font-bold mb-1">데이터를 불러오지 못했습니다.</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>포착된 유망 종목: <strong className="text-slate-300">{stocks.length}개</strong></span>
            <span>최근 스캔: {updatedAt}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stocks.map((stock, idx) => (
              <div 
                key={stock.ticker} 
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
              >
                {idx === 0 && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg flex items-center gap-1">
                      <LucideIcons.Flame className="w-3.5 h-3.5" /> 폭발 1순위
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-pixel text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2 drop-shadow-[1px_1px_0_#000]">
                      {stock.name}
                      <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded">
                        {stock.ticker}
                      </span>
                    </h3>
                    <p className="text-2xl font-black text-indigo-400 mt-1">
                      {stock.price.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">포착 사유</span>
                    <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                      {stock.reason}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">에너지 응축도 (BBW)</span>
                    <span className="font-bold text-slate-300">
                      {stock.bbw} <span className="text-slate-500 font-normal">(낮을수록 좋음)</span>
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">최근 거래량 폭발</span>
                    <span className={`font-bold ${stock.volume_ratio > 1.2 ? 'text-rose-400' : 'text-slate-300'}`}>
                      평소 대비 {stock.volume_ratio}배
                    </span>
                  </div>
                </div>

                {/* Progress bar representing squeeze tightness (inverse of BBW, 0.15 is max) */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">폭발 임박 게이지</span>
                    <span className="text-indigo-400 font-bold">{Math.max(0, Math.min(100, Math.round((0.15 - stock.bbw) / 0.15 * 100)))}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-rose-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.max(0, Math.min(100, Math.round((0.15 - stock.bbw) / 0.15 * 100)))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
