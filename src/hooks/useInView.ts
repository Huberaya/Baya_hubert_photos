'use client';

import { RefObject, useEffect, useState } from 'react';

export function useInView<T extends Element>(ref: RefObject<T>, threshold = .2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}
