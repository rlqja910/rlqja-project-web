import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PixelIcon } from '../components/PixelIcon';

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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="mb-8 relative flex items-center gap-3">
        <div className="w-12 h-12 bg-[#2d1b54] brutal-border-accent flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <PixelIcon name="book" className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl pokemon-title drop-shadow-[2px_2px_0_#7c3aed]">
            증시 꿀팁 / 인사이트
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-2 font-pixel tracking-wider bg-[#1a103c] py-1 px-3 inline-block brutal-border">
            존나 지리는 정보, 세력들의 꿀통을 털어보자.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 font-pixel text-sm whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-cyan-400 text-black brutal-border-accent shadow-[0_0_10px_rgba(6,182,212,0.8)] translate-y-1' 
                : 'bg-[#2d1b54] text-gray-300 hover:text-white brutal-border hover:bg-[#1a103c]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><PixelIcon name="loader" className="w-10 h-10 text-cyan-400 animate-spin" /></div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 font-pixel text-gray-400">아직 게시글이 없습니다. 봇이 작성 중입니다!</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
        {filteredPosts.map(post => (
          <div 
            key={post.id}
            className="group relative bg-[#1a103c] brutal-border brutal-shadow hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] p-5 transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"></div>
            
            <div className="flex justify-between items-start mb-4 mt-2 relative z-10">
              <span className="px-3 py-1 bg-[#2d1b54] brutal-border text-xs font-pixel text-cyan-400">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 font-pixel">
                {new Date(post.date || post.createdAt).toLocaleString()}
              </span>
            </div>
            
            <h2 className="text-lg font-pixel text-white mb-4 group-hover:text-cyan-300 transition-colors drop-shadow-[1px_1px_0_#000]">
              {post.title.replace(/|||\[장전\]/g, '')}
            </h2>
            
            <div className="text-sm text-gray-300 font-pixel leading-relaxed mb-6 flex-grow relative z-10 
              [&_img]:brutal-border [&_img]:my-3 [&_img]:w-full [&_img]:max-h-48 [&_img]:object-cover 
              [&_p]:mb-2 [&_h1]:text-base [&_h1]:text-yellow-400 [&_h1]:mb-2 [&_strong]:text-cyan-400">
              <ReactMarkdown>{post.content.replace(/||/g, '')}</ReactMarkdown>
            </div>
            
            <div className="flex items-center justify-between border-t-[3px] border-[#2d1b54] pt-4 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#0f0c29] brutal-border flex items-center justify-center text-[10px] text-cyan-400 font-pixel">
                  {post.author.charAt(0)}
                </div>
                <span className="text-xs text-gray-400 font-pixel">{post.author}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors px-2 py-1 bg-[#2d1b54] brutal-border"
              >
                <PixelIcon name="heart" className="w-4 h-4" />
                <span className="text-xs font-pixel">{post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] brutal-border brutal-shadow font-pixel text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(124,58,237,0.8)]">
          더 많은 정보 보기
        </button>
      </div>

    </div>
  );
};
