import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  date: string;
  actualPct: number;
  arithmeticPct: number;
  price: number;
  exchangeRate?: number;
}

interface CalcResult {
  success: boolean;
  ticker?: string;
  isUsStock?: boolean;
  currency?: string;
  actualReturnPct?: number;
  arithmeticReturnPct?: number;
  compoundEffectPct?: number;
  actualAmount?: number;
  arithmeticAmount?: number;
  compoundDiffAmount?: number;
  fxImpactPct?: number;
  fxImpactAmount?: number;
  initialFx?: number;
  currentFx?: number;
  initialPrice?: number;
  currentPrice?: number;
  chartData?: ChartData[];
  error?: string;
}

export function CompoundCalcView() {
  const [ticker, setTicker] = useState('SOXL');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [principal, setPrincipal] = useState('10000000');
  const [avgPrice, setAvgPrice] = useState('');
  const [currency, setCurrency] = useState<'KRW'|'USD'>('KRW');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  const MEMES = [
    "https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif",
    "https://media.giphy.com/media/JtBZm3Getg3dqxEXLU/giphy.gif",
    "https://media.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.gif",
    "https://media.giphy.com/media/11ISwbgCxEzMyY/giphy.gif",
    "https://media.giphy.com/media/3oriO5t2QB4bbOoGzu/giphy.gif",
    "https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif",
    "https://media.giphy.com/media/QMHoU66sBXqqLqYvGO/giphy.gif",
    "https://media.giphy.com/media/xT5LMO3LOn4BPHltf2/giphy.gif",
    "https://media.giphy.com/media/6Q3M4BIK0lX44/giphy.gif",
    "https://media.giphy.com/media/z9AUvhAEiXOqA/giphy.gif",
    "https://media.giphy.com/media/V8PO3o4IIPgDPK2DsL/giphy.gif"
  ];
  
  // 랜덤 짤 노출 (상태로 관리해서 렌더링 시마다 바뀌지 않게 고정)
  const [todayMeme] = useState(() => MEMES[Math.floor(Math.random() * MEMES.length)]);

  const formatMoney = (val: number, cur: string = 'KRW') => {
    if (cur === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    return new Intl.NumberFormat('ko-KR').format(Math.round(val)) + '원';
  };

  const formatNumberInput = (val: string) => {
    const numeric = val.replace(/[^0-9.]/g, '');
    if (!numeric) return '';
    const parts = numeric.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const calculate = async () => {
    if (!ticker || !startDate || !principal) {
      alert('종목, 매수일, 투자원금을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/compound/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          startDate,
          principal: parseFloat(principal),
          avgPrice: avgPrice ? parseFloat(avgPrice) : null,
          currency,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ success: false, error: '서버 통신 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500 pt-4">
      <div className="text-center space-y-4 mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 tracking-tight drop-shadow-sm relative z-10 break-keep">
          🎢 야수의 심장 계좌 엑스레이
        </h1>
        <p className="text-slate-400 text-[13px] sm:text-sm font-medium relative z-10">
          내 계좌가 얼마나 녹아내렸을까? 레버리지 롤러코스터 탑승 시뮬레이터 🐯🔥
        </p>
      </div>

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <img src={todayMeme} alt="meme" className="h-32 sm:h-48 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-600/50 object-cover" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">종목명 또는 티커</label>
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="예: SOXL, 삼성전자"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">매수일자 (시작일)</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">입력 통화 (KRW/USD)</label>
            <div className="flex bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              <button 
                className={`flex-1 py-3 text-sm font-bold transition-colors ${currency === 'KRW' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={() => setCurrency('KRW')}
              >
                KRW (원)
              </button>
              <button 
                className={`flex-1 py-3 text-sm font-bold transition-colors ${currency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                onClick={() => setCurrency('USD')}
              >
                USD (달러)
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">투자 원금 ({currency})</label>
            <input 
              type="text" 
              inputMode="decimal"
              value={formatNumberInput(principal)}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder={currency === 'KRW' ? "10,000,000" : "10,000"}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              매수 평단가 <span className="text-slate-500 font-normal">(선택항목)</span>
            </label>
            <input 
              type="text"
              inputMode="decimal" 
              value={formatNumberInput(avgPrice)}
              onChange={(e) => setAvgPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="비워두면 매수일 종가 기준"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <button 
          onClick={calculate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed break-keep"
        >
          {isLoading ? '계좌 스캔 중... ⏳' : '내 계좌 엑스레이 찍기 💥'}
        </button>
      </div>

      {result && result.success && result.chartData && (
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 sm:p-8 animate-slide-up space-y-8 shadow-2xl relative overflow-hidden mt-8">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[100px] rounded-full pointer-events-none opacity-20 ${(result.compoundEffectPct || 0) < 0 ? 'bg-red-500' : 'bg-cyan-500'}`}></div>

          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold text-white mb-1">
              <span className="text-cyan-400">{result.ticker}</span> 수익률 분석
            </h2>
            <p className="text-slate-400 text-sm mb-4">({startDate} ~ 현재)</p>

            {result.initialPrice !== undefined && result.currentPrice !== undefined && (
              <div className="flex justify-center gap-4 sm:gap-6 mb-6">
                <div className="bg-slate-800/40 rounded-xl px-4 sm:px-6 py-3 border border-slate-700/50 flex flex-col items-center">
                  <div className="text-slate-400 text-xs font-bold mb-1">매수 주가</div>
                  <div className="text-lg sm:text-xl font-black text-slate-200">
                    {result.isUsStock ? `$${result.initialPrice.toFixed(2)}` : `${result.initialPrice.toLocaleString()}원`}
                  </div>
                </div>
                <div className="text-slate-600 flex items-center justify-center font-black text-xl sm:text-2xl">➔</div>
                <div className="bg-slate-800/40 rounded-xl px-4 sm:px-6 py-3 border border-slate-700/50 flex flex-col items-center">
                  <div className="text-slate-400 text-xs font-bold mb-1">현재 주가</div>
                  <div className={`text-lg sm:text-xl font-black ${result.currentPrice > result.initialPrice ? 'text-cyan-400' : (result.currentPrice < result.initialPrice ? 'text-red-400' : 'text-slate-200')}`}>
                    {result.isUsStock ? `$${result.currentPrice.toFixed(2)}` : `${result.currentPrice.toLocaleString()}원`}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex flex-col justify-center">
              <div className="text-slate-400 text-xs sm:text-sm font-bold mb-1">단순 합산 수익 (기대치)</div>
              <div className="text-2xl sm:text-3xl font-black text-slate-200">
                {result.arithmeticReturnPct! > 0 ? '+' : ''}{result.arithmeticReturnPct}%
              </div>
              <div className="text-slate-500 text-sm mt-1">
                {formatMoney(result.arithmeticAmount!, result.currency)}
                {result.currency === 'USD' && result.currentFx && ` (약 ${formatMoney(result.arithmeticAmount! * result.currentFx, 'KRW')})`}
              </div>
            </div>

            <div className={`bg-slate-800/80 rounded-xl p-5 border shadow-xl flex flex-col justify-center ${result.actualReturnPct! >= 0 ? 'border-cyan-500/50 shadow-cyan-900/20' : 'border-red-500/50 shadow-red-900/20'}`}>
              <div className="text-slate-400 text-xs sm:text-sm font-bold mb-1">실제 내 계좌 수익</div>
              <div className={`text-3xl sm:text-4xl font-black ${result.actualReturnPct! >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                {result.actualReturnPct! > 0 ? '+' : ''}{result.actualReturnPct}%
              </div>
              <div className="text-slate-300 text-sm mt-1 font-bold">
                {formatMoney(result.actualAmount!, result.currency)}
                {result.currency === 'USD' && result.currentFx && <span className="text-slate-400 font-normal ml-1">(약 {formatMoney(result.actualAmount! * result.currentFx, 'KRW')})</span>}
              </div>
            </div>
          </div>

          {result.isUsStock && result.currency === 'KRW' && result.fxImpactPct !== undefined && (
            <div className="relative z-10 rounded-xl p-5 border flex flex-col justify-center bg-slate-800/80 border-slate-700 mt-4">
              <div className="text-slate-400 text-xs font-bold mb-1 flex items-center justify-between">
                <span>🌍 환율 변동 효과 (FX Impact)</span>
                <span className="text-slate-500 font-normal">
                  매수시: {result.initialFx?.toLocaleString()}원 ➔ 현재: {result.currentFx?.toLocaleString()}원
                </span>
              </div>
              <div className={`text-2xl font-black ${result.fxImpactPct >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                {result.fxImpactPct > 0 ? '+' : ''}{result.fxImpactPct}%
              </div>
              <div className="text-slate-300 text-sm mt-1 font-bold">
                {result.fxImpactAmount! > 0 ? '+' : ''}{formatMoney(result.fxImpactAmount!, 'KRW')}
              </div>
            </div>
          )}

          <div className={`relative z-10 rounded-xl p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            result.compoundEffectPct! < 0 
              ? 'bg-red-950/40 border-red-900/50 text-red-100' 
              : 'bg-cyan-950/40 border-cyan-900/50 text-cyan-100'
          }`}>
            <div className="flex-1">
              <div className="font-black text-lg mb-1 break-keep">
                {result.compoundEffectPct! < 0 ? '🚨 음의 복리 마술에 당했습니다!' : '✨ 양의 복리로 존버 승리!'}
              </div>
              <div className="text-sm opacity-80 break-keep leading-relaxed">
                {result.compoundEffectPct! < 0 
                  ? '단순히 더한 수익률보다 실제 계좌가 처참하게 녹아내렸습니다. 이게 바로 변동성 끌림 현상입니다.'
                  : '오르락 내리락 복리 효과가 긍정적으로 작용하여 기대보다 더 많은 수익을 거뒀습니다!'}
              </div>
              {result.ticker && !/(2X|3X|BULL|BEAR|SOXL|TQQQ|SQQQ|SOXS|BOIL|KOLD|FAS|FAZ|YINN|YANG|UPRO|SPXU|BULZ|FNGU|FNGD|LABU|LABD)/i.test(result.ticker) && (
                <div className="text-xs text-slate-300 mt-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700 shadow-inner break-keep leading-relaxed">
                  💡 <strong>앗! 일반 주식(1X 본주)을 검색하셨나요?</strong><br />
                  일반 주식은 레버리지(2X/3X)처럼 <strong>음의 복리(변동성 끌림)</strong> 효과가 크지 않아서 단순 합산과 큰 차이가 없을 수 있습니다. 진정한 야수의 심장 테스트를 원하시면 <code>SOXL</code>이나 <code>TQQQ</code>를 입력해보세요! 🎢
                </div>
              )}
            </div>
            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-700/50 sm:border-transparent">
              <div className="text-xs font-bold opacity-70 mb-1">복리로 증발한/불려진 금액</div>
              <div className={`text-2xl sm:text-3xl font-black ${result.compoundEffectPct! < 0 ? 'text-red-400' : 'text-cyan-400'}`}>
                {result.compoundDiffAmount! > 0 ? '+' : ''}{formatMoney(result.compoundDiffAmount!, result.currency)}
              </div>
              {result.currency === 'USD' && result.currentFx && (
                <div className={`text-sm mt-1 font-bold ${result.compoundEffectPct! < 0 ? 'text-red-400/80' : 'text-cyan-400/80'}`}>
                  (약 {result.compoundDiffAmount! > 0 ? '+' : ''}{formatMoney(result.compoundDiffAmount! * result.currentFx, 'KRW')})
                </div>
              )}
            </div>
          </div>

          <div className="h-64 sm:h-80 w-full mt-8 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickFormatter={(val) => val.substring(5)} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10}
                  tickFormatter={(val) => `${val}%`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="actualPct" 
                  name="실제 계좌 수익률(%)" 
                  stroke={result.actualReturnPct! >= 0 ? "#22d3ee" : "#f87171"} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="arithmeticPct" 
                  name="단순 기대 수익률(%)" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-12 bg-slate-800/40 p-5 rounded-xl text-slate-400 text-xs sm:text-sm border border-slate-700/50 relative z-10">
            <h3 className="font-bold text-slate-200 mb-3 text-base">🤔 어떻게 계산된 결과인가요?</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-slate-300">단순 기대 수익:</strong> 매일매일의 등락률(+5%, -3% 등)을 단순히 더했을 때 내가 기대하는 이론적인 수익률입니다.</li>
              <li><strong className="text-slate-300">실제 내 계좌 수익:</strong> 복리 효과가 적용되어 내 계좌에 실제로 찍혀있는 최종 수익률입니다.</li>
              <li><strong className="text-slate-300">변동성 끌림(음의 복리):</strong> 주가가 오르락내리락을 반복할 때, 상승률보다 하락률의 타격이 더 커서 결과적으로 계좌가 녹아내리는 현상입니다. (예: 50% 하락 후 원금을 복구하려면 100% 상승이 필요함)</li>
              <li><strong className="text-slate-300">환율 변동 효과:</strong> 원화 투자 시, 주식 수익률과 별개로 매수 시점 대비 달러 환율이 오르거나 내림에 따라 발생한 추가 이득/손실입니다.</li>
            </ul>
          </div>
        </div>
      )}

      {result && !result.success && (
        <div className="bg-red-950/50 border border-red-900 rounded-xl p-6 text-center animate-slide-up mt-8">
          <p className="text-red-400 font-bold">❌ 에러 발생</p>
          <p className="text-red-200 text-sm mt-2">{result.error}</p>
        </div>
      )}
    </div>
  );
}
