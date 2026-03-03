'use client';

import FcstTodayCard from '@/components/fcst/FcstTodayCard';
import FcstTemperatureBar from '@/components/fcst/FcstTemperatureBar';
import FcstEmptyState from '@/components/fcst/FcstEmptyState';
import { useFcstContext } from '@/contexts/FcstContext';
import { WEATHER_PALETTE, getWeatherType, getTimeOfDay } from '@/constants/weatherPalette';

export default function FcstContent() {
  const { fcstData, isFcstLoading, currentFcst } = useFcstContext();
  const hasData = !isFcstLoading && fcstData.length > 0;

  const fcstValues = (category: string) => currentFcst?.fcstData?.find((d) => d.category === category)?.value ?? '0';
  const sky = fcstValues('SKY');
  const pty = fcstValues('PTY');
  const weatherType = hasData ? getWeatherType(sky, pty) : 'clear';
  const timeOfDay = getTimeOfDay();
  const palette = WEATHER_PALETTE[timeOfDay][weatherType];

  return (
    <div
      className="min-h-dvh w-full pt-14 pb-8 transition-[background] duration-700"
      style={{
        background: `linear-gradient(135deg, ${palette.gradient.from}, ${palette.gradient.to})`,
      }}
    >
      <div className="flex flex-col gap-6 px-4">
        {hasData ? (
          <>
            <FcstTodayCard />
            <FcstTemperatureBar />
          </>
        ) : (
          <FcstEmptyState isLoading={isFcstLoading} />
        )}
      </div>
    </div>
  );
}
