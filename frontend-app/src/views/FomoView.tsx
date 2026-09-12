import { useState } from 'react';

const PRESETS = [
  { label: '코로나 폭락장 (2020년 3월)', date: '2020-03-19' },
  { label: '비트코인 상투 (2018년 1월)', date: '2018-01-06' },
  { label: '리먼 브라더스 (2008년 9월)', date: '2008-09-15' },
  { label: '작년 이맘때', date: new Date(Date.now() - 365*24*60*60*1000).toISOString().split('T')[0] }
];

const getSavageComment = (pct: number) => {
  if (pct >= 1000) return { text: "이때 샀으면 이미 퇴사하고 하와이에서 모히또 마시고 있을텐데 🍹", color: "text-emerald-300" };
  if (pct >= 500) return { text: "강남에 집 사고 람보르기니 뽑았을 텐데... 🏎️", color: "text-emerald-300" };
  if (pct >= 300) return { text: "지금쯤 포르쉐 계약하러 갔을텐데... 🚙", color: "text-emerald-400" };
  if (pct >= 200) return { text: "이때 전재산 몰빵했으면 인생이 달라졌을텐데 💸", color: "text-emerald-400" };
  if (pct >= 150) return { text: "아... 그때 샀으면 벤츠 E클래스 뽑았을텐데... 🚗", color: "text-green-300" };
  if (pct >= 100) return { text: "두 배라니... 내 월급이 몇 달치야 이게 😭", color: "text-green-300" };
  if (pct >= 80) return { text: "명품백 몇 개가 날아간거냐... 👜", color: "text-green-400" };
  if (pct >= 60) return { text: "이번 달 카드값 걱정은 안 해도 됐을텐데 💳", color: "text-green-400" };
  if (pct >= 40) return { text: "최신형 아이폰이랑 맥북 풀옵션 샀을텐데 💻", color: "text-green-500" };
  if (pct >= 30) return { text: "호캉스 한 달 내내 가도 남았을텐데 🏨", color: "text-green-500" };
  if (pct >= 25) return { text: "한 달 생활비는 거뜬히 벌었을텐데 💵", color: "text-green-500" };
  if (pct >= 20) return { text: "오마카세 몇 번을 공짜로 먹을 수 있었는데 🍣", color: "text-green-500" };
  if (pct >= 15) return { text: "소고기 1++ 투뿔 회식을 몇 번을 하는데 🥩", color: "text-green-500" };
  if (pct >= 10) return { text: "치킨이 도대체 몇 마리야... 🍗", color: "text-green-500" };
  if (pct >= 5) return { text: "국밥 몇 그릇이 허공으로 날아갔네 🍲", color: "text-green-500" };
  if (pct > 0) return { text: "땅 파면 십원 한 장 나오냐... 그래도 아깝다 🪙", color: "text-green-500" };
  if (pct === 0) return { text: "본전치기... 아무 일도 일어나지 않았다 😑", color: "text-slate-400" };
  
  if (pct > -5) return { text: "뭐 이정도면 점심값 날린 셈 치자 🍔", color: "text-blue-300" };
  if (pct > -10) return { text: "아... 안 사길 잘했네 국밥값 굳었다 😋", color: "text-blue-300" };
  if (pct > -15) return { text: "치킨 파티 취소될 뻔했네 다행이다 😮‍💨", color: "text-blue-400" };
  if (pct > -20) return { text: "오마카세 돈 주고 내상입을 뻔했네 🤮", color: "text-blue-400" };
  if (pct > -25) return { text: "한 달 생활비가 삭제될 뻔했습니다 ✂️", color: "text-blue-400" };
  if (pct > -30) return { text: "휴... 안 사길 다행이다 ☠️ (압도적 감사)", color: "text-blue-500" };
  if (pct > -40) return { text: "지금 샀으면 한강물 온도 재고 있을 뻔... 🥶", color: "text-blue-500" };
  if (pct > -50) return { text: "진짜 큰일날 뻔했네 ㄷㄷ 명의도용 당할 뻔 😨", color: "text-red-300" };
  if (pct > -60) return { text: "와... 이거 샀으면 지금쯤 파산했네 📉", color: "text-red-400" };
  if (pct > -80) return { text: "반의 반토막... 조상님이 도왔다! 모니터에 절 한번 하십쇼 🙇‍♂️", color: "text-red-500" };
  if (pct > -95) return { text: "상장폐지 수준... 지옥에서 돌아온 것을 환영합니다 👹", color: "text-red-600" };
  return { text: "이건 주식이 아니라 휴지조각입니다 🧻", color: "text-red-600" };
};


export default function FomoView() {
  const [stockName, setStockName] = useState('엔비디아');
  const [date, setDate] = useState('2020-03-19');
  const [amount, setAmount] = useState('10000000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateFomo = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/fomo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockName,
          date,
          amount: parseFloat(amount)
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const isProfit = result?.profit_pct > 0;
  
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 mb-2">
            <span className="text-4xl">🕰️</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight">
            FOMO 타임머신
          </h1>
          <p className="text-slate-400 text-lg">
            "아... 그때 그걸 샀더라면..." 지금 바로 뼈 맞아보세요 🦴
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-800/50 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-8 backdrop-blur-sm">
          <div className="space-y-6">
            
            {/* 시점 선택 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">언제로 돌아갈까요? (YYYY-MM-DD)</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setDate(preset.date)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600/50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 종목 입력 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">어떤 종목을 살까요?</label>
              <input 
                type="text"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                placeholder="예: 삼성전자, 테슬라, 엔비디아, 비트코인"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500 pl-1">AI가 찰떡같이 알아서 종목(티커)을 찾아줍니다 🤖</p>
            </div>

            {/* 금액 입력 */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">얼마를 투자할까요? (원)</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono text-lg"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[1000000, 5000000, 10000000, 50000000, 100000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="text-xs bg-slate-700/50 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600/50 font-mono"
                  >
                    +{(val / 10000).toLocaleString()}만
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={calculateFomo}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <span className="animate-spin text-xl">🌀</span> 타임머신 가동 중...
              </>
            ) : (
              <>
                🚀 과거로 돌아가기
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all duration-700 animate-in fade-in slide-in-from-bottom-10 ${
            isProfit 
              ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/20 border-green-500/30' 
              : 'bg-gradient-to-br from-blue-900/40 to-slate-900/40 border-blue-500/30 grayscale-[50%]'
          }`}>
            
            {/* Background Icon */}
            <div className="absolute -right-10 -top-10 opacity-10 text-9xl">
              {isProfit ? '💸' : '🌧️'}
            </div>

            <div className="relative z-10 space-y-6 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 text-sm font-medium text-slate-300">
                {result.actual_date} 기준 ({result.ticker})
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                그때 {result.real_stock_name}에<br/>
                <span className="text-purple-400">{parseFloat(amount).toLocaleString()}원</span>을 넣었더라면...
              </h2>

              <div className="py-6">
                <div className={`text-5xl sm:text-6xl font-extrabold tracking-tighter ${
                  isProfit ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300' : 'text-blue-400'
                }`}>
                  {result.current_value.toLocaleString()}원
                </div>
                <div className={`text-xl font-semibold mt-2 ${isProfit ? 'text-green-400' : 'text-blue-400'}`}>
                  {isProfit ? '+' : ''}{result.profit_pct.toLocaleString()}% ({result.multiplier}배)
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-700/50 flex justify-between items-center text-sm sm:text-base">
                <div className="text-left">
                  <div className="text-slate-400">당시 주가</div>
                  <div className="font-mono text-white">{result.past_price.toLocaleString()}</div>
                </div>
                <div className="text-2xl text-slate-600">→</div>
                <div className="text-right">
                  <div className="text-slate-400">현재 주가</div>
                  <div className="font-mono text-white">{result.current_price.toLocaleString()}</div>
                </div>
              </div>

              <div className="pt-4">
                <p className={`text-lg sm:text-xl font-bold ${getSavageComment(result.profit_pct).color}`}>
                  {getSavageComment(result.profit_pct).text}
                </p>
              </div>
              
              {result.profit_pct >= 1000 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen opacity-30">
                   <div className="text-9xl animate-pulse">🚀🤑🚀</div>
                </div>
              )}
              {result.profit_pct <= -50 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen opacity-20">
                   <div className="text-9xl animate-pulse">💀📉💀</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
