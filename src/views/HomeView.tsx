import React, { useState, useEffect } from 'react';
import { PORTAL_MENUS } from '../config/menu';
import { useMagaMode } from '../hooks/useMagaMode';
import { FearGreedGauge } from '../components/FearGreedGauge';

interface MarketPredict {
  ewy: { current: number; change_amt: number; change_pct: number; };
  usdkrw: { current: number; change_amt: number; change_pct: number; };
  kospi: { current: number; predicted: number; change_amt: number; change_pct: number; };
  kosdaq: { current: number; predicted: number; change_amt: number; change_pct: number; };
}

export const HomeView: React.FC = () => {
  const [expandedCats, setExpandedCats] = useState<string[]>(['finance', 'utilities', 'trends', 'games']);
  const [marketStatus, setMarketStatus] = useState<{ kr_closed: boolean, us_closed: boolean } | null>(null);
  const [predictData, setPredictData] = useState<MarketPredict | null>(null);
  const [fearAndGreed, setFearAndGreed] = useState<{ us: {value: number, classification: string}, kr: {value: number, classification: string} } | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { isMagaMode } = useMagaMode();

  const displayPredictData = isMagaMode && predictData ? {
    ...predictData,
    kospi: { ...predictData.kospi, predicted: predictData.kospi.current * 1.305, change_pct: 30.5, change_amt: predictData.kospi.current * 0.305 },
    kosdaq: { ...predictData.kosdaq, predicted: predictData.kosdaq.current * 1.452, change_pct: 45.2, change_amt: predictData.kosdaq.current * 0.452 },
    ewy: { ...predictData.ewy, current: predictData.ewy.current * 1.758, change_pct: 75.8, change_amt: predictData.ewy.current * 0.758 },
    usdkrw: predictData.usdkrw ? { ...predictData.usdkrw, current: predictData.usdkrw.current * 0.845, change_pct: -15.5, change_amt: predictData.usdkrw.current * -0.155 } : undefined
  } : predictData;

  const displayFearAndGreed = isMagaMode ? { us: { value: 100, classification: 'Extreme Greed' }, kr: { value: 100, classification: 'Extreme Greed' } } : fearAndGreed;

  useEffect(() => {
    fetch('/api/market-status?t=' + new Date().getTime(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setMarketStatus(data))
      .catch(err => console.error(err));

    fetch('/api/fear-and-greed?t=' + new Date().getTime(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFearAndGreed({ us: data.us, kr: data.kr });
      })
      .catch(err => console.error(err));

    const fetchPredict = () => {
      fetch('/api/market-predict?t=' + new Date().getTime(), { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.success) setPredictData(data);
        })
        .catch(err => console.error(err));
    };
    fetchPredict();
    const interval = setInterval(fetchPredict, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };
  const handleCardClick = (id: string, isReady: boolean) => {
    if (!isReady) {
      alert("열심히 개발 중인 기능입니다! 🛠️");
      return;
    }
    window.location.hash = id;
  };

  return (
    <section className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="text-center space-y-4 pt-2 pb-6 sm:pt-4 sm:pb-8 relative z-10">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[800px] h-64 ${isMagaMode ? 'bg-red-600/30' : 'bg-purple-600/10'} rounded-[100%] blur-3xl pointer-events-none transition-colors duration-1000`}></div>
        {marketStatus && (
          <div className="flex justify-center gap-4 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${marketStatus.kr_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              🇰🇷 한국증시: {marketStatus.kr_closed ? '휴장' : '개장'}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${marketStatus.us_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              🇺🇸 미국증시: {marketStatus.us_closed ? '휴장' : '개장'}
            </span>
          </div>
        )}
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-pixel text-white leading-tight break-keep tracking-widest drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          당신의 모든 것을 위한 <br />
          <span className="text-yellow-400">
            KOREKORE 
          </span>
        </h2>
        <p className="relative text-base sm:text-lg text-slate-300 max-w-2xl mx-auto break-keep mt-4 font-pixel tracking-wider bg-black/50 py-2 px-4 rounded-xl inline-block brutal-border">
          실시간 글로벌 금융 데이터부터 AI 심층 분석까지!
        </p>

        {displayPredictData && (
          <div className={`mt-6 max-w-3xl mx-auto bg-cyan-300 brutal-border brutal-shadow-lg p-4 sm:p-5 relative flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_0_0_#111827]`}>
            <div className={`absolute top-0 left-0 w-full h-2 bg-pink-400 border-b-4 border-black`}></div>
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-pixel font-bold text-black mt-2">
              <span>🔮 국장 픽셀 라이브 예측</span>
              <span className="flex h-3 w-3 relative ml-1">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black`}></span>
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6 text-sm sm:text-base w-full px-1 font-pixel tracking-wider font-bold">
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 bg-white px-3 py-1 brutal-border brutal-shadow-sm">
                <span className="text-black">코스피</span>
                <span className="text-blue-600">{displayPredictData.kospi.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`${displayPredictData.kospi.change_pct >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {displayPredictData.kospi.change_pct >= 0 ? '▲' : '▼'}{Math.abs(displayPredictData.kospi.change_amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 bg-white px-3 py-1 brutal-border brutal-shadow-sm">
                <span className="text-black">코스닥</span>
                <span className="text-blue-600">{displayPredictData.kosdaq.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`${displayPredictData.kosdaq.change_pct >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {displayPredictData.kosdaq.change_pct >= 0 ? '▲' : '▼'}{Math.abs(displayPredictData.kosdaq.change_amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 bg-white px-3 py-1 brutal-border brutal-shadow-sm">
                <span className="text-black">EWY</span>
                <span className={`${displayPredictData.ewy.change_pct >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {displayPredictData.ewy.change_pct > 0 ? '+' : ''}{displayPredictData.ewy.change_pct}%
                </span>
              </div>
              {displayPredictData.usdkrw && (
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 bg-white px-3 py-1 brutal-border brutal-shadow-sm">
                  <span className="text-black">환율</span>
                  <span className="text-blue-600">{displayPredictData.usdkrw.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`${displayPredictData.usdkrw.change_pct >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {displayPredictData.usdkrw.change_pct > 0 ? '+' : ''}{displayPredictData.usdkrw.change_pct}%
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={() => window.location.hash = 'kore-live'}
              className="mt-3 bg-yellow-400 hover:bg-yellow-300 brutal-border brutal-shadow px-6 py-2 text-sm sm:text-base font-pixel text-black transition-all hover:-translate-y-1 hover:shadow-none flex items-center gap-2"
            >
              한국 주식 24h 라이브 입장 <span>›</span>
            </button>
          </div>
        )}

        {displayFearAndGreed && (
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 w-full">
              <FearGreedGauge 
                value={displayFearAndGreed.us.value} 
                classification={displayFearAndGreed.us.classification} 
                title="🦅 미국 (S&P 500)" 
              />
              <FearGreedGauge 
                value={displayFearAndGreed.kr.value} 
                classification={displayFearAndGreed.kr.classification} 
                title="🐯 한국 (KOSPI)" 
              />
            </div>


            {/* Pentagon Pizza Index */}
            <div className={`inline-flex items-center gap-2.5 bg-slate-900/60 border ${isMagaMode ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-slate-700/50'} rounded-full px-5 py-2.5 shadow-xl backdrop-blur-sm cursor-help transition-all`} title="지정학적 위기(공포)가 커지면 펜타곤 야근이 늘어나 피자 배달이 급증한다는 금융권 밈 지수">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-tight flex items-center gap-1.5">
                펜타곤 야근(피자) 지수
                <button 
                  onClick={() => setIsInfoModalOpen(true)}
                  className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center hover:bg-cyan-500/80 transition-colors shadow-sm"
                  title="지표 설명 보기"
                >
                  <span className="text-[10px] font-black text-white leading-none">?</span>
                </button>
              </h3>
              <div className="flex gap-0.5 ml-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-base transition-all duration-500 ${
                    i < (displayFearAndGreed.us.value <= 25 ? 5 : displayFearAndGreed.us.value <= 45 ? 3 : displayFearAndGreed.us.value <= 55 ? 2 : 1) 
                    ? 'opacity-100 scale-110 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]' 
                    : 'opacity-20 grayscale'
                  }`}>🍕</span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="space-y-8 sm:space-y-12">
        {PORTAL_MENUS.map((main) => {
          const isExpanded = expandedCats.includes(main.id);
          return (
            <div key={main.id} className="space-y-4">
              <div 
                className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 cursor-pointer group select-none"
                onClick={() => toggleCategory(main.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl transition-transform group-hover:scale-110">{main.icon}</span>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{main.label}</h3>
                </div>
                <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 !m-0'}`}>
                {main.subCategories.map((sub, sIdx) => {
                  const readyItems = sub.items;
                  if (readyItems.length === 0) return null;
                  
                  const colors = ['bg-yellow-400', 'bg-cyan-400', 'bg-pink-400', 'bg-green-400', 'bg-purple-400'];
                  
                  return (
                    <div key={sIdx} className="mb-6 last:mb-0">
                      <h4 className="text-xs font-bold font-pixel text-slate-400 uppercase tracking-widest mb-3 pl-1">{sub.label}</h4>
                      <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory px-1">
                        {readyItems.map((item, iIdx) => {
                          const color = colors[(sIdx + iIdx) % colors.length];
                          return (
                          <div
                            key={item.id}
                            onClick={() => handleCardClick(item.id, item.isReady)}
                            className={`shrink-0 snap-start w-36 sm:w-44 relative overflow-visible group rounded-xl p-4 sm:p-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                              item.isReady
                                ? `${color} brutal-border brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0_0_0_0_#111827] cursor-pointer`
                                : 'bg-gray-300 brutal-border cursor-not-allowed opacity-70 grayscale'
                            } flex flex-col items-center gap-3 text-center`}
                            style={{ animationDelay: `${(sIdx * 3 + iIdx) * 40}ms`, animationFillMode: 'both' }}
                          >
                            {!item.isReady && (
                              <div className="absolute top-0 right-0 bg-black text-white font-pixel text-[9px] px-2 py-1 border-l-2 border-b-2 border-black rounded-bl-lg">
                                준비중
                              </div>
                            )}
                            
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 brutal-border bg-white shadow-[2px_2px_0_0_#111827] ${item.isReady ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}>
                              <span className={`text-3xl sm:text-4xl transition-transform duration-300`}>
                                {item.icon}
                              </span>
                            </div>
                            
                            <div className="w-full mt-2">
                              <h4 className={`text-sm sm:text-base font-pixel font-black tracking-widest break-keep leading-tight ${item.isReady ? 'text-black' : 'text-gray-600'}`}>
                                {item.label}
                              </h4>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* Information Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsInfoModalOpen(false)}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-5">지표 가이드 📖</h3>
            
            <div className="space-y-5 text-sm text-slate-300">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">글로벌 위험자산 투심 (Fear & Greed)</h4>
                <p className="leading-relaxed">
                  시장의 투자 심리를 0(극단적 공포)부터 100(극단적 탐욕)까지 수치화한 지표입니다. <br/>
                  <span className="text-red-400">공포</span>일 때는 매도세가, <span className="text-green-400">탐욕</span>일 때는 매수세가 강함을 의미합니다. (공포장이 줍줍 기회이기도 합니다!)
                </p>
              </div>
              
              <div className="h-px w-full bg-slate-800"></div>
              
              <div>
                <h4 className="font-bold text-orange-400 mb-2">펜타곤 야근(피자) 지수 🍕</h4>
                <p className="leading-relaxed">
                  미국 국방부(펜타곤)에 심야 피자 배달이 급증하면, 수뇌부가 밤샘 비상근무를 하고 있어 <b>'전 세계 어딘가에 큰 위기가 터졌다'</b>는 유명한 월스트리트 밈(Meme)입니다.<br/>
                  <span className="text-slate-500 text-[11px] block mt-1">* 글로벌 투심(공포도)을 기반으로 재미있게 시각화했습니다.</span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsInfoModalOpen(false)}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-slate-700"
            >
              확인했어요!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
