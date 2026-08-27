import React, { useState, useEffect } from 'react';

type IngooRecord = {
  id: number;
  videoId: string;
  videoTitle: string;
  aiAnalysis: string;
  actionType: 'SHORT' | 'LONG' | 'UNKNOWN';
  createdAt: string;
};

export const ReverseTradeView: React.FC = () => {
  const [records, setRecords] = useState<IngooRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [survivorCount, setSurvivorCount] = useState(0);

  useEffect(() => {
    fetchRecords();
    
    // Fake survivor counter
    const daysSince = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const count = 12450 + (daysSince * 37) + (new Date().getHours() * 3);
    setSurvivorCount(count);
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/ingoo-records');
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-1.5 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.3)]">
        <div className="bg-slate-900 rounded-[1.35rem] p-6 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBMMCAwaC00MHoiIGZpbGw9IiNlYWIzMDgiLz48L3N2Zz4=')] opacity-80"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBMMCAwaC00MHoiIGZpbGw9IiNlYWIzMDgiLz48L3N2Zz4=')] opacity-80"></div>

          <div className="text-center space-y-4 mb-2 mt-2 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-2">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white break-keep">
              <span className="text-yellow-400">인구신 AI</span> 자동 스캐너
            </h2>
            <p className="text-slate-400 text-sm sm:text-base break-keep">
              AI가 인구신(전인구) 유튜브 채널을 <span className="text-yellow-400 font-bold">1시간 간격으로</span> 감시합니다.<br/>
              새 영상이 올라오면 즉시 반대 포지션을 잡아드립니다.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 bg-black/40 px-5 py-3 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
              <span className="text-2xl">🔥</span>
              <div className="text-left">
                <div className="text-xs text-yellow-500 font-bold">인구신과 반대로 가서 지옥에서 살아남은 자들</div>
                <div className="text-white font-black text-xl tabular-nums">
                  총 <span className="text-yellow-400 text-2xl">{survivorCount.toLocaleString()}</span> 명
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-white">최근 반대매매 타점</h3>
          <button onClick={fetchRecords} className="text-sm text-slate-400 hover:text-white transition-colors">
            새로고침 🔄
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">인구신 픽을 불러오는 중...</div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500">
            아직 분석된 인구신 영상이 없습니다.<br/>
            (AI가 다음 영상을 기다리는 중입니다)
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className={`p-1 rounded-3xl animate-in slide-in-from-bottom-4 ${
                record.actionType === 'SHORT' 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-900 shadow-[0_0_20px_rgba(37,99,235,0.1)]' 
                : record.actionType === 'LONG'
                ? 'bg-gradient-to-br from-red-600 to-orange-900 shadow-[0_0_20px_rgba(220,38,38,0.1)]'
                : 'bg-gradient-to-br from-slate-600 to-slate-800'
              }`}>
                <div className="bg-slate-900/95 backdrop-blur-xl rounded-[1.4rem] p-5 sm:p-6">
                  
                  <div className="flex items-center justify-between mb-4">
                    <a href={`https://www.youtube.com/watch?v=${record.videoId}`} target="_blank" rel="noreferrer" className="text-base sm:text-lg font-bold text-white hover:text-yellow-400 transition-colors line-clamp-2">
                      🎬 {record.videoTitle}
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    <div className="shrink-0 flex flex-col gap-3">
                      <a href={`https://www.youtube.com/watch?v=${record.videoId}`} target="_blank" rel="noreferrer" className="block relative group rounded-xl overflow-hidden border border-slate-700/50 w-full sm:w-48 aspect-video">
                        <img src={`https://img.youtube.com/vi/${record.videoId}/mqdefault.jpg`} alt="YouTube Thumbnail" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">▶ 증거 영상 보기</span>
                        </div>
                      </a>
                      <div className={`w-full h-12 rounded-xl flex items-center justify-center border-2 ${
                        record.actionType === 'SHORT' ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : record.actionType === 'LONG' ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-slate-500 bg-slate-500/10 text-slate-400'
                      }`}>
                        <span className="font-black tracking-wider text-sm sm:text-base">
                          {record.actionType === 'SHORT' ? '📉 공매도 추천' : record.actionType === 'LONG' ? '🚀 풀매수 추천' : '🤷‍♂️ 관망'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-[15px] break-keep bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800/50">
                        {record.aiAnalysis}
                      </p>
                      <div className="flex justify-end">
                        <span className="text-xs font-medium text-slate-500">
                          분석 일시: {new Date(record.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
