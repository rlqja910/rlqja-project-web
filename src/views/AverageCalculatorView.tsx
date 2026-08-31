import React, { useState, useEffect } from 'react';

export const AverageCalculatorView: React.FC = () => {
  const [currentAvgPrice, setCurrentAvgPrice] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<string>('');
  const [currentMarketPrice, setCurrentMarketPrice] = useState<string>('');
  const [targetAvgPrice, setTargetAvgPrice] = useState<string>('');
  
  // 기믹 상태
  const [isTimeChamber, setIsTimeChamber] = useState<boolean>(false);
  const [chamberSeconds, setChamberSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: number;
    if (isTimeChamber) {
      interval = window.setInterval(() => {
        setChamberSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setChamberSeconds(0);
    }
    return () => window.clearInterval(interval);
  }, [isTimeChamber]);

  const numCurrentAvg = parseFloat(currentAvgPrice.replace(/,/g, '')) || 0;
  const numCurrentQty = parseFloat(currentQuantity.replace(/,/g, '')) || 0;
  const numMarketPrice = parseFloat(currentMarketPrice.replace(/,/g, '')) || 0;
  const numTargetAvg = parseFloat(targetAvgPrice.replace(/,/g, '')) || 0;

  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);

  const handleSenzu = () => {
    if (!numMarketPrice) {
      alert('현재가를 입력해야 선두(본전 셋팅) 기능을 사용할 수 있습니다!');
      return;
    }
    // 현재가의 1% 수익을 탈출 평단가로 설정
    const escapePrice = Math.floor(numMarketPrice * 1.01);
    setTargetAvgPrice(formatNumber(escapePrice));
    alert('🫘 선두 섭취 완료!\n목표 평단가가 현재가(+1%) 수준으로 자동 셋팅되었습니다.\n반등장에 본전만 건지고 탈출하세요!');
  };

  const calculateResult = () => {
    if (!numCurrentAvg || !numCurrentQty || !numMarketPrice || !numTargetAvg) return null;
    
    if (numTargetAvg >= numCurrentAvg) return { error: "목표 평단가는 현재 평단가보다 낮아야 합니다." };
    if (numTargetAvg <= numMarketPrice) return { error: "목표 평단가는 현재가보다 높아야 합니다. (현재가 아래로는 평단가를 낮출 수 없음)" };

    const exactQty = (numCurrentQty * (numCurrentAvg - numTargetAvg)) / (numTargetAvg - numMarketPrice);
    const additionalQty = Math.ceil(exactQty); // 무조건 1주 단위로 사야 하므로 올림
    const requiredCapital = additionalQty * numMarketPrice;
    
    return {
      additionalQty: additionalQty,
      requiredCapital: requiredCapital
    };
  };

  const result = calculateResult();

  // 원기옥 크기 및 멘트 결정 (평단가 하락률 기준 30종 멘트 + 조급증 팩폭 6종)
  const getSpiritBombLevel = (current: number, target: number, additionalQty: number, marketPrice: number) => {
    const lossRatio = ((current - marketPrice) / current) * 100;
    // 현재가와 평단가 사이의 갭(손실폭) 중 얼마나 극복(물타기)했는지 계산 (0~100%)
    const recoveryRatio = ((current - target) / (current - marketPrice)) * 100;
    
    // 상태 변경 시마다 랜덤하게 바뀌면 깜빡거리므로, 추가 매수 수량을 시드로 사용하여 결정론적 인덱스(0~5) 선택
    const idx = Math.floor(additionalQty) % 6;

    // 조급한 물타기 (손실률 15% 미만) 팩폭
    if (lossRatio < 15) {
      const msgs = [
        "고작 이 정도 손실에 쫄아서 물을 타다니... 네놈은 하급 전사다!",
        "진정한 고수는 -30%가 넘어서야 움직이는 법! 넌 아직 멀었다.",
        "이봐, 스크래치 조금 났다고 붕대를 감을 셈이냐? 엄살 부리지 마라!",
        "지금 애매하게 물을 타면 훗날 진짜 폭락이 올 때 피눈물을 흘리게 될 거다...",
        "하급 전사 특: -10%에 호들갑 떨며 영끌함. 딱 네놈 얘기군.",
        "이 시점에 물을 타는 건 계좌를 터트리는 자폭 스위치를 누르는 거나 다름없다!"
      ];
      return { size: 120, msg: msgs[idx], color: "from-amber-500 to-orange-400" };
    }

    if (recoveryRatio < 10) {
      const msgs = [
        "고작 이 정도로 평단가를 낮췄다고 할 수 있나? 기스조차 나지 않는 헛수고다.",
        "그 정도 전투력으로는 재배맨 하나 쓰러뜨릴 수 없다.",
        "이봐, 장난하는 거냐? 평단가가 거의 제자리걸음이잖아.",
        "네 녀석의 각오는 고작 그 정도밖에 안 되는 거냐?",
        "물을 탄 게 아니라 그냥 분무기로 물을 뿌린 수준이군.",
        "이런 옹졸한 물타기라니... 내 스카우터가 고장 난 줄 알았다."
      ];
      return { size: 100, msg: msgs[idx], color: "from-blue-400 to-blue-200" };
    }
    if (recoveryRatio < 30) {
      const msgs = [
        "제법 기를 모았지만, 아직 전황을 뒤집기엔 한참 부족하다. 더 집중해라.",
        "이제야 조금 봐줄 만하군. 하지만 방심하기엔 이르다.",
        "그 정도 평단가로는 프리저 님 앞에 설 자격조차 없다.",
        "아직 멀었다! 네놈의 진짜 힘은 고작 이 정도가 아닐 텐데?",
        "물타기를 하려거든 확실하게 해라. 이래선 이도 저도 아니다.",
        "조금 깎이긴 했지만, 치명상을 입히기엔 한참 모자라다."
      ];
      return { size: 160, msg: msgs[idx], color: "from-blue-500 to-cyan-300" };
    }
    if (recoveryRatio < 60) {
      const msgs = [
        "호오, 제법 묵직한 원기옥이 완성됐군. 이 정도면 전장의 판도가 바뀔 수도 있겠어.",
        "드디어 진짜 전투가 시작되려 하는군. 평단가가 꽤 날카로워졌다.",
        "이 정도면 엘리트 전사도 인정할 만한 끈기다.",
        "꽤 훌륭한 타격이다! 이 기세를 몰아서 단숨에 빠져나가라!",
        "평단가가 제법 낮아졌어! 이제야 승산이 보이기 시작하는군.",
        "이 정도 물타기라면 녀석도 당황할 수밖에 없을 거다!"
      ];
      return { size: 240, msg: msgs[idx], color: "from-indigo-500 to-blue-400" };
    }
    if (recoveryRatio < 90) {
      const msgs = [
        "굉장한 기다... 이 정도까지 평단가를 짓누를 결단력이 있다니, 칭찬해주마!",
        "초사이어인의 벽을 넘으려는 거냐?! 엄청난 평단가 하락이다!",
        "네놈... 혹시 천재인 거냐?! 이 정도 물타기는 나조차 예상하지 못했다!",
        "완벽하다! 이대로라면 어떤 하락장도 두렵지 않을 수준이야!",
        "기가 하늘을 찌르고 있어! 네 평단가는 이제 새로운 차원으로 접어들었다!",
        "이게 바로 지구인들의 잠재력이란 말인가... 소름이 돋을 정도다!"
      ];
      return { size: 320, msg: msgs[idx], color: "from-purple-500 to-blue-500" };
    }
    
    const msgs = [
      "네놈의 한계는 도대체 어디까지냐! 전 우주를 뒤흔들 엄청난 원기옥이다!!",
      "이... 이것이 전설로만 듣던 초사이어인 갓의 물타기인가...!",
      "말도 안 돼! 스카우터가 터져버렸다! 평단가를 반토막 내버리다니!!",
      "파괴신조차 두려워할 만한 엄청난 결단력이다. 넌 이미 승리자다.",
      "이 우주에서 네놈보다 물을 잘 타는 녀석은 존재하지 않을 거다!",
      "최후의 일격이다! 이 원기옥이라면 어떤 악성 물림도 전부 흔적 없이 소멸시킬 수 있어!!"
    ];
    return { size: 500, msg: msgs[idx], color: "from-rose-500 to-purple-500" };
  };

  const bombLevel = result && !result.error ? getSpiritBombLevel(numCurrentAvg, numTargetAvg, result.additionalQty!, numMarketPrice) : { size: 80, msg: "아직 기가 모이지 않았다... 목표를 입력해라.", color: "from-slate-700 to-slate-600" };

  const handleNumberInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setter(val ? formatNumber(parseInt(val, 10)) : '');
  };

  const formatChamberTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (isTimeChamber) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="max-w-xl text-center space-y-12">
          <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-4xl">⏳</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">정신과 시간의 방</h2>
            <p className="text-xl text-slate-500 break-keep font-medium leading-relaxed">
              이곳에서의 하루는 바깥 세상의 1년과 같다.<br/>
              물탈 돈이 없다면, 본전이 올 때까지 명상이나 해라.
            </p>
          </div>
          
          <div className="text-6xl sm:text-8xl font-black text-slate-300 tracking-tighter">
            {formatChamberTime(chamberSeconds)}
          </div>
          
          <button 
            onClick={() => setIsTimeChamber(false)}
            className="mt-12 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-full transition-colors border border-slate-300"
          >
            포기하고 바깥으로 나가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="text-center space-y-4 mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight drop-shadow-sm relative z-10">
          🔮 원기옥 물타기 계산기
        </h2>
        <p className="text-slate-400 text-[13px] sm:text-sm font-medium relative z-10">네 평단가를 구출하기 위해 우주의 기(현금)를 모아라.</p>
      </div>

      <div className="relative h-64 flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 mb-8">
        <div 
          className={`absolute rounded-full bg-gradient-to-br ${bombLevel.color} blur-[2px] transition-all duration-1000 ease-out flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]`}
          style={{ 
            width: `${bombLevel.size}px`, 
            height: `${bombLevel.size}px`,
            opacity: result && !result.error ? 0.9 : 0.3 
          }}
        >
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 px-4 text-center z-10">
          <div className="inline-block bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700 shadow-xl">
            <p className="text-slate-200 font-bold text-sm sm:text-base break-keep">
              "{bombLevel.msg}"
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">현재 평단가 (₩)</label>
            <input 
              type="text" 
              value={currentAvgPrice}
              onChange={handleNumberInput(setCurrentAvgPrice)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="예: 85,000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">현재 보유 수량 (주)</label>
            <input 
              type="text" 
              value={currentQuantity}
              onChange={handleNumberInput(setCurrentQuantity)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="예: 100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">현재가 (₩)</label>
            <input 
              type="text" 
              value={currentMarketPrice}
              onChange={handleNumberInput(setCurrentMarketPrice)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              placeholder="예: 55,000"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-cyan-400">목표 평단가 (₩)</label>
              <button onClick={handleSenzu} className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-md hover:bg-green-500/30 transition-colors flex items-center gap-1">
                <span>🫘</span> 본전 탈출 (선두)
              </button>
            </div>
            <input 
              type="text" 
              value={targetAvgPrice}
              onChange={handleNumberInput(setTargetAvgPrice)}
              className="w-full bg-slate-800 border border-cyan-900 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
              placeholder="원하는 평단가 입력"
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 relative z-10">
          {result?.error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
              <p className="text-rose-400 font-bold">{result.error}</p>
            </div>
          ) : result ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-lg font-bold text-white mb-6">원기옥 투척 결과</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-slate-700 pb-4">
                  <span className="text-slate-400 font-medium">추가 매수 필요 수량</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-white">{formatNumber(result.additionalQty!)}</span>
                    <span className="text-slate-500 ml-2">주</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <span className="text-cyan-400 font-bold">총 필요 자금 (원기옥)</span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-sm">
                      {formatNumber(result.requiredCapital!)}
                    </span>
                    <span className="text-cyan-600 font-bold ml-2">원</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-8 text-slate-500">
               모든 숫자를 입력하면 필요한 원기옥 크기가 계산됩니다.
             </div>
          )}
        </div>
        
        {/* 존버 모드 트리거 (강조) */}
        <div className="mt-6 pt-4 text-center relative z-10">
          <button 
            onClick={() => setIsTimeChamber(true)} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm sm:text-base font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-500 shadow-sm"
          >
            <span>💸</span> 물탈 돈조차 없다면? (강제 존버)
          </button>
        </div>
      </div>
    </div>
  );
};
