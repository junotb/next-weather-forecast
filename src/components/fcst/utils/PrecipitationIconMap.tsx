import clsx from 'clsx';
import { ReactNode } from 'react'

/**
 * 단기 예보 데이터 강수형태 아이콘 맵
 * @param precipitation 단기 예보 데이터 강수형태
 * @returns 아이콘
 */
export default function PrecipitationIconMap(precipitation: string, className: string) {
  const precipitationIconMap: Record<string, ReactNode> = {
    '0': <i className={clsx('bi bi-dash-circle-fill text-white', className)}></i>, // 없음
    '1': <i className={clsx('bi bi-cloud-rain-fill text-white', className)}></i>, // 비
    '2': <i className={clsx('bi bi-cloud-sleet-fill text-white', className)}></i>, // 비/눈
    '3': <i className={clsx('bi bi-snow-fill text-white', className)}></i>, // 눈
    '4': <i className={clsx('bi bi-cloud-lightning-rain-fill text-white', className)}></i>, // 소나기
  };

  return precipitationIconMap[precipitation as keyof typeof precipitationIconMap];
}