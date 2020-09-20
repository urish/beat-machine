import { useEffect } from 'react';

export function useWindowListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  deps?: React.DependencyList,
) {
  useEffect(() => {
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }, deps);
}
