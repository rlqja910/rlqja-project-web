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
  const [hasDismissed, setHasDismissed] = useState(
    localStorage.getItem('korekore_push_dismissed') === 'true'
  );

  useEffect(() => {
    // Check if already subscribed or dismissed
    if (hasDismissed || !('serviceWorker' in navigator) || !('PushManager' in window)) {
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
          visitorId
        })
      });

      if (response.ok) {
        alert('성공적으로 돈 복사 버스에 탑승하셨습니다! 🚀');
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
    localStorage.setItem('korekore_push_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-sm" onClick={dismiss}></div>
      <div className="relative bg-slate-900 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] w-full max-w-md rounded-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="absolute -top-6 -right-6 text-5xl animate-bounce">🚨</div>
        
        <h3 className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight tracking-tight mt-2">
          <span className="text-red-500">[긴급]</span> 세력이 매집 중인 종목, <br/> 남들보다 <span className="text-cyan-400">5분 늦게</span> 아시겠습니까?
        </h3>
        
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 mb-6">
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            KOREKORE의 실시간 속보와 미친 떡상 정보를 폰으로 <strong className="text-yellow-400">가장 먼저</strong> 쏴드립니다. 
          </p>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            지금 바로 알림을 켜고 돈 복사 버스에 탑승하세요!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isSubscribing ? '탑승 중...' : '🚀 돈 복사 버스 탑승하기 (알림 켜기)'}
          </button>
          <button
            onClick={dismiss}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-medium hover:bg-slate-700 hover:text-slate-300 transition-colors"
          >
            안 탈래요 (나중에 켜기)
          </button>
        </div>
      </div>
    </div>
  );
};
