'use client';

import FcstTodayCard from '@/components/fcst/FcstTodayCard';
import FcstTemperatureBar from '@/components/fcst/FcstTemperatureBar';
import FcstEmptyState from '@/components/fcst/FcstEmptyState';
import { useFcstContext } from '@/contexts/FcstContext';
import { usePullToRefresh, useFcstContentPalette } from '@/components/fcst/hooks';
import { RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export default function FcstContent() {
  const { isFcstLoading, refresh } = useFcstContext();
  const { hasData, isReady, isShowingLoader, gradientBg, handleScrollToCurrentComplete } =
    useFcstContentPalette();
  const {
    pullDistance,
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    pullThreshold,
  } = usePullToRefresh({ onRefresh: refresh });

  return (
    <div
      ref={containerRef}
      className="relative min-h-dvh w-full pt-14 pb-8 overflow-y-auto overscroll-y-auto"
      style={{ background: gradientBg }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {pullDistance > 0 && (
        <div
          className="absolute left-0 right-0 flex justify-center items-center py-3 text-white/80 z-10"
          style={{
            top: 56,
            transform: `translateY(${-pullThreshold + Math.min(pullDistance, pullThreshold * 1.2)}px)`,
          }}
        >
          <RefreshCw
            className={pullDistance >= pullThreshold ? 'size-5 animate-spin' : 'size-5'}
            aria-hidden
          />
        </div>
      )}
      {isShowingLoader && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          aria-label="예보 로딩 중"
        >
          <div className="flex flex-col justify-center items-center gap-4">
            <div
              className="size-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
              aria-hidden
            />
            <p className="text-white/90 text-center">날씨 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      )}
      {!hasData && !isFcstLoading && (
        <div className="relative z-10 flex flex-col gap-6 px-4">
          <FcstEmptyState />
        </div>
      )}
      {hasData && (
        <div
          className={clsx(
            'relative z-10 flex flex-col gap-6 px-4 transition-opacity duration-700 ease-out',
            isReady ? 'opacity-100' : 'opacity-0'
          )}
        >
          <FcstTodayCard />
          <FcstTemperatureBar onScrollToCurrentComplete={handleScrollToCurrentComplete} />
        </div>
      )}
    </div>
  );
}
