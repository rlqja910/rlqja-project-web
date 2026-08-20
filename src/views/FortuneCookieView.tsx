import React, { useState } from 'react';
import { FORTUNES } from '../data/fortunes';

export const FortuneCookieView: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'smashing' | 'cracked'>('idle');
  const [fortuneText, setFortuneText] = useState('');

  const handleSmash = () => {
    if (step !== 'idle') return;

    const todayStr = new Date().toLocaleDateString('ko-KR');
    const savedFortune = localStorage.getItem('korekore_fortune_text');
    const savedDate = localStorage.getItem('korekore_fortune_date');

    let fortuneToDisplay = '';
    if (savedDate === todayStr && savedFortune) {
      fortuneToDisplay = savedFortune;
    } else {
      fortuneToDisplay = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      localStorage.setItem('korekore_fortune_text', fortuneToDisplay);
      localStorage.setItem('korekore_fortune_date', todayStr);
    }

    setFortuneText(fortuneToDisplay);
    setStep('smashing');

    setTimeout(() => {
      setStep('cracked');
    }, 800);
  };

  const handleReset = () => {
    setStep('idle');
  };

  return (
    <section className={`space-y-6 animate-in fade-in duration-500 py-10 relative max-w-4xl mx-auto flex flex-col items-center min-h-[70vh] justify-center ${step === 'cracked' ? 'animate-screen-shake' : ''}`}>
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          오늘의 주식 포춘쿠키 🥠
        </h2>
        <p className="text-slate-400">
          망치로 쿠키를 부수고, 오늘 당신의 계좌 운세를 확인하세요!
        </p>
      </div>

      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        
        {/* Flash Effect */}
        {step === 'cracked' && (
          <div className="absolute inset-0 z-40 bg-white rounded-full animate-flash pointer-events-none mix-blend-overlay"></div>
        )}

        {/* Particles */}
        {step === 'cracked' && (
          <>
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute z-30 w-4 h-4 bg-yellow-600 rounded-sm particle pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  '--tx': `${(Math.random() - 0.5) * 400}px`,
                  '--ty': `${(Math.random() - 0.5) * 400}px`,
                  '--rot': `${(Math.random() - 0.5) * 720}deg`,
                  backgroundColor: Math.random() > 0.5 ? '#d97706' : '#b45309'
                } as React.CSSProperties}
              ></div>
            ))}
          </>
        )}
        
        {/* Paper Fortune */}
        {step === 'cracked' && (
          <div className="absolute z-10 w-4/5 max-w-sm aspect-video bg-[#fdf6e3] shadow-2xl rounded-sm p-6 flex items-center justify-center animate-paper-reveal border-2 border-[#d4c4a8]">
            <p className="text-3xl sm:text-4xl text-slate-800 text-center font-pen leading-relaxed break-keep drop-shadow-sm">
              {fortuneText}
            </p>
          </div>
        )}

        {/* Hammer */}
        {step !== 'cracked' && (
          <div 
            className={`absolute z-30 text-[100px] sm:text-[150px] top-[-50px] right-[-30px] transition-transform origin-bottom-left ${
              step === 'smashing' ? 'animate-hammer-extreme' : 'translate-x-10 -translate-y-10 rotate-12 opacity-80 cursor-pointer hover:scale-110 hover:opacity-100'
            }`}
            onClick={handleSmash}
          >
            🔨
          </div>
        )}

        {/* Fortune Cookie Base */}
        <div 
          className={`relative z-20 text-[150px] sm:text-[200px] cursor-pointer drop-shadow-2xl transition-all select-none ${
            step === 'idle' ? 'hover:scale-110 hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]' : ''
          }`}
          onClick={handleSmash}
        >
          {/* Left Half */}
          <div className={`absolute top-0 left-0 w-1/2 overflow-hidden ${
            step === 'smashing' ? 'animate-shake' : ''
          } ${
            step === 'cracked' ? 'animate-explode-left' : ''
          }`}>
            <div className="w-[200%]">🥠</div>
          </div>
          
          {/* Right Half */}
          <div className={`absolute top-0 right-0 w-1/2 overflow-hidden ${
            step === 'smashing' ? 'animate-shake' : ''
          } ${
            step === 'cracked' ? 'animate-explode-right' : ''
          }`}>
            <div className="w-[200%] -translate-x-1/2">🥠</div>
          </div>

          {/* Invisible full cookie for layout sizing */}
          <div className="opacity-0">🥠</div>
        </div>

      </div>

      {step === 'cracked' && (
        <div className="mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500 fill-mode-both">
          <button 
            onClick={handleReset}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            다시 부수기 🔨
          </button>
          <p className="mt-4 text-xs font-medium text-slate-500">
            * 오늘의 운세는 하루에 한 번만 바뀝니다. (내일 다시 오세요!)
          </p>
        </div>
      )}

      {/* Backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-[800px] h-64 bg-orange-500/10 rounded-[100%] blur-3xl pointer-events-none -z-10"></div>
    </section>
  );
};
