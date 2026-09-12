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
      <section className={`relative p-6 sm:p-10 overflow-hidden bg-[#1a103c] ${isMagaMode ? 'brutal-border border-[6px] border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.6)]' : 'brutal-border-accent shadow-[0_0_20px_rgba(6,182,212,0.4)]'} transition-all duration-500`}>
        {isMagaMode && (
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-red-900/40 mix-blend-color-dodge animate-pulse pointer-events-none z-0"></div>
        )}
        <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 ${isMagaMode ? 'bg-red-600/40' : 'bg-cyan-500/10'} rounded-full blur-3xl pointer-events-none transition-colors duration-1000 z-0`}></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-pixel text-white leading-tight break-keep pokemon-title">
            KOREKORE가 분석하는 <br className="hidden sm:block" />
            실시간 증시 리포트
          </h2>
          <p className="text-[13px] sm:text-sm text-gray-300 font-pixel leading-relaxed break-keep bg-[#0f0c29] p-3 inline-block brutal-border">
            KOREKORE가 하루 3번, 7시 12시 20시에 핵심 뉴스만 선별하여 증시 동향, 수급, 그리고 주목할 섹터를 한눈에 보기 쉽게 요약해 드립니다.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl sm:text-2xl font-pixel pokemon-title">최신 리포트 피드</h3>
          <div className="text-xs sm:text-sm text-cyan-400 font-pixel flex items-center gap-2 bg-[#1a103c] px-3 py-1.5 brutal-border">
            <span className={`w-2 h-2 rounded-full ${isMagaMode ? 'bg-red-500 animate-bounce' : 'bg-cyan-400 animate-pulse'}`}></span>
            실시간 동기화
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {isLoading ? (
            <div className="text-center py-20 text-cyan-400 animate-pulse font-pixel">데이터를 불러오는 중입니다...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-pixel bg-[#1a103c] brutal-border">아직 등록된 리포트가 없습니다. 상단의 버튼을 눌러보세요!</div>
          ) : (
            <>
              {posts.slice(0, visibleCount).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className={`group p-5 sm:p-6 bg-[#1a103c] brutal-border brutal-shadow hover:-translate-y-1 transition-all cursor-pointer ${isMagaMode ? 'border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'hover:shadow-[0_0_20px_rgba(124,58,237,0.6)]'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className={`text-base sm:text-lg font-pixel break-keep transition-colors flex items-center gap-2 ${isMagaMode ? 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse' : 'text-white group-hover:text-cyan-300 drop-shadow-[1px_1px_0_#000]'}`}>
                        {isMagaMode ? `🚀 [초강력 떡상] ${post.title.replace(/🔥|\[HOT\]/g, '')}` : post.title.replace(/🔥|\[HOT\]/g, '')}
                        {(post.viewCount || 0) >= 500 && (
                          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-pixel bg-red-500/20 text-red-500 brutal-border whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.3)]">HOT!</span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 font-pixel leading-relaxed mb-4 relative z-10 line-clamp-2">
                    {renderMagaContent(post.shortContent)}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 sm:gap-0 mt-4 pt-4 border-t-[3px] border-[#2d1b54]">
                    <div className="flex justify-between items-center w-full sm:w-auto">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-pixel text-gray-400 bg-[#0f0c29] px-2 py-1 brutal-border">{new Date(post.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs font-pixel text-cyan-400 flex items-center gap-1 bg-[#0f0c29] px-2 py-1 brutal-border">
                          VIEWS {post.viewCount || 0}
                        </span>
                      </div>
                      <span className="text-xs text-purple-400 font-pixel sm:hidden sm:group-hover:block ml-4">상세 보기 {'>'}</span>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length > visibleCount && (
                <div className="relative mt-2 pt-8 pb-4 flex justify-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    className="relative z-10 px-8 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] brutal-border brutal-shadow font-pixel text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(124,58,237,0.8)]"
                  >
                    과거 리포트 더 보기
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
