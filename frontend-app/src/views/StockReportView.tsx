import React from 'react';
import { useMagaMode } from '../hooks/useMagaMode';

export const StockReportView: React.FC<{
  posts: any[];
  isLoading: boolean;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  onPostClick: (post: any) => void;
}> = ({ posts, isLoading, visibleCount, setVisibleCount, onPostClick }) => {
  const { isMagaMode } = useMagaMode();

  const renderMagaContent = (content: string) => {
    if (!isMagaMode) return content;
    let redContent = content.replace(/(하락|약세|부진|급락|조정|폭락|둔화|위기)/g, '🚀초급등');
    redContent = redContent.replace(/(상승|강세|급등|폭등|호조)/g, '🔥🔥미친 폭등');
    redContent = redContent.replace(/-\d+\.?\d*%/g, '+399.9% (떡상!)');
    redContent = redContent.replace(/\+?\d+\.?\d*%/g, '+299.9%');
    redContent = redContent.replace(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g, (match) => {
      const num = parseFloat(match.replace(/,/g, ''));
      if (isNaN(num)) return match;
      return (num * 1.385).toLocaleString(undefined, { maximumFractionDigits: 2 });
    });
    return (
      <span className="text-red-400 font-bold block bg-red-950/40 p-3 rounded-lg border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse">
        {redContent}
      </span>
    );
  };

  return (
    <>
      <section className={`relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border ${isMagaMode ? 'border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.6)]' : 'border-slate-700/50 shadow-xl'} transition-all duration-500`}>
        {isMagaMode && (
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-red-900/40 mix-blend-color-dodge animate-pulse pointer-events-none z-0"></div>
        )}
        <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 ${isMagaMode ? 'bg-red-600/40' : 'bg-cyan-500/10'} rounded-full blur-3xl pointer-events-none transition-colors duration-1000 z-0`}></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight drop-shadow-sm leading-tight break-keep">
            KOREKORE가 분석하는 <br className="hidden sm:block" />
            실시간 증시 리포트
          </h2>
          <p className="text-[13px] sm:text-sm text-slate-400 font-medium leading-relaxed break-keep">
            KOREKORE가 하루 3번, 7시 12시 20시에 핵심 뉴스만 선별하여 증시 동향, 수급, 그리고 주목할 섹터를 한눈에 보기 쉽게 요약해 드립니다.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white">최신 리포트 피드</h3>
          <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${isMagaMode ? 'bg-red-500 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></span>
            실시간 동기화
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {isLoading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">데이터를 불러오는 중입니다...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800/50">아직 등록된 리포트가 없습니다. 상단의 버튼을 눌러보세요!</div>
          ) : (
            <>
              {posts.slice(0, visibleCount).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className={`group p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border transition-all cursor-pointer shadow-lg animate-in fade-in slide-in-from-bottom-4 ${isMagaMode ? 'border-red-900/50 hover:border-red-500 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(220,38,38,0.2)]' : 'border-slate-700/50 hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)]'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-base sm:text-lg font-bold break-keep transition-colors flex items-center gap-2 ${isMagaMode ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse' : 'text-slate-100 group-hover:text-cyan-300'}`}>
                        {isMagaMode ? `🚀 [초강력 떡상] ${post.title}` : post.title}
                        {(post.viewCount || 0) >= 500 && (
                          <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-black bg-red-500/20 text-red-500 border border-red-500/30 whitespace-nowrap">🔥 HOT</span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-4 relative z-10 line-clamp-2">
                    {renderMagaContent(post.shortContent)}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 sm:gap-0 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-center w-full sm:w-auto">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500">{new Date(post.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          👁️ {post.viewCount || 0}
                        </span>
                      </div>
                      <span className="text-xs text-indigo-400 font-medium sm:hidden sm:group-hover:block ml-4">상세 리포트 보기 &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length > visibleCount && (
                <div className="relative mt-2 pt-16 pb-4 flex justify-center before:absolute before:inset-0 before:top-[-80px] before:bg-gradient-to-t before:from-[#0B0F19] before:via-[#0B0F19]/80 before:to-transparent before:pointer-events-none">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="relative z-10 px-8 py-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 font-semibold shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-xl transition-all flex items-center gap-3 active:scale-95 group"
                  >
                    과거 리포트 더 보기
                    <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};
