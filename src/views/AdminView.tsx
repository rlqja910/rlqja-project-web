import { useState } from 'react';

interface StatData {
  totalVisitors: number;
  todayVisitors: number;
}

interface SearchStat {
  term: string;
  count: number;
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

export function AdminView({ onForceFetch, isFetching }: { onForceFetch?: () => void, isFetching?: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [stats, setStats] = useState<StatData | null>(null);
  const [topSearches, setTopSearches] = useState<SearchStat[]>([]);
  const [topPageViews, setTopPageViews] = useState<{endpoint: string, count: number}[]>([]);
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchesExpanded, setIsSearchesExpanded] = useState(false);
  const [isPageViewsExpanded, setIsPageViewsExpanded] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2026') {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      alert('비밀번호가 틀렸습니다.');
      setPin('');
    }
  };

  const fetchAdminData = async (page = 0) => {
    setIsLoading(true);
    try {
      const statsRes = await fetch('/api/logs/stats?t=' + new Date().getTime());
      if (statsRes.ok) setStats(await statsRes.json());

      const searchesRes = await fetch('/api/admin/stats/searches?t=' + new Date().getTime());
      if (searchesRes.ok) setTopSearches(await searchesRes.json());

      const pageViewsRes = await fetch('/api/admin/stats/pageviews?t=' + new Date().getTime());
      if (pageViewsRes.ok) setTopPageViews(await pageViewsRes.json());

      const logsRes = await fetch(`/api/admin/logs?page=${page}&size=15&t=` + new Date().getTime());
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 pb-32">
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">관리자 접근</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="PIN 번호를 입력하세요"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl transition-all"
            >
              접속하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 sm:p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-cyan-400">관리자 대시보드</h1>
            <button 
              onClick={() => window.location.hash = 'home'}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              🏠 홈으로
            </button>
          </div>
          <div className="flex gap-3">
            {onForceFetch && (
              <button 
                onClick={onForceFetch}
                disabled={isFetching}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-lg text-sm font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isFetching ? '수집 및 포스팅 중...' : '🚀 실시간 속보 포스팅 (수동 실행)'}
              </button>
            )}
            <button 
              onClick={() => fetchAdminData(0)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {isLoading ? '새로고침 중...' : '새로고침'}
            </button>
          </div>
        </div>

        {/* 방문자 수 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-slate-400 text-sm font-medium mb-1">오늘 방문자</h3>
            <p className="text-4xl font-bold text-white">{stats?.todayVisitors || 0}<span className="text-lg text-slate-500 ml-2">명</span></p>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-slate-400 text-sm font-medium mb-1">총 방문자</h3>
            <p className="text-4xl font-bold text-cyan-400">{stats?.totalVisitors || 0}<span className="text-lg text-slate-500 ml-2">명</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 인기 검색어 */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-1">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/60">
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
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-1">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/60">
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

          {/* 최근 액션 로그 */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-slate-700/50 bg-slate-800/60 flex justify-between items-center">
              <h2 className="text-lg font-bold">⏱ 접속 액션 로그 (페이지 {currentPage + 1}/{totalPages || 1})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/80 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">시간</th>
                    <th className="px-4 py-3 font-medium">액션</th>
                    <th className="px-4 py-3 font-medium">경로/검색어</th>
                    <th className="px-4 py-3 font-medium">방문자 ID</th>
                    <th className="px-4 py-3 font-medium">IP 주소</th>
                    <th className="px-4 py-3 font-medium">기기(User-Agent)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.action === 'SEARCH' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-200 font-medium break-all">{log.endpoint}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-[100px]" title={log.visitorId}>{log.visitorId || '-'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-mono">{log.ipAddress}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]" title={log.userAgent}>{log.userAgent || '-'}</td>
                    </tr>
                  ))}
                  {recentLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">로그 데이터가 없습니다.</td>
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
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm font-medium"
                >
                  이전
                </button>
                <span className="text-slate-400 text-sm font-medium px-4">
                  {currentPage + 1} / {totalPages}
                </span>
                <button 
                  onClick={() => fetchAdminData(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1 || isLoading}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-sm font-medium"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
