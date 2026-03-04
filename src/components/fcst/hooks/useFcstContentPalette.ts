'use client';

import { useCallback } from 'react';
import { useFcstContext } from '@/contexts/FcstContext';
import {
  WEATHER_PALETTE,
  getWeatherType,
  getTimeOfDay,
  LOADING_PALETTE,
} from '@/constants/weatherPalette';

export interface UseFcstContentPaletteReturn {
  hasData: boolean;
  isReady: boolean;
  isShowingLoader: boolean;
  gradientBg: string;
  handleScrollToCurrentComplete: () => void;
}

export function useFcstContentPalette(): UseFcstContentPaletteReturn {
  const {
    fcstData,
    isFcstLoading,
    currentFcst,
    isContentReady,
    markContentReady,
  } = useFcstContext();

  const hasData = !isFcstLoading && fcstData.length > 0;

  const fcstValues = (category: string) =>
    currentFcst?.fcstData?.find((d) => d.category === category)?.value ?? '0';
  const sky = fcstValues('SKY');
  const pty = fcstValues('PTY');
  const weatherType = hasData ? getWeatherType(sky, pty) : 'clear';
  const timeOfDay = getTimeOfDay();

  const isReady = hasData && isContentReady;
  const isShowingLoader = isFcstLoading || (hasData && !isReady);

  const background =
    isReady && hasData
      ? `linear-gradient(135deg, ${WEATHER_PALETTE[timeOfDay][weatherType].gradient.from}, ${WEATHER_PALETTE[timeOfDay][weatherType].gradient.to})`
      : `linear-gradient(135deg, ${LOADING_PALETTE.gradient.from}, ${LOADING_PALETTE.gradient.to})`;

  const handleScrollToCurrentComplete = useCallback(() => markContentReady(), [markContentReady]);

  return {
    hasData,
    isReady,
    isShowingLoader,
    gradientBg: background,
    handleScrollToCurrentComplete,
  };
}
