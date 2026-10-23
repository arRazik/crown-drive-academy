import { useEffect } from 'react';
import { sendHeartbeat } from './activityApi';
import { ACTIVE_WINDOW_MS, HEARTBEAT_INTERVAL_MS } from './config';

const INTERACTION_EVENTS = ['mousedown', 'mousemove', 'keydown', 'wheel', 'touchstart', 'scroll'];

// يرسل نبضة للسيرفر كل 30 ثانية طالما التطبيق مفتوح والمترشح داخل حسابه:
// السيرفر يجمع "الوقت داخل التطبيق"، وactive=true فقط إن تفاعل المترشح (نقر/كتابة/تمرير)
// خلال آخر دقيقة. المدرّب يرى الاثنين في لوحة الإدارة.
export function useActivityTracker() {
  useEffect(() => {
    let lastInteraction = Date.now();
    const markInteraction = () => {
      lastInteraction = Date.now();
    };
    INTERACTION_EVENTS.forEach((name) => window.addEventListener(name, markInteraction, { passive: true, capture: true }));

    const beat = () => {
      const active = Date.now() - lastInteraction <= ACTIVE_WINDOW_MS;
      sendHeartbeat(active).catch(() => {
        // فشل نبضة (السيرفر متوقف مؤقتاً) لا يؤثر على استعمال التطبيق
      });
    };

    beat();
    const intervalId = setInterval(beat, HEARTBEAT_INTERVAL_MS);
    return () => {
      clearInterval(intervalId);
      INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, markInteraction, { capture: true }));
    };
  }, []);
}
