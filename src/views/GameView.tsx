import { useState, useEffect } from 'react';

interface GameUpdate {
  gameName: string;
  title: string;
  date: string;
  link: string;
  contentSummary: string;
  isHot: boolean;
}

export default function GameView() {
  const [activeGame, setActiveGame] = useState<'mapleland' | 'baram_classic' | 'darkness'>('baram_classic');
  const [updates, setUpdates] = useState<GameUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/games/updates');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUpdates(data);
          } else {
            console.error("API did not return an array", data);
            setUpdates([]);
          }
        } else {
          console.error("API returned error", res.status);
          setUpdates([]);
        }
      } catch (e) {
        console.error("Failed to fetch game updates", e);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(u => u.gameName === activeGame);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight">
          클래식 게임 핫이슈 🎮
        </h1>
        <p className="text-slate-400 text-lg">바람의나라 클래식 & 메이플랜드 최신 패치노트 타임라인</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveGame('baram_classic')}
          className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeGame === 'baram_classic' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          🌪️ 바람의나라 클래식
        </button>
        <button
          onClick={() => setActiveGame('mapleland')}
          className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeGame === 'mapleland' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          🍁 메이플랜드
        </button>
        <button
          onClick={() => setActiveGame('darkness')}
          className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeGame === 'darkness' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          🦇 어둠의전설
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin text-4xl">🎲</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              최신 공지사항이 없습니다.
            </div>
          ) : (
            filteredUpdates.map((update, idx) => (
              <a 
                key={idx}
                href={update.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    {update.isHot && (
                      <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                        HOT 🔥
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {update.title}
                    </h3>
                  </div>
                  <span className="text-sm text-slate-500 font-mono">{update.date}</span>
                </div>
                <p className="text-slate-400">
                  {update.contentSummary}
                </p>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
