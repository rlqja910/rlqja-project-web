import { useState, useEffect } from 'react';

interface StatData {
  totalVisitors: number;
  todayVisitors: number;
}


interface AccessLog {
  id: number;
  ipAddress: string;
  visitorId: string;
  userAgent: string;
  action: string;
  endpoint: string;
  createdAt: string;
}

export function AdminView({ onForceFetch, isFetching, onClose }: { onForceFetch?: () => void, isFetching?: boolean, onClose?: () => void }) {
  const [stats, setStats] = useState<StatData | null>(null);
  const [topSearches, setTopSearches] = useState<{term: string, count: number}[]>([]);
  const [topPageViews, setTopPageViews] = useState<{endpoint: string, count: number}[]>([]);
  const [topReturningVisitors, setTopReturningVisitors] = useState<{visitorId: string, daysVisited: number, totalActions: number}[]>([]);
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchesExpanded, setIsSearchesExpanded] = useState(false);
  const [isPageViewsExpanded, setIsPageViewsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'logs' | 'push'>('stats');
  const [filterVisitorId, setFilterVisitorId] = useState<string>('');
  const [pushPayload, setPushPayload] = useState({ title: '⚠️ [긴급] KOREKORE 속보', body: '', url: 'https://korekore.vercel.app' });
  const [isSendingPush, setIsSendingPush] = useState(false);

  useEffect(() => {
    fetchAdminData(0);
  }, [filterVisitorId]);

  const fetchAdminData = async (page = 0) => {
    setIsLoading(true);
    try {
      const statsRes = await fetch('/api/logs/stats?t=' + new Date().getTime());
      if (statsRes.ok) setStats(await statsRes.json());

      const searchesRes = await fetch('/api/admin/stats/searches?t=' + new Date().getTime());
      if (searchesRes.ok) setTopSearches(await searchesRes.json());

      const pageViewsRes = await fetch('/api/admin/stats/pageviews?t=' + new Date().getTime());
      if (pageViewsRes.ok) setTopPageViews(await pageViewsRes.json());

      const retentionRes = await fetch('/api/admin/stats/retention?t=' + new Date().getTime());
      if (retentionRes.ok) setTopReturningVisitors(await retentionRes.json());

      const visitorQuery = filterVisitorId ? `&visitorId=${encodeURIComponent(filterVisitorId)}` : '';
      const logsRes = await fetch(`/api/admin/logs?page=${page}&size=15${visitorQuery}&t=` + new Date().getTime());
      if (logsRes.ok) {
        const pageData = await logsRes.json();
        setRecentLogs(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.number);
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 sm:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-3xl font-black text-cyan-400">관리자 대시보드</h1>
            <button 
              onClick={() => {
                window.location.hash = 'home';
                if (onClose) onClose();
              }}
              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              🏠 홈으로
            </button>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {onForceFetch && (
              <button 
                onClick={() => {
                  const inputPin = prompt('속보 포스팅을 실행하시려면 암호(PIN)를 입력하세요.');
                  if (inputPin === '1223') {
                    onForceFetch();
                  } else if (inputPin !== null) {
                    alert('암호가 틀렸습니다.');
                  }
                }}
                disabled={isFetching}
                className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-lg text-[10px] sm:text-sm font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-1 sm:gap-2"
              >
                {isFetching ? '수집 중...' : '🚀 수동 포스팅'}
              </button>
            )}
            <button 
              onClick={() => fetchAdminData(0)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] sm:text-sm transition-colors flex items-center gap-1 sm:gap-2"
            >
              {isLoading ? '로딩...' : '새로고침'}
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-slate-700/50 pb-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'stats' 
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            📊 통계 요약
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'logs' 
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            📋 시스템 접속 로그
          </button>
          <button
            onClick={() => setActiveTab('push')}
            className={`px-5 py-2.5 font-bold text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'push' 
                ? 'border-red-400 text-red-400 bg-red-900/20' 
                : 'border-transparent text-slate-400 hover:text-red-300 hover:bg-slate-800/30'
            }`}
          >
            🚨 실시간 푸시 발송
          </button>
        </div>

        {activeTab === 'stats' && (
          <>
            {/* 방문자 수 요약 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-slate-400 text-xs sm:text-sm font-medium mb-1">오늘 방문자</h3>
                <p className="text-2xl sm:text-4xl font-bold text-white">{stats?.todayVisitors || 0}<span className="text-sm sm:text-lg text-slate-500 ml-1 sm:ml-2">명</span></p>
              </div>
              <div className="bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <h3 className="text-slate-400 text-xs sm:text-sm font-medium mb-1">총 방문자</h3>
                <p className="text-2xl sm:text-4xl font-bold text-cyan-400">{stats?.totalVisitors || 0}<span className="text-sm sm:text-lg text-slate-500 ml-1 sm:ml-2">명</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 인기 검색어 */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-1 shadow-lg">
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
                  <h2 className="text-lg font-bold">🔥 인기 검색어 TOP 10</h2>
                </div>
                <div className="p-0">
                  {topSearches.length > 0 ? (
                    <>
                      <ul className="divide-y divide-slate-700/50">
                        {(isSearchesExpanded ? topSearches : topSearches.slice(0, 6)).map((search, idx) => (
                          <li key={idx} className="flex justify-between items-center p-4 hover:bg-slate-700/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-yellow-400' : 'text-slate-500'}`}>{idx + 1}</span>
                              <span className="font-medium text-slate-200">{search.term}</span>
                            </div>
                            <span className="text-cyan-400 font-bold bg-cyan-900/30 px-3 py-1 rounded-full text-sm">
                              {search.count}회
                            </span>
                          </li>
                        ))}
                      </ul>
                      {topSearches.length > 6 && (
                        <button 
                          onClick={() => setIsSearchesExpanded(!isSearchesExpanded)}
                          className="w-full p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors border-t border-slate-700/50"
                        >
                          {isSearchesExpanded ? '접기' : '더보기'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-500">검색 데이터가 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 인기 페이지 접근 횟수 */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-1 shadow-lg">
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
                  <h2 className="text-lg font-bold">📄 가장 많이 본 페이지</h2>
                </div>
                <div className="p-0">
                  {topPageViews.length > 0 ? (
                    <>
                      <ul className="divide-y divide-slate-700/50">
                        {(isPageViewsExpanded ? topPageViews : topPageViews.slice(0, 6)).map((page, idx) => (
                          <li key={idx} className="flex justify-between items-center p-4 hover:bg-slate-700/20 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-cyan-400' : 'text-slate-500'}`}>{idx + 1}</span>
                              <span className="font-medium text-slate-200">{page.endpoint}</span>
                            </div>
                            <span className="text-cyan-400 font-bold bg-cyan-900/30 px-3 py-1 rounded-full text-sm">
                              {page.count}회
                            </span>
                          </li>
                        ))}
                      </ul>
                      {topPageViews.length > 6 && (
                        <button 
                          onClick={() => setIsPageViewsExpanded(!isPageViewsExpanded)}
                          className="w-full p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/30 transition-colors border-t border-slate-700/50"
                        >
                          {isPageViewsExpanded ? '접기' : '더보기'}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-500">통계 데이터가 없습니다.</div>
                  )}
                </div>
              </div>

              {/* 단골 방문자 Top 10 */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-1 shadow-lg">
                <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
                  <h2 className="text-lg font-bold">🏆 단골 방문자 Top 10</h2>
                </div>
                <div className="p-0">
                  {topReturningVisitors.length > 0 ? (
                    <ul className="divide-y divide-slate-700/50">
                      {topReturningVisitors.map((visitor, idx) => (
                        <li key={idx} className="flex justify-between items-center p-4 hover:bg-slate-700/20 transition-colors">
                          <div className="flex items-center gap-3 w-1/2">
                            <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-purple-400' : 'text-slate-500'}`}>{idx + 1}</span>
                            <button 
                              onClick={() => {
                                setFilterVisitorId(visitor.visitorId);
                                setActiveTab('logs');
                                // The useEffect or a direct call will fetch the filtered data.
                                // We'll rely on the fetchAdminData call below by passing page 0.
                                // But since state update is async, we can just call it here with the id directly or add useEffect.
                              }}
                              className="font-medium text-slate-200 text-xs truncate hover:text-cyan-400 hover:underline text-left" 
                              title={visitor.visitorId}
                            >
                              {visitor.visitorId}
                            </button>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-purple-400 font-bold bg-purple-900/30 px-2 py-0.5 rounded text-xs">
                              {visitor.daysVisited}일 접속
                            </span>
                            <span className="text-slate-500 text-[10px]">
                              총 {visitor.totalActions}회 활동
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-slate-500">통계 데이터가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg">
            <div className="p-3 sm:p-5 border-b border-slate-700/50 bg-slate-800/60 flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-bold">⏱ 접속 액션 로그 (페이지 {currentPage + 1}/{totalPages || 1})</h2>
              {filterVisitorId && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700 truncate max-w-[150px] sm:max-w-[200px]" title={filterVisitorId}>
                    ID: {filterVisitorId}
                  </span>
                  <button 
                    onClick={() => {
                      setFilterVisitorId('');
                    }}
                    className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded font-bold transition-colors"
                  >
                    필터 해제 ✕
                  </button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-800/80 text-slate-400">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">시간</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">액션</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">경로/검색어</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">IP 주소</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 font-medium">기기(User-Agent)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt + 'Z').toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold ${log.action === 'SEARCH' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-200 font-medium break-all text-[11px] sm:text-sm">{log.endpoint}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-500 text-[10px] sm:text-xs font-mono">{log.ipAddress}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-500 text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[150px]" title={log.userAgent}>{log.userAgent || '-'}</td>
                    </tr>
                  ))}
                  {recentLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">로그 데이터가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-center gap-2 items-center">
                <button 
                  onClick={() => fetchAdminData(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || isLoading}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  이전
                </button>
                <span className="text-slate-400 text-sm font-medium px-4">
                  {currentPage + 1} / {totalPages}
                </span>
                <button 
                  onClick={() => fetchAdminData(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1 || isLoading}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm font-medium transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'push' && (
          <div className="bg-slate-800/40 rounded-2xl border border-red-500/50 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.15)] max-w-2xl mx-auto">
            <div className="p-5 border-b border-slate-700/50 bg-red-900/30">
              <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                🚨 긴급 푸시 알림 브로드캐스트
              </h2>
              <p className="text-sm text-slate-400 mt-2">알림 권한을 허용한 모든 유저의 폰으로 실시간 알림을 쏩니다.</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">알림 제목</label>
                <input 
                  type="text" 
                  value={pushPayload.title}
                  onChange={(e) => setPushPayload({...pushPayload, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">알림 내용</label>
                <textarea 
                  value={pushPayload.body}
                  onChange={(e) => setPushPayload({...pushPayload, body: e.target.value})}
                  placeholder="미친 떡상 종목 포착! 지금 바로 확인하세요!"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors custom-scrollbar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">클릭 시 이동할 URL</label>
                <input 
                  type="text" 
                  value={pushPayload.url}
                  onChange={(e) => setPushPayload({...pushPayload, url: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={async () => {
                    if (!pushPayload.body) {
                      alert('알림 내용을 입력해주세요.');
                      return;
                    }
                    if (!confirm('정말 모든 유저에게 푸시 알림을 발송하시겠습니까? (취소 불가)')) return;
                    
                    setIsSendingPush(true);
                    try {
                      const res = await fetch('/api/push/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(pushPayload)
                      });
                      if (res.ok) {
                        alert('푸시 알림이 성공적으로 발송되었습니다! 🚀');
                        setPushPayload({...pushPayload, body: ''});
                      } else {
                        alert('발송 실패: 서버 오류');
                      }
                    } catch (e) {
                      alert('네트워크 오류');
                    }
                    setIsSendingPush(false);
                  }}
                  disabled={isSendingPush}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 transition-all text-lg"
                >
                  {isSendingPush ? '발송 중...' : '전체 유저에게 푸시 쏘기 💥'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
