import React, { useState, useEffect } from 'react';
import { PORTAL_MENUS } from '../config/menu';
import { useMagaMode } from '../hooks/useMagaMode';
import { FearGreedGauge } from '../components/FearGreedGauge';
import { PixelIcon } from '../components/PixelIcon';

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
      alert("열심히 개발 중인 기능입니다!");
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
            <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${marketStatus.kr_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              <span className="font-pixel">KOR: {marketStatus.kr_closed ? '휴장' : '개장'}</span>
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${marketStatus.us_closed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
              <span className="font-pixel">USA: {marketStatus.us_closed ? '휴장' : '개장'}</span>
            </span>
          </div>
        )}
        <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-pixel text-white leading-tight break-keep tracking-widest drop-shadow-[2px_2px_0_#7c3aed]">
          당신의 모든 것을 위한 <br />
          <span className="pokemon-title block mt-2 text-4xl sm:text-5xl md:text-6xl">
            KOREKORE 
          </span>
        </h2>
        <p className="relative text-base sm:text-lg text-gray-300 max-w-2xl mx-auto break-keep mt-4 font-pixel tracking-wider bg-[#1a103c]/80 py-2 px-4 rounded-xl inline-block brutal-border">
          실시간 글로벌 금융 데이터부터 AI 심층 분석까지!
        </p>

        {displayPredictData && (
          <div className={`mt-6 max-w-3xl mx-auto retro-panel p-3 sm:p-4 relative flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-1`}>
            
            <div className="flex items-center gap-2 text-base sm:text-lg pokemon-text text-white mt-1">
              <PixelIcon name="trending-up" className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>KOREKORE 종합 시황</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full font-pixel tracking-wider">
              <div className="flex items-center justify-between bg-black/60 px-3 py-2 border-2 border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="text-gray-400 text-sm">코스피</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{displayPredictData.kospi.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`text-sm ${displayPredictData.kospi.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {displayPredictData.kospi.change_pct > 0 ? '+' : ''}{displayPredictData.kospi.change_pct}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-black/60 px-3 py-2 border-2 border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="text-gray-400 text-sm">코스닥</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{displayPredictData.kosdaq.predicted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`text-sm ${displayPredictData.kosdaq.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {displayPredictData.kosdaq.change_pct > 0 ? '+' : ''}{displayPredictData.kosdaq.change_pct}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-black/60 px-3 py-2 border-2 border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                <span className="text-gray-400 text-[11px] sm:text-xs">MSCI 한국 ETF (EWY)</span>
                <span className={`text-white font-bold text-sm ${displayPredictData.ewy.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {displayPredictData.ewy.change_pct > 0 ? '+' : ''}{displayPredictData.ewy.change_pct}%
                </span>
              </div>
              
              {displayPredictData.usdkrw ? (
                <div className="flex items-center justify-between bg-black/60 px-3 py-2 border-2 border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                  <span className="text-gray-400 text-sm">환율</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{displayPredictData.usdkrw.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`text-sm ${displayPredictData.usdkrw.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {displayPredictData.usdkrw.change_pct > 0 ? '+' : ''}{displayPredictData.usdkrw.change_pct}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-black/60 px-3 py-2 border-2 border-slate-700 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                  <span className="text-gray-400 text-sm">환율</span>
                  <span className="text-slate-600 font-bold">-</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => window.location.hash = 'kore-live'}
              className="mt-2 retro-button px-6 py-2.5 text-sm sm:text-base font-pixel w-full sm:w-auto"
            >
              글로벌 증시 라이브 입장 (ENTER)
            </button>
          </div>
        )}

        {displayFearAndGreed && (
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
              <FearGreedGauge 
                value={displayFearAndGreed.us.value} 
                classification={displayFearAndGreed.us.classification} 
                title="미국 (S&P 500)" 
              />
              <FearGreedGauge 
                value={displayFearAndGreed.kr.value} 
                classification={displayFearAndGreed.kr.classification} 
                title="한국 (KOSPI)" 
              />
            </div>


            {/* Pentagon Pizza Index */}
            <div className={`mt-2 retro-panel px-6 py-4 flex flex-col sm:flex-row items-center gap-4 cursor-help transition-all group`} title="지정학적 위기(공포)가 커지면 펜타곤 야근이 늘어나 피자 배달이 급증한다는 금융권 밈 지수">
              <div className="flex flex-col items-center sm:items-start">
                <h3 className="text-xs font-pixel text-purple-400 flex items-center gap-2 mb-1">
                  <PixelIcon name="warning-diamond" className="w-4 h-4" />
                  펜타곤 야근 지수
                  <button 
                    onClick={() => setIsInfoModalOpen(true)}
                    className="w-4 h-4 bg-slate-700 flex items-center justify-center hover:bg-cyan-500/80 transition-colors shadow-sm"
                  >
                    <span className="text-[10px] font-pixel text-white leading-none">?</span>
                  </button>
                </h3>
                <span className="text-[10px] text-gray-400 font-pixel">글로벌 위기 시그널</span>
              </div>
              
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 flex items-center justify-center bg-black border-2 transition-all duration-500 ${
                    i < (displayFearAndGreed.us.value <= 25 ? 5 : displayFearAndGreed.us.value <= 45 ? 3 : displayFearAndGreed.us.value <= 55 ? 2 : 1) 
                    ? 'border-red-500 shadow-[inset_0_0_10px_rgba(239,68,68,0.6)] animate-pulse' 
                    : 'border-slate-800'
                  }`}>
                    {i < (displayFearAndGreed.us.value <= 25 ? 5 : displayFearAndGreed.us.value <= 45 ? 3 : displayFearAndGreed.us.value <= 55 ? 2 : 1) && (
                      <div className="w-4 h-4 bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                    )}
                  </div>
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
                  <span className="text-2xl transition-transform group-hover:scale-110"><PixelIcon name={main.icon} className="w-6 h-6" /></span>
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
                  
                  return (
                    <div key={sIdx} className="mb-6 last:mb-0">
                      <h4 className="text-xs font-bold font-pixel text-purple-400 uppercase tracking-widest mb-3 pl-1 drop-shadow-[1px_1px_0_#000]">{sub.label}</h4>
                      <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory px-1">
                        {readyItems.map((item, iIdx) => {
                          const iconName = item.icon || 'help';
                          return (
                          <div
                            key={item.id}
                            onClick={() => handleCardClick(item.id, item.isReady)}
                            className={`shrink-0 snap-start w-36 sm:w-44 relative overflow-visible group rounded-xl p-4 sm:p-5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                              item.isReady
                                ? `bg-[#1a103c] brutal-border brutal-shadow hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0_0_25px_rgba(124,58,237,0.8)] cursor-pointer`
                                : 'bg-[#0f0c29] border-[3px] border-gray-700 cursor-not-allowed opacity-70 grayscale'
                            } flex flex-col items-center gap-3 text-center`}
                            style={{ animationDelay: `${(sIdx * 3 + iIdx) * 40}ms`, animationFillMode: 'both' }}
                          >
                            {!item.isReady && (
                              <div className="absolute top-0 right-0 bg-red-600 text-white font-pixel text-[9px] px-2 py-1 brutal-border">
                                X
                              </div>
                            )}
                            
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${item.isReady ? 'brutal-border-accent bg-[#2d1b54] shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 group-hover:rotate-3' : 'bg-gray-800'}`}>
                              <PixelIcon name={iconName} className={`w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 ${item.isReady ? 'text-cyan-400' : 'text-gray-500'}`} />
                            </div>
                            
                            <div className="w-full mt-2">
                              <h4 className={`text-sm sm:text-base font-pixel tracking-widest break-keep leading-tight ${item.isReady ? 'text-gray-200 group-hover:text-cyan-300 drop-shadow-[1px_1px_0_#000]' : 'text-gray-600'}`}>
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
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsInfoModalOpen(false)}></div>
          <div className="relative retro-panel w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-black border-2 border-slate-500 text-white font-pixel hover:bg-red-500 hover:border-white transition-colors flex items-center justify-center"
            >
              X
            </button>
            <h3 className="text-xl font-pixel text-white mb-5 flex items-center gap-2">
              <PixelIcon name="info-box" className="w-6 h-6 text-cyan-400" />
              지표 가이드
            </h3>
            
            <div className="space-y-6 text-sm text-gray-300 font-pixel tracking-wider leading-relaxed bg-black/50 p-4 border border-slate-800">
              <div>
                <h4 className="text-cyan-400 mb-2 font-bold">[ Fear & Greed ]</h4>
                <p>
                  시장의 투자 심리를 0부터 100까지 수치화한 지표입니다.<br/><br/>
                  <span className="text-red-400">0에 가까울수록 공포</span><br/>
                  <span className="text-green-400">100에 가까울수록 탐욕</span>
                </p>
              </div>
              
              <div className="h-px w-full bg-slate-800"></div>
              
              <div>
                <h4 className="text-orange-400 mb-2 font-bold">[ 펜타곤 야근 지수 ]</h4>
                <p>
                  미국 국방부에 야근이 급증하면 글로벌 지정학적 위기가 터졌다는 월스트리트 밈입니다.<br/>
                  게이지가 높을수록 시장의 공포가 극심함을 의미합니다.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsInfoModalOpen(false)}
              className="mt-6 w-full retro-button py-3 text-white font-pixel"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
