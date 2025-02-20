'use client';

import { useFcstContext } from '@/contexts/FcstContext';
import DraggableScroll from '@/components/DraggableScroll';
import FcstTemperatureCard from '@/components/fcst/FcstTemperatureCard';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function FcstTemperaturBar() {
  const { fcstData } = useFcstContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(fcstData.length > 0);
  }, [fcstData]);
  
  return (
    <div className={clsx('flex flex-col justify-center w-full h-36 bg-gray-200/10 rounded-xl shadow-xl transition-opacity duration-700 ease-in-out', {
      'opacity-100': isVisible,
      'opacity-0': !isVisible,
    })}>
      <div className="flex items-center gap-1 border-b border-gray-200/50 p-2 w-full">
        <i className="bi bi-clock-fill text-white text-xs"></i>
        <span className="text-white text-xs">시간별 예보</span>
      </div>
      <DraggableScroll className="flex items-center py-2 size-full space-x-2 overflow-x-auto">
        {fcstData.map((fcst, index) => (
          <FcstTemperatureCard key={index} fcst={fcst} />
        ))}
      </DraggableScroll>
    </div>
  );
}