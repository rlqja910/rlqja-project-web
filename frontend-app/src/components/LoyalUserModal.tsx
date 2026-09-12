import React, { useState } from 'react';

export const LoyalUserModal: React.FC<{ 
  isVisible: boolean; 
  onComplete: (nickname: string) => void;
}> = ({ isVisible, onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const visitorId = localStorage.getItem('korekore_visitor_id') || 'unknown';
      localStorage.setItem('korekore_nickname', nickname.trim());
      
      // Update backend
      await fetch('/api/push/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, userName: nickname.trim() })
      });
      
      onComplete(nickname.trim());
    } catch (e) {
      console.error('Failed to update nickname', e);
      // Even if backend fails, we let them pass if they stored it locally
      onComplete(nickname.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B0F19]/95 backdrop-blur-md"></div>
      <div className="relative bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-md rounded-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-500 text-center overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500"></div>

        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700/50 relative">
          <span className="text-4xl animate-bounce absolute">🎉</span>
        </div>
        
        <h2 className="text-2xl font-extrabold text-white mb-2 break-keep">
          와, 벌써 <span className="text-cyan-400">5일째</span> 접속이시네요!
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 break-keep">
          꾸준히 KOREKORE를 찾아주셔서 진심으로 감사합니다. <br/>
          단골손님을 위해, 앞으로 부를 <strong className="text-white">멋진 닉네임</strong>을 하나 지어주세요!
        </p>

        <div className="mb-8">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="예: 떡상요정, 김기범"
            maxLength={15}
            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-cyan-500 text-white font-bold text-center text-lg rounded-xl px-4 py-4 outline-none transition-all placeholder:text-slate-500 placeholder:font-normal"
            autoFocus
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !nickname.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? '저장 중...' : '이 이름으로 확정!'}
        </button>
        
        <p className="mt-4 text-xs text-slate-500">
          (입력 전에는 창을 닫을 수 없습니다 😜)
        </p>
      </div>
    </div>
  );
};
