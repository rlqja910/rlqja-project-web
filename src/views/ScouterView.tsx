import React, { useState, useEffect } from 'react';

interface ScouterData {
  success?: boolean;
  stockName?: string;
  ticker?: string;
  combatPower?: number;
  tier?: string;
  comment?: string;
  error?: string;
  jobId?: string;
  status?: string;
  currentPrice?: number;
  yearHigh?: number;
  yearLow?: number;
  goodNews?: string;
  badNews?: string;
}

interface DBCharacter {
  id: number;
  name: string;
  ki: string;
  image: string;
  race: string;
  affiliation: string;
}

export const ScouterView: React.FC = () => {
  const [stockName, setStockName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScouterData | null>(null);
  const [scannedPower, setScannedPower] = useState(0);
  const [dbCharacters, setDbCharacters] = useState<DBCharacter[]>([]);
  const [matchedCharacter, setMatchedCharacter] = useState<DBCharacter | null>(null);

  // 드래곤볼 API ki 데이터 공백을 채우는 보완 캐릭터 목록 (전 전투력 구간 커버)
  const EXTRA_CHARS: DBCharacter[] = [
    // ── 전투력 1~9 ──────────────────────────────────
    { id: 9001, name: "Farmer (농부)", ki: "5", image: "https://dragonball-api.com/characters/Mr_Satan_DBSuper.webp", race: "Human", affiliation: "Neutral" },
    // ── 전투력 10~99 ─────────────────────────────────
    { id: 9002, name: "Ox-King 마을 주민", ki: "50", image: "https://dragonball-api.com/characters/bulma.webp", race: "Human", affiliation: "Neutral" },
    // ── 전투력 100~499 ───────────────────────────────
    { id: 9003, name: "Mr. Satan (젊은 시절)", ki: "300", image: "https://dragonball-api.com/characters/Mr_Satan_DBSuper.webp", race: "Human", affiliation: "Z Fighter" },
    // ── 전투력 500~999 ───────────────────────────────
    { id: 9004, name: "Yamcha (초기)", ki: "700", image: "https://dragonball-api.com/characters/Final_Yamcha.webp", race: "Human", affiliation: "Z Fighter" },
    // ── 전투력 1,000~2,999 ──────────────────────────
    { id: 9005, name: "Raditz (어린 시절)", ki: "1,200", image: "https://dragonball-api.com/characters/Raditz_artwork_Dokkan.webp", race: "Saiyan", affiliation: "Villain" },
    // ── 전투력 3,000~5,999 ──────────────────────────
    { id: 9006, name: "Kaio-sama 수련생", ki: "4,000", image: "https://dragonball-api.com/characters/Kaio_del_Norte.webp", race: "Kai", affiliation: "Z Fighter" },
    // ── 전투력 6,000~9,999 ──────────────────────────
    { id: 9007, name: "Guldo (기뉴 최약체)", ki: "7,000", image: "https://dragonball-api.com/characters/ginyu.webp", race: "Mutant", affiliation: "Villain" },
    // ── 전투력 10,000~17,999 ────────────────────────
    { id: 9008, name: "Cui", ki: "15,000", image: "https://dragonball-api.com/characters/dodoria.webp", race: "Alien", affiliation: "Villain" },
    // ── 전투력 18,000~24,999 ────────────────────────
    { id: 9009, name: "Appule", ki: "20,000", image: "https://dragonball-api.com/characters/zarbon.webp", race: "Alien", affiliation: "Villain" },
    // ── 전투력 25,000~41,999 ────────────────────────
    { id: 9010, name: "Recoome", ki: "30,000", image: "https://dragonball-api.com/characters/ginyu.webp", race: "Mutant", affiliation: "Villain" },
    // ── 전투력 42,000~99,999 ────────────────────────
    { id: 9011, name: "Burter & Jeice", ki: "65,000", image: "https://dragonball-api.com/characters/ginyu.webp", race: "Mutant", affiliation: "Villain" },
    // ── 전투력 100,000~299,999 ──────────────────────
    { id: 9012, name: "Turles", ki: "200,000", image: "https://dragonball-api.com/characters/Bardock_Artwork.webp", race: "Saiyan", affiliation: "Villain" },
    // ── 전투력 300,000~449,999 ──────────────────────
    { id: 9013, name: "Lord Slug", ki: "350,000", image: "https://dragonball-api.com/characters/picolo_normal.webp", race: "Namekian", affiliation: "Villain" },
    // ── 전투력 450,000~529,999 ──────────────────────
    { id: 9014, name: "Bardock (최종)", ki: "450,000", image: "https://dragonball-api.com/characters/Bardock_Artwork.webp", race: "Saiyan", affiliation: "Villain" },
    // ── 전투력 530,000~999,999 ──────────────────────
    { id: 9015, name: "Frieza (최종형태 100%)", ki: "800,000", image: "https://dragonball-api.com/characters/Freezer.webp", race: "Frieza Race", affiliation: "Villain" },
    // ── 전투력 1,000,000~1,979,999 ──────────────────
    { id: 9016, name: "Krillin (나메크)", ki: "1,500,000", image: "https://dragonball-api.com/characters/Krilin_Universo7.webp", race: "Human", affiliation: "Z Fighter" },
    // ── 전투력 1,980,000~2,399,999 ──────────────────
    { id: 9017, name: "Piccolo (가중훈련)", ki: "2,100,000", image: "https://dragonball-api.com/characters/picolo_normal.webp", race: "Namekian", affiliation: "Z Fighter" },
    // ── 전투력 2,400,000~2,999,999 ──────────────────
    { id: 9018, name: "Tenshinhan (기공포 전체)", ki: "2,600,000", image: "https://dragonball-api.com/characters/Tenshinhan_Universo7.webp", race: "Human", affiliation: "Z Fighter" },
    // ── 전투력 3,000,000~5,999,999 ──────────────────
    { id: 9019, name: "SSJ Goku (나메크 첫 변신)", ki: "4,500,000", image: "https://dragonball-api.com/characters/goku_normal.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 6,000,000~9,999,999 ──────────────────
    { id: 9020, name: "Piccolo (셀 편, 흡수 전)", ki: "7,000,000", image: "https://dragonball-api.com/characters/picolo_normal.webp", race: "Namekian", affiliation: "Z Fighter" },
    // ── 전투력 10,000,000~14,999,999 ────────────────
    { id: 9021, name: "SSJ2 Gohan (vs 셀)", ki: "12,000,000", image: "https://dragonball-api.com/characters/gohan.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 15,000,000~21,999,999 ────────────────
    { id: 9022, name: "Future Trunks (SSJ)", ki: "18,000,000", image: "https://dragonball-api.com/characters/Trunks_Buu_Artwork.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 22,000,000~29,999,999 ────────────────
    { id: 9023, name: "Semi-Perfect Cell", ki: "25,000,000", image: "https://dragonball-api.com/characters/celula.webp", race: "Android", affiliation: "Villain" },
    // ── 전투력 30,000,000~37,999,999 ────────────────
    { id: 9024, name: "Perfect Cell (완전체)", ki: "33,000,000", image: "https://dragonball-api.com/characters/celula.webp", race: "Android", affiliation: "Villain" },
    // ── 전투력 38,000,000~44,999,999 ────────────────
    { id: 9025, name: "SSJ2 Gohan (마인 부우 전)", ki: "40,000,000", image: "https://dragonball-api.com/characters/gohan.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 45,000,000~49,999,999 ────────────────
    { id: 9026, name: "Gohan (Ultimate)", ki: "47,000,000", image: "https://dragonball-api.com/characters/gohan.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 50,000,000~53,999,999 ────────────────
    { id: 9027, name: "Majin Vegeta", ki: "52,000,000", image: "https://dragonball-api.com/characters/vegeta_normal.webp", race: "Saiyan", affiliation: "Villain" },
    // ── 전투력 54,000,000~57,999,999 ────────────────
    { id: 9028, name: "Vegeta (SSJ 마인)", ki: "56,000,000", image: "https://dragonball-api.com/characters/vegeta_normal.webp", race: "Saiyan", affiliation: "Villain" },
    // ── 전투력 58,000,000~64,999,999 ────────────────
    { id: 9029, name: "Gotenks (SSJ3 퓨전)", ki: "62,000,000", image: "https://dragonball-api.com/characters/Gotenks_Artwork.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 65,000,000~69,999,999 ────────────────
    { id: 9030, name: "Vegito (SSJ 퓨전)", ki: "67,000,000", image: "https://dragonball-api.com/transformaciones/Vegetto.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 70,000,000~74,999,999 ────────────────
    { id: 9031, name: "SSJ3 Goku", ki: "72,000,000", image: "https://dragonball-api.com/characters/goku_normal.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 75,000,000~79,999,999 ────────────────
    { id: 9032, name: "Gogeta (SSJ)", ki: "77,000,000", image: "https://dragonball-api.com/transformaciones/gogeta.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 80,000,000~84,999,999 ────────────────
    { id: 9033, name: "Android 17 (Tournament of Power)", ki: "82,000,000", image: "https://dragonball-api.com/characters/17_Artwork.webp", race: "Android", affiliation: "Z Fighter" },
    // ── 전투력 85,000,000~89,999,999 ────────────────
    { id: 9034, name: "Toppo (God of Destruction mode)", ki: "87,000,000", image: "https://dragonball-api.com/characters/Toppo.webp", race: "Alien", affiliation: "Pride Trooper" },
    // ── 전투력 90,000,000~94,999,999 ────────────────
    { id: 9035, name: "Jiren (Full Power)", ki: "93,000,000", image: "https://dragonball-api.com/characters/Jiren.webp", race: "Alien", affiliation: "Pride Trooper" },
    // ── 전투력 95,000,000~99,999,999 ────────────────
    { id: 9036, name: "Vegito Blue (SSB)", ki: "97,000,000", image: "https://dragonball-api.com/transformaciones/Vegetto.webp", race: "Saiyan", affiliation: "Z Fighter" },
    // ── 전투력 100,000,000 ──────────────────────────
    { id: 9037, name: "Beerus (파괴신)", ki: "100,000,000", image: "https://dragonball-api.com/characters/Beerus_DBS_Broly_Artwork.webp", race: "God", affiliation: "God of Destruction" },
    { id: 9038, name: "Whis (천사)", ki: "100,000,000", image: "https://dragonball-api.com/characters/Whis_DBS_Broly_Artwork.webp", race: "Angel", affiliation: "Angel" },
    { id: 9039, name: "Zeno (전왕)", ki: "100,000,000", image: "https://dragonball-api.com/characters/Zeno_Artwork.webp", race: "God", affiliation: "Omni-King" },
    { id: 9040, name: "Grand Priest (대신관)", ki: "100,000,000", image: "https://dragonball-api.com/characters/Grand priest.webp", race: "Angel", affiliation: "Angel" },
    { id: 9041, name: "Gogeta Blue", ki: "100,000,000", image: "https://dragonball-api.com/transformaciones/gogeta.webp", race: "Saiyan", affiliation: "Z Fighter" },
    { id: 9042, name: "Broly (DBS)", ki: "100,000,000", image: "https://dragonball-api.com/transformaciones/Broly_DBS_Base.webp", race: "Saiyan", affiliation: "Villain" },
  ];



  useEffect(() => {
    fetch('https://dragonball-api.com/api/characters?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          // Merge API characters with our supplementary list to cover all power ranges
          const merged = [...data.items, ...EXTRA_CHARS];
          setDbCharacters(merged);
        } else {
          setDbCharacters(EXTRA_CHARS);
        }
      })
      .catch(err => {
        console.error('Failed to load DB characters', err);
        setDbCharacters(EXTRA_CHARS);
      });
  }, []);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockName.trim()) return;

    setIsScanning(true);
    setResult(null);
    setScannedPower(0);
    setMatchedCharacter(null);

    // 로그 전송 (검색 통계용)
    const visitorId = localStorage.getItem('korekore_visitor_id');
    fetch('/api/logs/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'SEARCH', endpoint: stockName, visitorId }),
    }).catch(console.error);

    try {
      const response = await fetch('/api/scouter?stockName=' + encodeURIComponent(stockName));
      const initData: ScouterData = await response.json();

      if (initData.jobId) {
        pollResult(initData.jobId);
      } else if (initData.success) {
        finishScan(initData);
      } else {
        alert(initData.error || "분석 실패!");
        setIsScanning(false);
      }
    } catch (error) {
      alert("서버 통신 오류");
      setIsScanning(false);
    }
  };

  const pollResult = async (jobId: string) => {
    try {
      const response = await fetch('/api/scouter/result?jobId=' + jobId);
      const data: ScouterData = await response.json();

      if (data.status === 'done' && data.success) {
        finishScan(data);
      } else if (data.status === 'error' || data.success === false) {
        alert(data.error || "분석 실패!");
        setIsScanning(false);
      } else {
        setTimeout(() => pollResult(jobId), 2000);
      }
    } catch (error) {
      alert("폴링 통신 오류");
      setIsScanning(false);
    }
  };

  const finishScan = (data: ScouterData) => {
    setResult(data);
    if (data.stockName) {
      setStockName(data.stockName); // Update input field to real name
    }
    const power = data.combatPower || 0;

    // Match DragonBall Character
    if (dbCharacters.length > 0) {
      const parsedChars = dbCharacters.map(c => {
        let kiStr = c.ki ? c.ki.toLowerCase().replace(/[,.]/g, '') : 'unknown';
        let multiplier = 1;
        if (kiStr.includes('billion')) { multiplier = 1000000000; kiStr = kiStr.replace('billion', '').trim(); }
        else if (kiStr.includes('trillion')) { multiplier = 1000000000000; kiStr = kiStr.replace('trillion', '').trim(); }
        else if (kiStr.includes('quadrillion')) { multiplier = 1000000000000000; kiStr = kiStr.replace('quadrillion', '').trim(); }
        else if (kiStr.includes('quintillion')) { multiplier = 1000000000000000000; kiStr = kiStr.replace('quintillion', '').trim(); }
        else if (kiStr.includes('septillion')) { multiplier = 1e24; kiStr = kiStr.replace('septillion', '').trim(); }
        let kiNum = parseFloat(kiStr) * multiplier;
        const hasRealKi = !isNaN(kiNum);
        if (!hasRealKi) kiNum = -1; // mark unknown
        return { ...c, kiNum, hasRealKi };
      });
      // Only use characters with known ki values for matching
      const knownChars = parsedChars.filter(c => c.hasRealKi).sort((a, b) => a.kiNum - b.kiNum);

      // Log-scale minDiff: find closest character by log-scale distance
      const logPower = Math.log10(Math.max(power, 1));
      let matched = knownChars[0] || parsedChars[0];
      let minDiff = Infinity;
      for (let i = 0; i < knownChars.length; i++) {
        const logKi = Math.log10(Math.max(knownChars[i].kiNum, 1));
        const diff = Math.abs(logKi - logPower);
        if (diff < minDiff) {
          minDiff = diff;
          matched = knownChars[i];
        }
      }
      setMatchedCharacter(matched);
    }

    animatePower(power);
    setIsScanning(false);
  };

  const animatePower = (targetPower: number) => {
    let current = 0;
    const increment = Math.ceil(targetPower / 40);
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetPower) {
        setScannedPower(targetPower);
        clearInterval(interval);
      } else {
        setScannedPower(current);
      }
    }, 30);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-black mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">🔥 주식 전투력 측정기</span>
        </h2>
        <p className="text-gray-400 text-lg">종목명(한글/영문)을 입력하면 AI 스카우터가 팩폭과 함께 매수 매력도를 측정해 드립니다.</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-2xl mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="예: 삼성전자, 테슬라"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            disabled={isScanning}
          />
          <button
            type="submit"
            disabled={isScanning || !stockName.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-4 sm:py-0 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
          >
            {isScanning ? '스캔 중...' : '측정하기'}
          </button>
        </form>
      </div>

      {isScanning && (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-l-fuchsia-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center"><img src="https://dragonball-api.com/characters/goku_normal.webp" alt="Goku" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(249,115,22,1)]" /></div>
          </div>
          <div className="text-cyan-400 font-mono text-xl animate-pulse font-bold">TARGET LOCKED. SCANNING...</div>
          <div className="text-gray-500 text-sm mt-2">Yahoo Finance API 연동 및 AI 분석 중...</div>
        </div>
      )}

      {result && !isScanning && (
        <div className="animate-[fade-in-up_0.5s_ease-out] max-w-2xl mx-auto w-full">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-10 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-red-500"></div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-cyan-400 font-mono text-sm mb-1 tracking-widest">TARGET IDENTIFIED</div>
                <h3 className="text-2xl md:text-3xl font-black text-white">{result.stockName} <span className="text-gray-500 text-xl font-normal ml-2">{result.ticker}</span></h3>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs mb-1 font-bold">전투 등급</div>
                <div className="px-4 py-1.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-2xl text-sm font-bold border border-fuchsia-500/30 whitespace-normal break-keep leading-snug inline-block text-right mt-1">{result.tier}</div>
              </div>
            </div>

            {result.currentPrice !== undefined && result.currentPrice > 0 && (
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                <div className="bg-slate-800/80 rounded-xl p-3 md:p-4 text-center border border-slate-700">
                  <div className="text-xs text-gray-400 mb-1 font-bold">현재가</div>
                  <div className="font-bold text-white text-sm md:text-base">{result.ticker?.endsWith(".KS") || result.ticker?.endsWith(".KQ") ? "₩" + result.currentPrice.toLocaleString(undefined, {maximumFractionDigits: 0}) : "$" + result.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-3 md:p-4 text-center border border-slate-700">
                  <div className="text-xs text-gray-400 mb-1 font-bold">52주 최고</div>
                  <div className="font-bold text-green-400 text-sm md:text-base">{result.ticker?.endsWith(".KS") || result.ticker?.endsWith(".KQ") ? "₩" + result.yearHigh?.toLocaleString(undefined, {maximumFractionDigits: 0}) : "$" + result.yearHigh?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-3 md:p-4 text-center border border-slate-700">
                  <div className="text-xs text-gray-400 mb-1 font-bold">52주 최저</div>
                  <div className="font-bold text-red-400 text-sm md:text-base">{result.ticker?.endsWith(".KS") || result.ticker?.endsWith(".KQ") ? "₩" + result.yearLow?.toLocaleString(undefined, {maximumFractionDigits: 0}) : "$" + result.yearLow?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-8 mb-2 relative">
              <div className="text-cyan-400/80 mb-2 tracking-[0.3em] text-sm font-black">POWER LEVEL</div>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                {scannedPower.toLocaleString()}
              </div>
            </div>

            {/* 캐릭터 렌더링 영역 (Power Level 바로 아래) */}
            <div className="flex flex-col items-center justify-center mb-10 pb-8 border-b border-slate-700/50">
              {matchedCharacter ? (
                <div className="z-10 flex flex-col items-center">
                  <div className="text-orange-400 font-bold tracking-widest text-xs mb-6 border border-orange-500/50 rounded-full px-4 py-1 inline-block bg-orange-500/10">
                    매칭 캐릭터
                  </div>
                  <img
                    src={matchedCharacter.image}
                    alt={matchedCharacter.name}
                    className="h-56 md:h-72 object-contain drop-shadow-[0_10px_20px_rgba(249,115,22,0.4)] transition-transform"
                  />
                  <h4 className="text-4xl font-black text-white mt-6 drop-shadow-md">{matchedCharacter.name}</h4>
                  <div className="flex gap-2 justify-center mt-4">
                    <span className="bg-slate-800 text-gray-300 px-3 py-1 rounded text-xs font-bold border border-slate-700">{matchedCharacter.race}</span>
                    <span className="bg-slate-800 text-orange-400 px-3 py-1 rounded text-xs font-bold border border-slate-700">전투력: {matchedCharacter.ki}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="text-6xl mb-4 opacity-50">🐉</div>
                  <p>캐릭터 매칭 중...</p>
                </div>
              )}
            </div>

            {result.goodNews && result.badNews && result.goodNews !== "-" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                  <div className="text-green-400 font-bold mb-3 flex items-center gap-2 text-lg"><span>📈</span> 요약 호재</div>
                  <p className="text-gray-300 text-sm break-keep leading-relaxed">{result.goodNews}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                  <div className="text-red-400 font-bold mb-3 flex items-center gap-2 text-lg"><span>📉</span> 요약 악재</div>
                  <p className="text-gray-300 text-sm break-keep leading-relaxed">{result.badNews}</p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 text-4xl opacity-10">💬</div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <div className="text-red-400 font-black text-lg">스카우터 AI 팩폭 코멘트</div>
              </div>
              <p className="text-gray-300 leading-relaxed font-medium whitespace-pre-wrap text-base md:text-lg break-keep">{result.comment}</p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
