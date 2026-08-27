import React, { useState } from 'react';

export const ReverseTradeView: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState<{
    action: 'SHORT' | 'LONG' | 'UNKNOWN';
    targetPrice: string;
    description: string;
    sentiment: string;
  } | null>(null);

  const analyzeSentiment = (text: string) => {
    const buyKeywords = ['가즈아', '간다', '매수', '풀매수', '영차', '떡상', '상승', '저점', '바닥', '기회', '올라', '오른다', '탑승'];
    const sellKeywords = ['도망쳐', '돔황챠', '숏', '매도', '폭락', '떡락', '하락', '고점', '물림', '끝남', '내려', '설거지', '튀어'];

    let buyScore = 0;
    let sellScore = 0;

    buyKeywords.forEach(kw => { if (text.includes(kw)) buyScore++; });
    sellKeywords.forEach(kw => { if (text.includes(kw)) sellScore++; });

    if (buyScore > sellScore) return 'BULL';
    if (sellScore > buyScore) return 'BEAR';
    return 'NEUTRAL';
  };

  const handleAnalyze = () => {
    if (!input.trim()) {
      alert("인구신의 픽을 입력해주세요!");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);
    setProgressText('🚨 인간지표(인구신) 스캔 중...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);

      if (currentProgress === 40) setProgressText('🧠 빅데이터 반대매매 회로 가동 중...');
      if (currentProgress === 80) setProgressText('📉 최적의 반대 타점 계산 중...');
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        const sentiment = analyzeSentiment(input);
        
        if (sentiment === 'BULL') {
          setResult({
            action: 'SHORT',
            targetPrice: '현재가 대비 -30%',
            description: "인구신이 '떡상'을 외쳤습니다. 역사적 고점이라는 뜻입니다. 뒤도 돌아보지 말고 전량 매도하고 인버스(숏)에 풀베팅하십시오. 구조대는 오지 않습니다.",
            sentiment: '🔥 인구신의 포지션: 풀매수 (강력 떡상)'
          });
        } else if (sentiment === 'BEAR') {
          setResult({
            action: 'LONG',
            targetPrice: '현재가 대비 +200%',
            description: "인구신이 '폭락'을 외치며 공포감을 조성했습니다. 개미털기가 끝났다는 완벽한 매수 시그널입니다! 영혼까지 끌어모아 풀매수하십시오.",
            sentiment: '🥶 인구신의 포지션: 전량매도 (강력 떡락)'
          });
        } else {
          setResult({
            action: 'UNKNOWN',
            targetPrice: '인구신 반대 방향',
            description: "인구신의 의도가 명확하지 않지만, 어차피 반대로 가면 돈을 법니다. 인구신이 산다면 팔고, 판다면 사십시오.",
            sentiment: '🤔 인구신의 포지션: 애매함 (관망)'
          });
        }
        setIsAnalyzing(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-1.5 rounded-3xl shadow-[0_0_40px_rgba(234,179,8,0.3)]">
        <div className="bg-slate-900 rounded-[1.35rem] p-6 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBMMCAwaC00MHoiIGZpbGw9IiNlYWIzMDgiLz48L3N2Zz4=')] opacity-80"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDBMMCAwaC00MHoiIGZpbGw9IiNlYWIzMDgiLz48L3N2Zz4=')] opacity-80"></div>

          <div className="text-center space-y-4 mb-8 mt-2 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-2">
              <span className="text-3xl">🤡</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white break-keep">
              <span className="text-yellow-400">인간지표</span> 반대매매기
            </h2>
            <p className="text-slate-400 text-sm sm:text-base break-keep">
              유명 유튜버 '인구신'의 픽을 역이용하세요.<br/>
              그가 간다고 하면 팔고, 망한다고 하면 사면 돈을 법니다.
            </p>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-yellow-500 mb-2 pl-1">
                인구신은 오늘 뭐라고 했나요?
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="예: 엔비디아 지금 고점이다 다 팔고 도망쳐라 ㅋㅋ"
                className="w-full h-32 bg-slate-950/50 border-2 border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 transition-all resize-none"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 ${
                isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-[1.02]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  빅데이터 분석 중...
                </>
              ) : (
                <>반대 타점 계산하기 🎯</>
              )}
            </button>
          </div>

          {isAnalyzing && (
            <div className="mt-8 space-y-3 relative z-10 animate-in fade-in">
              <div className="flex justify-between text-xs font-bold text-yellow-500">
                <span>{progressText}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBoMjBMMCAwaC0yMHoiIGZpbGw9InJnYmEoMCwwLDAsMC4xNSkiLz48L3N2Zz4=')]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <div className={`p-1 rounded-3xl ${
            result.action === 'SHORT' 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-900 shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
            : result.action === 'LONG'
            ? 'bg-gradient-to-br from-red-600 to-orange-900 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
            : 'bg-gradient-to-br from-slate-600 to-slate-900 shadow-[0_0_30px_rgba(100,116,139,0.3)]'
          }`}>
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-[1.4rem] p-6 sm:p-8">
              
              <div className="mb-6 pb-6 border-b border-slate-800">
                <p className="text-slate-400 font-semibold text-sm mb-1">AI 1차 판독 결과</p>
                <p className="text-lg font-bold text-white">{result.sentiment}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start">
                <div className="shrink-0 flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-500 mb-2">추천 포지션</span>
                  <div className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-2 ${
                    result.action === 'SHORT' ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : result.action === 'LONG' ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-slate-500 bg-slate-500/10 text-slate-400'
                  }`}>
                    <span className="text-4xl mb-2">
                      {result.action === 'SHORT' ? '📉' : result.action === 'LONG' ? '🚀' : '🤷‍♂️'}
                    </span>
                    <span className="font-black tracking-wider text-xl">
                      {result.action === 'SHORT' ? '공매도' : result.action === 'LONG' ? '풀매수' : '관망'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300 mb-3">
                      💡 반대매매 행동강령
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[15px] sm:text-base break-keep">
                      {result.description}
                    </p>
                  </div>
                  
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 flex justify-between items-center">
                    <span className="text-slate-400 text-sm font-bold">목표 엑시트 타점</span>
                    <span className={`font-black text-lg ${
                      result.action === 'SHORT' ? 'text-blue-400' : 'text-red-400'
                    }`}>
                      {result.targetPrice}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
