import { useEffect, useState } from 'react';

// رقم إصدار التطبيق من Electron (مثل 1.0.2). خارج Electron (المتصفح) يعيد null.
export function useAppVersion() {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    window.desktop?.getVersion().then(setVersion).catch(() => {});
  }, []);

  return version;
}
