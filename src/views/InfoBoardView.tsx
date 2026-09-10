import React, { useState } from 'react';

interface InfoPost {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  likes: number;
  date: string;
}

const mockPosts: InfoPost[] = [
  {
    id: 1,
    title: "금리 인하 사이클, 어디에 투자해야 할까? (과거 데이터 분석)",
    category: "매크로",
    content: "과거 3번의 금리 인하 사이클을 분석해보면 초기에는 국채와 방어주가, 후반부에는 중소형주가 아웃퍼폼했습니다. 현재 상황에서는...",
    author: "KOREKORE",
    likes: 342,
    date: "2026-09-10"
  },
  {
    id: 2,
    title: "세력이 매집할 때 나타나는 호가창 특징 3가지",
    category: "트레이딩",
    content: "호가창에서 특정 패턴이 반복될 때 세력 매집일 확률이 높습니다. 1. 허매수 받치기, 2. 자전거래 패턴, 3. 특정 시간대 체결강도 조작...",
    author: "워뇨띠할애비",
    likes: 890,
    date: "2026-09-09"
  },
  {
    id: 3,
    title: "지금 당장 주목해야 할 자사주 소각 기업 리스트",
    category: "가치투자",
    content: "PBR 1 미만이면서 최근 공격적으로 자사주를 소각하고 있는 꿀통 기업 5개를 정리했습니다. 이 중 3곳은 다음 주 실적 발표가...",
    author: "가치투자자",
    likes: 512,
    date: "2026-09-08"
  }
];

export const InfoBoardView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const categories = ['전체', '매크로', '트레이딩', '가치투자', '코인'];

  const filteredPosts = activeCategory === '전체' 
    ? mockPosts 
    : mockPosts.filter(p => p.category === activeCategory);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10 rounded-full"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <span className="text-3xl">💎</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
              증시 꿀팁 / 인사이트
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
              존나 지리는 정보, 세력들의 꿀통을 털어보자.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] cursor-pointer flex flex-col h-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-lg text-xs font-bold text-blue-400">
                {post.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">{post.date}</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 relative z-10">
              {post.title}
            </h2>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 flex-grow relative z-10">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 relative z-10 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-600 to-slate-500 flex items-center justify-center text-[10px] text-white font-bold">
                  {post.author.charAt(0)}
                </div>
                <span className="text-xs text-slate-300 font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-pink-400 transition-colors">
                <span className="text-sm">❤️</span>
                <span className="text-xs font-bold">{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          더 많은 정보 보기
        </button>
      </div>

    </div>
  );
};
