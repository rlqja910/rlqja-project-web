import React, { useState } from 'react';

export const FeedbackView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const visitorId = localStorage.getItem('korekore_visitor_id') || 'anon';
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, visitorId }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage('');
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        alert('전송에 실패했습니다 ㅠㅠ 다시 시도해주세요.');
      }
    } catch (e) {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="text-center space-y-4 mb-10 mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-2">
          <span className="text-3xl">📮</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white break-keep">
          사용자 <span className="text-purple-400">건의 게시판</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base break-keep px-4">
          개발자(직장인/노예)에게 바라는 점, 새로운 기능 아이디어, <br className="hidden sm:block"/>
          또는 응원의 메시지를 마음껏 적어주세요!<br/>
          <span className="text-purple-400 font-bold">건의 내용은 대표님만 비밀리에 확인할 수 있습니다. 🤫</span>
        </p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {isSuccess && (
          <div className="absolute inset-0 z-10 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <span className="text-6xl mb-4">🎉</span>
            <h3 className="text-2xl font-bold text-white mb-2">접수 완료!</h3>
            <p className="text-slate-400">대표님(노예)에게 성공적으로 전달되었습니다.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-0">
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-slate-300 mb-3 ml-1">
              어떤 점이 불편하거나 필요하신가요?
            </label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예: 이런이런 계산기 하나 만들어주세요! / 인구신 스캐너 너무 찰지네요 ㅋㅋㅋ"
              className="w-full bg-slate-950 border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all custom-scrollbar"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSubmitting ? '종이비행기 접어서 날리는 중... ✈️' : '의견 보내기 (익명 보장) 🚀'}
          </button>
        </form>
      </div>

    </div>
  );
};
