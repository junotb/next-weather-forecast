import { ReactNode } from 'react';
import { Sun, CloudSun, Cloud } from 'lucide-react';
import clsx from 'clsx';
import { convertFcstSkyCondition } from '@/lib/util';

/**
 * 단기 예보 데이터 하늘상태 아이콘 맵
 * @param skyCondition 단기 예보 데이터 하늘상태
 * @param className 아이콘 크기/스타일 클래스
 * @param iconColor 아이콘 색상 (미지정 시 text-white)
 * @returns 아이콘 (aria-label로 스크린 리더 지원)
 */
export default function SkyIconMap(
  skyCondition: string,
  className: string,
  iconColor?: string
) {
  const iconClass = clsx(!iconColor && 'text-white', className);
  const iconStyle = iconColor ? { color: iconColor } : undefined;
  const ariaLabel = convertFcstSkyCondition(skyCondition);
  const skyIconMap: Record<string, ReactNode> = {
    '1': <Sun className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '2': <CloudSun className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '3': <CloudSun className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '4': <Cloud className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
  };

  return skyIconMap[skyCondition as keyof typeof skyIconMap];
}
