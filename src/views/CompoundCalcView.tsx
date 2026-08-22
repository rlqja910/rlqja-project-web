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

  const formatMoney = (val: number, cur: string = 'KRW') => {
    if (cur === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in pt-4">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 animate-pulse tracking-tight drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
          🎢 도파민 폭발 레버리지 팩폭기
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-bold mt-3 bg-slate-800/50 inline-block px-4 py-2 rounded-full border border-slate-700/50 shadow-lg">
          내 계좌가 얼마나 녹아내렸을까? 야수의 심장 전용 변동성 끌림 테스트 🐯🔥
        </p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
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
              type="number" 
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder={currency === 'KRW' ? "10000000" : "10000"}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
              매수 평단가 <span className="text-slate-500 font-normal">(선택항목)</span>
            </label>
            <input 
              type="number" 
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              placeholder="비워두면 매수일 종가 기준"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white font-bold focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <button 
          onClick={calculate}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '팩트 폭행 계산 중... ⏳' : '뼈 때리는 결과 보기 💥'}
        </button>
      </div>

      {result && result.success && result.chartData && (
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-6 sm:p-8 animate-slide-up space-y-8 shadow-2xl relative overflow-hidden mt-8">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[100px] rounded-full pointer-events-none opacity-20 ${(result.compoundEffectPct || 0) < 0 ? 'bg-red-500' : 'bg-cyan-500'}`}></div>

          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold text-white mb-1">
              <span className="text-cyan-400">{result.ticker}</span> 수익률 분석
            </h2>
            <p className="text-slate-400 text-sm">({startDate} ~ 현재)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex flex-col justify-center">
              <div className="text-slate-400 text-xs font-bold mb-1">단순 합산 수익 (기대치)</div>
              <div className="text-3xl font-black text-slate-200">
                {result.arithmeticReturnPct! > 0 ? '+' : ''}{result.arithmeticReturnPct}%
              </div>
              <div className="text-slate-500 text-sm mt-1">{formatMoney(result.arithmeticAmount!, result.currency)}</div>
            </div>

            <div className={`bg-slate-800/80 rounded-xl p-5 border shadow-xl flex flex-col justify-center ${result.actualReturnPct! >= 0 ? 'border-cyan-500/50 shadow-cyan-900/20' : 'border-red-500/50 shadow-red-900/20'}`}>
              <div className="text-slate-400 text-xs font-bold mb-1">실제 내 계좌 수익</div>
              <div className={`text-4xl font-black ${result.actualReturnPct! >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                {result.actualReturnPct! > 0 ? '+' : ''}{result.actualReturnPct}%
              </div>
              <div className="text-slate-300 text-sm mt-1 font-bold">{formatMoney(result.actualAmount!, result.currency)}</div>
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

          <div className={`relative z-10 rounded-xl p-6 border flex items-center justify-between gap-4 ${
            result.compoundEffectPct! < 0 
              ? 'bg-red-950/40 border-red-900/50 text-red-100' 
              : 'bg-cyan-950/40 border-cyan-900/50 text-cyan-100'
          }`}>
            <div>
              <div className="font-black text-lg mb-1">
                {result.compoundEffectPct! < 0 ? '🚨 음의 복리 마술에 당했습니다!' : '✨ 양의 복리로 존버 승리!'}
              </div>
              <div className="text-sm opacity-80">
                {result.compoundEffectPct! < 0 
                  ? '단순히 더한 수익률보다 실제 계좌가 처참하게 녹아내렸습니다. 이게 바로 변동성 끌림 현상입니다.'
                  : '오르락 내리락 복리 효과가 긍정적으로 작용하여 기대보다 더 많은 수익을 거뒀습니다!'}
              </div>
              {result.ticker && !/(2X|3X|BULL|BEAR|SOXL|TQQQ|SQQQ|SOXS|BOIL|KOLD|FAS|FAZ|YINN|YANG|UPRO|SPXU|BULZ|FNGU|FNGD|LABU|LABD)/i.test(result.ticker) && (
                <div className="text-xs text-slate-300 mt-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700 shadow-inner">
                  💡 <strong>앗! 일반 주식(1X 본주)을 검색하셨나요?</strong><br />
                  일반 주식은 레버리지(2X/3X)처럼 <strong>음의 복리(변동성 끌림)</strong> 효과가 크지 않아서 단순 합산과 큰 차이가 없을 수 있습니다. 진정한 야수의 심장 테스트를 원하시면 <code>SOXL</code>이나 <code>TQQQ</code>를 입력해보세요! 🎢
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold opacity-70 mb-1">복리로 증발한/불려진 금액</div>
              <div className={`text-2xl sm:text-3xl font-black ${result.compoundEffectPct! < 0 ? 'text-red-400' : 'text-cyan-400'}`}>
                {result.compoundDiffAmount! > 0 ? '+' : ''}{formatMoney(result.compoundDiffAmount!, result.currency)}
              </div>
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
