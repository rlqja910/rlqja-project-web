import React, { useState, useEffect } from 'react';

const VAPID_PUBLIC_KEY = 'BP4JbF_NrbG6cV3kTc_lnxuB7keMua1qGJrk20gjrsc-IY2J4LDZsJdh56cUbvttEocetu5T64iT-vyAfoChWDQ';

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushSubscriptionModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(() => {
    const legacyDismiss = localStorage.getItem('korekore_push_dismissed');
    if (legacyDismiss === 'true') {
      localStorage.removeItem('korekore_push_dismissed');
      localStorage.setItem('korekore_push_dismissed_at', Date.now().toString());
      return true;
    }
    const dismissedAt = localStorage.getItem('korekore_push_dismissed_at');
    if (dismissedAt) {
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedAt, 10) < threeDaysMs) {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    if (hasDismissed || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }
    
    if ('Notification' in window && Notification.permission === 'denied') {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (!subscription) {
          // Show popup after 3 seconds of entering site
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, 3000);
          return () => clearTimeout(timer);
        }
      });
    });
  }, [hasDismissed]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('알림 권한이 차단되었습니다. 브라우저 설정에서 허용해주세요.');
        dismiss();
        return;
      }

      const userName = prompt("알림에서 부를 회원님의 닉네임을 입력해주세요. (예: 김기범, 떡상요정)", "KOREKORE 팬") || "KOREKORE 팬";

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      const visitorId = localStorage.getItem('korekore_visitor_id') || 'unknown';
      const subscriptionJson = subscription.toJSON();
      
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          keys: subscriptionJson.keys,
          visitorId,
          userName
        })
      });

      if (response.ok) {
        alert('푸시 알림 설정이 완료되었습니다! 🔔');
        dismiss();
      } else {
        throw new Error('Server returned ' + response.status);
      }
    } catch (e) {
      console.error('Push subscription failed:', e);
      alert('알림 설정에 실패했습니다.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const dismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
    localStorage.setItem('korekore_push_dismissed_at', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-sm" onClick={dismiss}></div>
      <div className="relative bg-slate-900 border border-slate-700 shadow-2xl w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <span className="text-3xl">🤫</span>
          </div>
          
          <h2 className="text-2xl font-extrabold text-white mb-4 break-keep">
            찌라시, 광고 <span className="text-red-400">절대</span> 안 보냅니다.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 break-keep px-2">
            하루 딱 3번. 장전/점심/장마감 때 진짜 필요한 시황 세 줄 요약만 조용히 띄워드리고 빠집니다.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isSubscribing ? '설정 중...' : '알림 허용하기'}
          </button>
          <button
            onClick={dismiss}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium hover:bg-slate-700 hover:text-slate-300 transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
};
