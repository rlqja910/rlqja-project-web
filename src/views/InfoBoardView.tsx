import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface InfoPost {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  likes: number;
  date?: string;
  createdAt: string;
}

export const InfoBoardView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const categories = ['전체', '매크로', '트레이딩', '가치투자', '코인', '마인드셋'];
  const [posts, setPosts] = useState<InfoPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/info-board')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleLike = async (id: number) => {
    try {
      const res = await fetch(`/api/info-board/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts(posts.map(p => p.id === id ? { ...p, likes: data.likes } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredPosts = activeCategory === '전체' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans text-slate-200">
      
      {/* Header Section */}
      <div className="mb-10 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-700/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              SmartMoney <span className="text-blue-400 font-light">Insight</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-400 tracking-wide font-light">
            기관 투자자의 시선으로 읽는 실시간 거시 경제 및 시장 트렌드 분석
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">
          Market Intelligence
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar mb-6 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ${
              activeCategory === cat 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center py-32">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-32 text-slate-500 font-light tracking-wide">
          <p className="text-lg">분석된 인사이트가 없습니다.</p>
          <p className="text-sm mt-2">AI 애널리스트가 시장 데이터를 수집 중입니다.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all duration-500 flex flex-col h-full overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex justify-between items-center mb-5 relative z-10">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400">
                {post.category}
              </span>
              <span className="text-xs text-slate-500 font-mono tracking-wider">
                {new Date(post.date || post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-slate-100 mb-4 group-hover:text-blue-300 transition-colors leading-snug">
              {post.title.replace(/\|\|\||\[장전\]/g, '')}
            </h2>
            
            <div className="text-sm text-slate-300 font-light leading-relaxed mb-6 flex-grow relative z-10 
              [&_img]:rounded-xl [&_img]:my-4 [&_img]:w-full [&_img]:max-h-52 [&_img]:object-cover [&_img]:shadow-md [&_img]:border [&_img]:border-slate-800
              [&_p]:mb-3 [&_h1]:text-lg [&_h1]:text-white [&_h1]:font-semibold [&_h1]:mb-3 [&_strong]:text-blue-300 [&_strong]:font-medium">
              <ReactMarkdown>{post.content.replace(/\|\|/g, '')}</ReactMarkdown>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-5 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-xs text-blue-300 font-medium">
                  {post.author.charAt(0)}
                </div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">{post.author}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors px-3 py-1.5 bg-slate-800/30 hover:bg-slate-800 rounded-full border border-transparent hover:border-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs font-medium">{post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="mt-14 text-center">
        <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-medium text-slate-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          이전 분석 보기
        </button>
      </div>

    </div>
  );
};
