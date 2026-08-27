import React, { useState, useEffect } from 'react';

export const NoticePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hideForADay, setHideForADay] = useState(false);

  useEffect(() => {
    // Check if the popup should be shown
    const hiddenUntil = localStorage.getItem('korekore_notice_hidden_until');
    if (!hiddenUntil || Date.now() > parseInt(hiddenUntil, 10)) {
      // Delay slightly for a smoother entrance
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (hideForADay) {
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('korekore_notice_hidden_until', tomorrow.toString());
    }
    setIsOpen(false);
  };

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Header / Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBMMCAwaC00MHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
          <span className="text-4xl mb-2 block relative z-10">🚀</span>
          <h2 className="text-2xl font-black text-white relative z-10 drop-shadow-lg">
            KOREKORE 업데이트 소식
          </h2>
          <p className="text-indigo-100 mt-1 text-sm font-medium relative z-10">
            새로운 기능들을 지금 바로 만나보세요!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <button 
            onClick={() => navigateTo('reverse-trade')}
            className="w-full group text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-yellow-500/50 p-4 rounded-2xl transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                인구신 AI 스캐너 <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse tracking-wider">NEW</span>
              </h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                "인구는 신이다..." 인구신과 반대로 가서 지옥에서 살아남으세요! AI가 타점을 잡아드립니다.
              </p>
            </div>
          </button>

          <button 
            onClick={() => navigateTo('feedback')}
            className="w-full group text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 p-4 rounded-2xl transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📮</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                유저 건의함 (개발해주세요!)
              </h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                운영자에게 바라는 기능이나 아이디어가 있다면 익명으로 마음껏 날려주세요.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={hideForADay}
                onChange={(e) => setHideForADay(e.target.checked)}
                className="peer w-5 h-5 appearance-none border border-slate-600 rounded bg-slate-900 checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer transition-all"
              />
              <svg className="absolute w-3 h-3 pointer-events-none left-1 top-1 text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">하루 동안 보지 않기</span>
          </label>
          
          <button 
            onClick={handleClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg active:scale-95"
          >
            닫기
          </button>
        </div>
        
      </div>
    </div>
  );
};
