'use client';

import React, { useEffect, useState } from 'react';
import { useFcstContext } from '@/contexts/FcstContext';
import PrecipitationIconMap from '@/components/fcst/utils/PrecipitationIconMap';
import SkyIconMap from '@/components/fcst/utils/SkyIconMap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import clsx from 'clsx';

export default function FcstTodayCard() {
  const { minTmp, maxTmp, currentFcst } = useFcstContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(currentFcst.fcstData.length > 0);
  }, [currentFcst.fcstData]);

  const fcstValues = (category: string) => currentFcst.fcstData.find(data => data.category === category)?.value || '0';

  const temperature = fcstValues('TMP');
  const skyCondition = fcstValues('SKY');
  const precipitation = fcstValues('PTY');

  const fcstIcon = precipitation === '0'
    ? SkyIconMap(skyCondition, 'text-6xl')  
    : PrecipitationIconMap(precipitation, 'text-6xl');
  
  return (
    <section className={clsx('flex justify-center items-center h-40 bg-gray-200/10 rounded-xl shadow-xl transition-opacity duration-700 ease-in-out', {
      'opacity-100': isVisible,
      'opacity-0': !isVisible,
    })}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center gap-6">
          {fcstIcon}
          <span className="text-white text-2xl font-bold">{temperature}℃</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="flex gap-2">
            <span className="text-white font-bold">최고:</span>
            <span className="text-white font-bold">{maxTmp}℃</span>
          </div>
          <div className="flex gap-2">
            <span className="text-white font-bold">최저:</span>
            <span className="text-white font-bold">{minTmp}℃</span>
          </div>
        </div>
      </div>
    </section>
  );
}