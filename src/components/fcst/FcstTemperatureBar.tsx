'use client';

import { useFcstContext } from '@/contexts/FcstContext';
import { DraggableScroll } from '@/components/ui';
import FcstTemperatureCard from '@/components/fcst/FcstTemperatureCard';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

interface FcstTemperatureBarProps {
  onScrollToCurrentComplete?: () => void;
}

export default function FcstTemperatureBar({ onScrollToCurrentComplete }: FcstTemperatureBarProps) {
  const { fcstData, currentFcstIndex } = useFcstContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(fcstData.length > 0);
  }, [fcstData]);

  const scrollTriggerKey = fcstData.length > 0
    ? `${fcstData[0]?.fcstDate}-${fcstData[0]?.fcstTime}-${fcstData.length}`
    : '';
  
  return (
    <section
      aria-label="시간별 예보"
      className={clsx(
        'w-full rounded-xl overflow-hidden transition-opacity duration-700 ease-in-out',
        { 'opacity-100': isVisible, 'opacity-0': !isVisible }
      )}
      style={{
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        background: 'rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-white/90">
        <Clock className="size-4 shrink-0" aria-hidden />
        <span className="text-xs font-medium">시간별 예보</span>
      </div>
      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)',
        }}
      >
        <DraggableScroll
          className="flex items-center py-3 px-3 gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
          aria-label="시간별 예보 목록"
          scrollToIndex={currentFcstIndex}
          scrollTriggerKey={scrollTriggerKey}
          onScrollToIndexComplete={onScrollToCurrentComplete}
        >
          {fcstData.map((fcst, index) => (
            <FcstTemperatureCard key={index} fcst={fcst} />
          ))}
        </DraggableScroll>
      </div>
    </section>
  );
}