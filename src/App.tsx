import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PORTAL_MENUS } from './config/menu';
import { HomeView } from './views/HomeView';
import { StockReportView } from './views/StockReportView';
import { PatchNotesView } from './views/PatchNotesView';
import { ScouterView } from './views/ScouterView';
import { AdminView } from './views/AdminView';
import { AverageCalculatorView } from './views/AverageCalculatorView';
import { KoreLiveView } from './views/KoreLiveView';
import { FortuneCookieView } from './views/FortuneCookieView';
import { ReverseTradeView } from './views/ReverseTradeView';
import { CompoundCalcView } from './views/CompoundCalcView';
import { BuybackTrackerView } from './views/BuybackTrackerView';
import { FeedbackView } from './views/FeedbackView';
import GameView from './views/GameView';
import FomoView from './views/FomoView';
import { PushSubscriptionModal } from './components/PushSubscriptionModal';
import { NoticePopup } from './components/NoticePopup';
import { LoyalUserModal } from './components/LoyalUserModal';
import { useMagaMode } from './hooks/useMagaMode';

interface Post {
  id: number;
  title: string;
  shortContent: string;
  detailedContent: string;
  hashtags: string;
  createdAt: string;
  viewCount?: number;
}

interface PatchNote {
  id: number;
  version: string;
  content: string;
  createdAt: string;
}

const getMaintenanceText = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) return "개발자가 주말이라 기력 방전으로 뻗어 있어서, 서버 복구 쿨타임이 제법 길게 돌 수 있습니다 💀";
  if (hour >= 9 && hour < 18) return "개발자가 현생(회사)에서 상사 눈치 보며 몰래 고쳐야 하므로, 복구가 스릴 넘치게 지연될 수 있습니다 🥷";
  if (hour >= 18 && hour <= 23) return "개발자가 퇴근 후 너덜너덜해진 멘탈로 키보드 샷건 치며 땜빵 중이라 시간이 좀 걸릴 수 있습니다 🤬";
  return "개발자가 새벽에 비상 알람 맞고 좀비처럼 일어난 상태라, 눈 감고 코딩하느라 복구가 더딜 수 있습니다 🧟‍♂️";
};

const getPostMaintenanceText = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) return "주말에 쉬지도 못하고 기절했던 서버 멱살 잡고 살려왔어요 🚀";
  if (hour >= 9 && hour < 18) return "회사에서 월급루팡하며 기절했던 서버 멱살 잡고 살려왔어요 🚀";
  if (hour >= 18 && hour <= 23) return "퇴근 후 피곤한 몸 이끌고 기절했던 서버 멱살 잡고 살려왔어요 🚀";
  return "새벽에 자다 깨서 눈 비비며 기절했던 서버 멱살 잡고 살려왔어요 🚀";
};

function App() {
  const { isMagaMode, toggleMagaMode } = useMagaMode();
  
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['finance', 'utilities', 'trends']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getInitialTab());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [patchNotes, setPatchNotes] = useState<PatchNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [visitorStats, setVisitorStats] = useState({ totalVisitors: 0, todayVisitors: 0 });
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  // 점검 후 공지 배너 (평소엔 false, 점검 직후에만 true로 활성화)
  const [showNotice, setShowNotice] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(sessionStorage.getItem('admin_unlocked') === 'true');
  const [showLoyalModal, setShowLoyalModal] = useState(false);

  const handleLogoClick = () => {
    handleTabChange('home');
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    
    if (newClicks >= 7) {
      setLogoClicks(0);
      
      if (isAdminUnlocked) {
        handleTabChange('admin');
        return;
      }

      setTimeout(() => {
        const pin = prompt("System Override Code:");
        if (pin === "2026") {
          sessionStorage.setItem('admin_unlocked', 'true');
          setIsAdminUnlocked(true);
          handleTabChange('admin');
        } else if (pin !== null) {
          alert('접근이 거부되었습니다.');
        }
      }, 10);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/logs/stats?t=' + new Date().getTime(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setVisitorStats(data);
        // 서버 복구 감지 로직: 이전에 터진 걸 목격한 유저라면 띠배너 노출
        if (localStorage.getItem('korekore_experienced_downtime') === 'true') {
          setShowNotice(true);
        }
      } else {
        setIsMaintenanceMode(true);
        localStorage.setItem('korekore_experienced_downtime', 'true');
      }
    } catch (e) {
      setIsMaintenanceMode(true);
      localStorage.setItem('korekore_experienced_downtime', 'true');
      console.error('Failed to fetch stats:', e);
    }
  };

  useEffect(() => {
    let visitorId = localStorage.getItem('korekore_visitor_id');
    if (!visitorId) {
      visitorId = 'anon-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('korekore_visitor_id', visitorId);
    }
    fetch('/api/logs/visit', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: `/#${activeTab}`, visitorId })
    }).catch(e => console.error('Failed to log visit:', e));

    // Track visit days
    const today = new Date().toLocaleDateString('ko-KR');
    const visitDaysStr = localStorage.getItem('korekore_visit_days');
    let visitDays: string[] = visitDaysStr ? JSON.parse(visitDaysStr) : [];
    
    if (!visitDays.includes(today)) {
      visitDays.push(today);
      localStorage.setItem('korekore_visit_days', JSON.stringify(visitDays));
    }

    if (visitDays.length >= 5 && !localStorage.getItem('korekore_nickname') && activeTab === 'report') {
      setShowLoyalModal(true);
    }

  }, [activeTab]);

  useEffect(() => {
    fetchStats();
    fetchPosts();
    fetchPatchNotes();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    
    const visitorId = localStorage.getItem('korekore_visitor_id');
    if (visitorId) {
        // 프론트엔드 시각적 주작(Optimistic Update) 중복 방지 (백엔드 24시간 정책과 동기화)
        const viewedKey = `korekore_viewed_${post.id}`;
        const lastViewed = localStorage.getItem(viewedKey);
        const now = Date.now();
        
        if (!lastViewed || now - parseInt(lastViewed, 10) > 24 * 60 * 60 * 1000) {
            setPosts(prevPosts => prevPosts.map(p => 
                p.id === post.id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p
            ));
            localStorage.setItem(viewedKey, now.toString());
        }

        // 백엔드에는 무조건 찔러보고, 백엔드가 24시간 중복 여부 알아서 컷(차단)함
        fetch(`/api/posts/${post.id}/view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitorId })
        }).catch(console.error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?t=' + new Date().getTime(), { cache: 'no-store' });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("게시물을 불러오는데 실패했습니다.", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatchNotes = async () => {
    try {
      const response = await fetch('/api/patch-notes?t=' + new Date().getTime(), { cache: 'no-store' });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (Array.isArray(data)) {
        setPatchNotes(data);
      } else {
        setPatchNotes([]);
      }
    } catch (error) {
      console.error("패치노트를 불러오는데 실패했습니다.", error);
      setPatchNotes([]);
    }
  };

  const handleForceFetch = async (bypassAuth = false) => {
    if (!bypassAuth && adminPassword !== '2026') {
      alert("관리자 비밀번호가 틀렸습니다.");
      return;
    }

    setAdminPassword('');

    if (isFetching) return;
    setIsFetching(true);

    try {
      const response = await fetch('/api/posts/force-fetch', { method: 'POST' });
      if (!response.ok) {
        throw new Error("서버에서 에러를 응답했습니다.");
      }

      const initialLatestPostId = posts.length > 0 ? posts[0].id : null;
      let attempts = 0;
      
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch('/api/posts?t=' + new Date().getTime(), { cache: 'no-store' });
          const data = await res.json();
          
          const hasNewPost = data.length > 0 && data[0].id !== initialLatestPostId;
          
          if (hasNewPost || attempts >= 40) {
            clearInterval(pollInterval);
            setPosts(data);
            setIsFetching(false);
            setIsAuthModalOpen(false);
            if (!hasNewPost) {
              alert("AI 분석이 지연되고 있습니다. 백그라운드에서 계속 작성 중이니 1~2분 뒤에 새로고침 해주세요!");
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);

    } catch (error) {
      alert("AI 심층 분석 요청에 실패했습니다.");
      setIsAuthModalOpen(false);
      setIsFetching(false);
    }
  };



  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-700/50 shadow-2xl">
            <span className="text-5xl animate-bounce">🛠️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">서버가 잠시 기절했습니다 💦</h1>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
            앗! 접속량이 폭발해서 서버가 잠시 로그아웃해버렸어요 😱<br />
            <strong>{getMaintenanceText()}</strong><br />
            빛의 속도로 심폐소생술 중이니 조금만 기다려 주시면 <strong>압도적 감사!!</strong> 🙏
          </p>
          <div className="pt-8">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 rounded-xl bg-slate-800 text-cyan-400 font-semibold hover:bg-slate-700 transition-colors border border-slate-700/50 shadow-lg"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex bg-[#0B0F19] text-slate-300 font-sans selection:bg-purple-500/30 relative ${isMagaMode ? 'border-[8px] border-red-600' : ''}`}>
      <NoticePopup />
      {isMagaMode && (
        <div className="fixed inset-0 bg-gradient-to-b from-red-900/60 via-red-800/20 to-orange-900/40 mix-blend-color-dodge animate-pulse pointer-events-none z-[100] backdrop-blur-[1px]"></div>
      )}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-[9999]">
        <button 
          onClick={toggleMagaMode}
          className={`px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-2xl transition-all border ${isMagaMode ? 'bg-red-600 text-white border-red-400 animate-pulse scale-110 shadow-[0_0_40px_rgba(220,38,38,1)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
        >
          {isMagaMode ? '🧊 찬물 샤워 (현실복귀)' : '🚀 무지성 불장 ON'}
        </button>
      </div>
      <aside className="w-64 border-r border-slate-800 bg-[#0B0F19] hidden md:flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar">
        <div className="h-20 flex items-center px-8 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
              <span className="text-xl">🏛️</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              KOREKORE
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => handleTabChange('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'home' ? 'bg-slate-800/50 text-white border border-slate-700/50' : 'hover:bg-slate-800/30 text-slate-400 border border-transparent'}`}
          >
            <span className={activeTab === 'home' ? 'text-cyan-400' : ''}>🏠</span> 로비 홈
          </button>
          
          <div className="pt-4 pb-2 px-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">서비스 메뉴</p>
          </div>
          
          {PORTAL_MENUS.map(main => {
            const readyItems = main.subCategories.flatMap(sub => sub.items).filter(item => item.isReady);
            if (readyItems.length === 0) return null; // 활성화된 하위 메뉴가 없으면 대메뉴 숨김
            
            const isExpanded = expandedMenus.includes(main.id);
            
            return (
              <div key={main.id} className="space-y-1 mb-2">
                <button 
                  onClick={() => toggleMenu(main.id)}
                  className="w-full px-2 py-1.5 flex items-center justify-between text-slate-500/80 hover:text-slate-300 font-semibold mb-1 transition-colors rounded-lg hover:bg-slate-800/30"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{main.icon}</span>
                    <span className="text-xs">{main.label}</span>
                  </div>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-600 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {main.subCategories.map((sub, idx) => {
                    const readySubItems = sub.items.filter(item => item.isReady);
                    if (readySubItems.length === 0) return null;
                    
                    return (
                      <div key={idx} className="mb-2">
                        <div className="px-4 py-1 flex items-center text-[11px] font-bold text-slate-600 mb-0.5 ml-5 uppercase tracking-widest">
                          {sub.label}
                        </div>
                        {readySubItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all pl-10 ${activeTab === item.id ? 'bg-slate-800/50 text-white border border-slate-700/50' : 'hover:bg-slate-800/30 text-slate-400 border border-transparent'}`}
                          >
                            <span className="text-lg opacity-70">{item.icon}</span> {item.label}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 border-b border-slate-800/50 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-2 select-none" onClick={handleLogoClick}>
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-white">
              <span className="text-sm">🏛️</span>
            </div>
            <h1 className="text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
              KOREKORE
            </h1>
          </div>
          <div className="hidden md:block"></div>
          
          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
            <div className="hidden bg-slate-800/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-700/30 gap-3 sm:gap-4 text-slate-300">
              <div>오늘 방문자: <span className="text-cyan-400 font-bold">{visitorStats.todayVisitors}</span></div>
              <div className="w-px bg-slate-700/50"></div>
              <div>총 방문자: <span className="text-purple-400 font-bold">{visitorStats.totalVisitors}</span></div>
            </div>
          </div>
        </header>

        {showNotice && (
          <div className="bg-gradient-to-r from-orange-900/40 via-red-900/40 to-orange-900/40 border-b border-orange-500/30 px-4 py-3 relative z-20">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce">🥵</span>
                <p className="text-sm sm:text-[15px] text-orange-200 font-medium break-keep">
                  <strong className="text-cyan-400">🎉 [복구 완료]</strong> {getPostMaintenanceText()}
                  불편을 드려 뎨송합니다.. 🥲 앞으로는 평일 주말 할 것 없이 끄떡없는 강철 서버로 모시겠습니다! (많관부 💙)
                </p>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('korekore_experienced_downtime');
                  setShowNotice(false);
                }}
                className="text-orange-400 hover:text-orange-300 p-2 shrink-0 rounded-lg hover:bg-orange-500/10 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-8 pb-40 md:pb-8 max-w-6xl mx-auto w-full">
          {activeTab === 'admin' && isAdminUnlocked && <AdminView onForceFetch={() => handleForceFetch(true)} isFetching={isFetching} />}
          {activeTab === 'admin' && !isAdminUnlocked && (
             <div className="text-center py-32 text-slate-400">
               <div className="text-6xl mb-6">🔒</div>
               <h2 className="text-2xl font-bold text-red-500 mb-2">ACCESS DENIED</h2>
               <p>권한이 없습니다.</p>
             </div>
          )}
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'scouter' && <ScouterView />}
          {activeTab === 'report' && (
            <StockReportView 
              posts={posts} 
              isLoading={isLoading} 
              visibleCount={visibleCount} 
              setVisibleCount={setVisibleCount} 
              onPostClick={handlePostClick} 
            />
          )}
          {activeTab === 'patchnotes' && <PatchNotesView patchNotes={patchNotes} />}
          {activeTab === 'calc-avg' && <AverageCalculatorView />}
          {activeTab === 'reverse-trade' && <ReverseTradeView />}
          {activeTab === 'buyback' && <BuybackTrackerView />}
          {activeTab === 'feedback' && <FeedbackView />}
          {activeTab === 'admin-secret-2026' && <AdminView />}
          {activeTab === 'kore-live' && <KoreLiveView />}
          {activeTab === 'fortune' && <FortuneCookieView />}
          {activeTab === 'calc-compound' && <CompoundCalcView />}
          {activeTab === 'fomo' && <FomoView />}
          {activeTab === 'classic-games' && <GameView />}
          
          {activeTab !== 'home' && activeTab !== 'report' && activeTab !== 'patchnotes' && activeTab !== 'scouter' && activeTab !== 'calc-avg' && activeTab !== 'calc-compound' && activeTab !== 'fomo' && activeTab !== 'admin-secret-2026' && activeTab !== 'kore-live' && activeTab !== 'fortune' && activeTab !== 'admin' && activeTab !== 'reverse-trade' && activeTab !== 'buyback' && activeTab !== 'feedback' && activeTab !== 'classic-games' && (
             <div className="text-center py-32 text-slate-400">
               <div className="text-6xl mb-6">🚧</div>
               <h2 className="text-2xl font-bold text-white mb-2">공사 중입니다</h2>
               <p>곧 멋진 기능으로 찾아오겠습니다!</p>
             </div>
          )}
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-40 flex justify-around p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center gap-1.5 w-1/3 py-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className={`text-2xl ${activeTab === 'home' ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : ''}`}>🏠</span>
          <span className="text-[11px] font-bold">홈</span>
        </button>
        <button
          onClick={() => handleTabChange('report')}
          className={`flex flex-col items-center gap-1.5 w-1/3 py-2 rounded-xl transition-all ${activeTab === 'report' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className={`text-2xl ${activeTab === 'report' ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : ''}`}>📊</span>
          <span className="text-[11px] font-bold">리포트</span>
        </button>
        <button
          onClick={() => handleTabChange('patchnotes')}
          className={`flex flex-col items-center gap-1.5 w-1/3 py-2 rounded-xl transition-all ${activeTab === 'patchnotes' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-400'}`}
        >
          <span className={`text-2xl ${activeTab === 'patchnotes' ? 'drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]' : ''}`}>📝</span>
          <span className="text-[11px] font-bold">패치노트</span>
        </button>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
          <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-md transition-opacity" onClick={() => setSelectedPost(null)}></div>

          <div className="relative bg-slate-900 border border-slate-700 shadow-2xl w-full sm:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 rounded-t-3xl sm:rounded-2xl pb-safe">
            <div className="sm:hidden w-full flex justify-center pt-3 pb-1" onClick={() => setSelectedPost(null)}>
              <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
            </div>

            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
              <div className="pr-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">{selectedPost.title}</h3>
                <p className="text-cyan-400 font-medium text-xs sm:text-sm">{selectedPost.shortContent}</p>
              </div>
              <button onClick={() => setSelectedPost(null)} className="hidden sm:block absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                ✕
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="text-slate-300 leading-relaxed text-sm sm:text-[15px] font-medium 
                [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-2 
                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
                [&>strong]:text-cyan-400 [&>strong]:font-bold 
                [&>p]:mb-5 [&>p]:leading-7
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:mb-6 [&>ul>li]:text-slate-300 
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:mb-6 [&>ol>li]:text-slate-300 
                [&>blockquote]:border-l-4 [&>blockquote]:border-cyan-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400 [&>blockquote]:bg-slate-800/30 [&>blockquote]:py-2 [&>blockquote]:my-4 [&>blockquote]:rounded-r-lg
                [&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-cyan-300">
                <ReactMarkdown>
                  {selectedPost.detailedContent || ''}
                </ReactMarkdown>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 sm:gap-0">
              <span className="text-xs text-slate-500">{new Date(selectedPost.createdAt).toLocaleString('ko-KR')}</span>
            </div>
          </div>
        </div>
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-sm" onClick={() => !isFetching && setIsAuthModalOpen(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-sm rounded-2xl p-6 animate-in zoom-in-95 duration-200">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2">AI 심층 분석 중...</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    실시간 특징주 속보를 수집하고<br />리포트를 작성하는 중입니다. (약 10초 소요)
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">관리자 인증</h3>
                <p className="text-sm text-slate-400 mb-6">새 리포트를 생성하려면 관리자 비밀번호를 입력하세요.</p>

                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleForceFetch()}
                  placeholder="비밀번호 입력"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors mb-6"
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => handleForceFetch()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-colors"
                  >
                    인증 확인
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <PushSubscriptionModal />
      <LoyalUserModal 
        isVisible={showLoyalModal} 
        onComplete={() => setShowLoyalModal(false)} 
      />
    </div>
  );
}

export default App;

