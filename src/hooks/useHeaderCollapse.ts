'use client';

import { useEffect, useState, useRef } from 'react';

export const useHeaderCollapse = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsCollapsed(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-10px 0px 0px 0px'
      }
    );

    observerRef.current.observe(headerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { isCollapsed, headerRef };
};
