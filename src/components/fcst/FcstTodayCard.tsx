'use client';

import React from 'react';
import { useFcstContext } from '@/contexts/FcstContext';
import PrecipitationIconMap from '@/components/fcst/utils/PrecipitationIconMap';
import SkyIconMap from '@/components/fcst/utils/SkyIconMap';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function FcstTodayCard() {
  const { minTmp, maxTmp, currentFcst } = useFcstContext();
  const fcstValues = (category: string) => currentFcst.fcstData.find(data => data.category === category)?.value || '0';

  const temperature = fcstValues('TMP');
  const skyCondition = fcstValues('SKY');
  const precipitation = fcstValues('PTY');

  const fcstIcon = precipitation === '0'
    ? SkyIconMap(skyCondition, 'text-4xl')  
    : PrecipitationIconMap(precipitation, 'text-4xl');

  if (currentFcst.fcstData.length === 0) return null;
  
  return (
    <section className="flex justify-center items-center h-42 bg-gray-200/10 rounded-xl shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center gap-4">
          {fcstIcon}
          <span className="text-white">{temperature}℃</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-2">
            <span className="text-white text-xs">최고:</span>
            <span className="text-white text-xs">{maxTmp}℃</span>
          </div>
          <div className="flex gap-2">
            <span className="text-white text-xs">최저:</span>
            <span className="text-white text-xs">{minTmp}℃</span>
          </div>
        </div>
      </div>
    </section>
  );
}