'use client';

import { useRef, useState, useCallback } from 'react';

const PULL_THRESHOLD = 80;

export interface UsePullToRefreshOptions {
  onRefresh: () => void;
}

export interface UsePullToRefreshReturn {
  pullDistance: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  pullThreshold: number;
}

export function usePullToRefresh({ onRefresh }: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const pullDistanceRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  pullDistanceRef.current = pullDistance;

  const isAtTop = useCallback(() => {
    if (typeof window === 'undefined') return true;
    const scrollTop =
      containerRef.current?.scrollTop ??
      window.scrollY ??
      document.documentElement.scrollTop ??
      0;
    return scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isAtTop()) {
        startYRef.current = e.touches[0].clientY;
      }
    },
    [isAtTop]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startYRef.current === 0 || !isAtTop()) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        setPullDistance(Math.min(delta * 0.5, PULL_THRESHOLD * 1.2));
      }
    },
    [isAtTop]
  );

  const handleTouchEnd = useCallback(() => {
    if (pullDistanceRef.current >= PULL_THRESHOLD) {
      onRefresh();
    }
    setPullDistance(0);
    startYRef.current = 0;
  }, [onRefresh]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isAtTop()) {
        startYRef.current = e.clientY;
        const onMouseMove = (ev: MouseEvent) => {
          const delta = ev.clientY - startYRef.current;
          if (delta > 0) {
            const d = Math.min(delta * 0.5, PULL_THRESHOLD * 1.2);
            setPullDistance(d);
          }
        };
        const onMouseUp = () => {
          if (pullDistanceRef.current >= PULL_THRESHOLD) {
            onRefresh();
          }
          setPullDistance(0);
          startYRef.current = 0;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    },
    [onRefresh, isAtTop]
  );

  return {
    pullDistance,
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    pullThreshold: PULL_THRESHOLD,
  };
}
