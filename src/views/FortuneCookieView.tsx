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
    }, 1400); // 1.4s charge time before crack
  };

  const handleReset = () => {
    setStep('idle');
  };

  return (
    <section className={`space-y-6 animate-in fade-in duration-700 py-10 relative max-w-4xl mx-auto flex flex-col items-center min-h-[70vh] justify-center`}>
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          운명의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">골든 포춘쿠키</span> ✨
        </h2>
        <p className="text-slate-400 font-medium">
          영험한 쿠키를 터치하여 오늘의 투자 운세를 확인하세요.
        </p>
      </div>

      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        
        {/* Soft Golden Flash Explosion */}
        {step === 'cracked' && (
          <div className="absolute inset-0 z-50 bg-yellow-300/30 rounded-full animate-flash pointer-events-none mix-blend-screen"></div>
        )}

        {/* Explosion Particles */}
        {step === 'cracked' && (
          <>
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="absolute z-30 w-3 h-3 rounded-full particle pointer-events-none shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                style={{
                  left: '50%',
                  top: '50%',
                  '--tx': `${(Math.random() - 0.5) * 600}px`,
                  '--ty': `${(Math.random() - 0.5) * 600}px`,
                  '--rot': `${(Math.random() - 0.5) * 720}deg`,
                  backgroundColor: Math.random() > 0.5 ? '#fef08a' : '#eab308'
                } as React.CSSProperties}
              ></div>
            ))}
          </>
        )}
        
        {/* Paper Fortune (Result) */}
        {step === 'cracked' && (
          <div className="absolute z-20 w-[90%] max-w-sm aspect-video bg-gradient-to-br from-[#fdf6e3] to-[#eaddbc] shadow-2xl rounded-sm p-8 flex items-center justify-center animate-paper-reveal border border-[#d4c4a8]">
            <p className="text-3xl sm:text-[32px] text-slate-800 text-center font-pen leading-relaxed break-keep drop-shadow-sm px-2">
              {fortuneText}
            </p>
          </div>
        )}

        {/* Premium Fortune Cookie Image */}
        {step !== 'cracked' && (
          <div 
            className={`relative z-30 w-64 h-64 sm:w-80 sm:h-80 cursor-pointer transition-all select-none rounded-full overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] ${
              step === 'idle' ? 'animate-cookie-float hover:scale-105 hover:shadow-[0_0_80px_rgba(34,211,238,0.4)]' : ''
            } ${
              step === 'smashing' ? 'animate-cookie-charge brightness-150 saturate-200' : ''
            }`}
            onClick={handleSmash}
          >
            <img 
              src="/fortune-cookie.jpg" 
              alt="Premium Golden Fortune Cookie" 
              className="w-full h-full object-cover mix-blend-lighten"
            />
            {/* Inner glow over image */}
            <div className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${step === 'smashing' ? 'bg-cyan-400/40 animate-pulse' : 'bg-transparent'}`}></div>
          </div>
        )}

      </div>

      {step === 'cracked' && (
        <div className="mt-16 flex flex-col items-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-700 fill-mode-both">
          <button 
            onClick={handleReset}
            className="px-10 py-3.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-cyan-400 font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:scale-105 active:scale-95 border border-slate-600"
          >
            운명의 시간 다시 돌리기 ⏳
          </button>
          <p className="mt-4 text-[13px] font-medium text-slate-500">
            * 멘트는 하루 한 번만 바뀝니다. 같은 메시지가 나오더라도 당신의 운명입니다.
          </p>
        </div>
      )}

      {/* Backdrop Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-[800px] h-[800px] bg-gradient-to-tr from-cyan-900/20 to-purple-900/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </section>
  );
};
