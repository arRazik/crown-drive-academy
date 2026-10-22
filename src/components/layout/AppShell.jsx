import React, { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ShellContext } from './shellContext';

// غلاف الصفحات المحمية: شريط جانبي ثابت + منطقة محتوى بعرض كامل.
// في وضع التركيز (أثناء الاختبار) يختفي الشريط ويأخذ المحتوى الشاشة كلها.
function AppShell() {
  const [focus, setFocus] = useState(false);
  const value = useMemo(() => ({ setFocus }), []);

  return (
    <ShellContext.Provider value={value}>
      <div className="flex h-screen overflow-hidden bg-page">
        {!focus && <Sidebar />}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className={focus ? 'min-h-full' : 'min-h-full p-8'}>
            <Outlet />
          </div>
        </main>
      </div>
    </ShellContext.Provider>
  );
}

export default AppShell;
