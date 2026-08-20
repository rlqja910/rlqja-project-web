import React, { useState, useEffect } from 'react';


export const StockReportView: React.FC<{
  posts: any[];
  isLoading: boolean;
  isFetching: boolean;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPost: React.Dispatch<React.SetStateAction<any>>;
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ posts, isLoading, isFetching, visibleCount, setVisibleCount, setSelectedPost, setIsAuthModalOpen }) => {
  return (
    <>
      <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800/60 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight break-keep">
            KOREKORE가 분석하는 <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">실시간 증시 리포트</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed break-keep">
            KOREKORE가 하루 3번, 7시 12시 20시에 핵심 뉴스만 선별하여 증시 동향, 수급, 그리고 주목할 섹터를 한눈에 보기 쉽게 요약해 드립니다.
          </p>
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              disabled={isFetching}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isFetching ? '심층 분석 수집 중...' : '새 리포트 생성하기'}
            </button>
          </div>
        </div>
      </section>



      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white">최신 리포트 피드</h3>
          <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                  onClick={() => setSelectedPost(post)}
                  className="group p-5 sm:p-6 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98] sm:active:scale-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors break-keep">{post.title}</h4>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {post.shortContent}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 sm:gap-0 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-center w-full sm:w-auto">
                      <span className="text-xs font-medium text-slate-500">{new Date(post.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
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
