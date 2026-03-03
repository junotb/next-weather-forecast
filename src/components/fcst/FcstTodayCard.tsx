'use client';

import { useEffect, useState } from 'react';
import { useFcstContext } from '@/contexts/FcstContext';
import PrecipitationIconMap from '@/components/fcst/utils/PrecipitationIconMap';
import SkyIconMap from '@/components/fcst/utils/SkyIconMap';
import {
  WEATHER_PALETTE,
  getWeatherType,
  getTimeOfDay,
} from '@/constants/weatherPalette';
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

  const weatherType = getWeatherType(skyCondition, precipitation);
  const timeOfDay = getTimeOfDay();
  const palette = WEATHER_PALETTE[timeOfDay][weatherType];

  const fcstIcon = precipitation === '0'
    ? SkyIconMap(skyCondition, 'size-14', palette.text)
    : PrecipitationIconMap(precipitation, 'size-14', palette.text);
  
  return (
    <section
      aria-label="오늘 날씨"
      className={clsx(
        'flex justify-center items-center h-40 transition-opacity duration-700 ease-in-out',
        { 'opacity-100': isVisible, 'opacity-0': !isVisible }
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center gap-6">
          {fcstIcon}
          <span className="text-2xl font-bold" style={{ color: palette.text }}>{temperature}℃</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="flex gap-2">
            <span className="font-bold" style={{ color: palette.text }}>최고:</span>
            <span className="font-bold" style={{ color: palette.text }}>{maxTmp}℃</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold" style={{ color: palette.text }}>최저:</span>
            <span className="font-bold" style={{ color: palette.text }}>{minTmp}℃</span>
          </div>
        </div>
      </div>
    </section>
  );
}