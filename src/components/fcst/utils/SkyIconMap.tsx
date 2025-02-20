import { ReactNode } from 'react';
import clsx from 'clsx';
/**
 * 단기 예보 데이터 하늘상태 아이콘 맵
 * @param skyCondition 단기 예보 데이터 하늘상태
 * @returns 아이콘
 */
export default function SkyIconMap(skyCondition: string, className: string) {
  const skyIconMap: Record<string, ReactNode> = {
    '1': <i className={clsx('bi bi-sun-fill text-white', className)}></i>, // 맑음
    '3': <i className={clsx('bi bi-cloud-sun-fill text-white', className)}></i>, // 구름 많음
    '4': <i className={clsx('bi bi-cloudy-fill text-white', className)}></i>, // 흐림
  };

  return skyIconMap[skyCondition as keyof typeof skyIconMap];
}