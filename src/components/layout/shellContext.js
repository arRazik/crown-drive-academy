import { createContext, useContext, useEffect } from 'react';

export const ShellContext = createContext({ setFocus: () => {} });

// وضع التركيز: يخفي الشريط الجانبي (مثلاً أثناء الاختبار) طالما active = true
export function useShellFocus(active) {
  const { setFocus } = useContext(ShellContext);
  useEffect(() => {
    setFocus(active);
    return () => setFocus(false);
  }, [active, setFocus]);
}
