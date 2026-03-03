import clsx from 'clsx';
import { ReactNode } from 'react';
import {
  MinusCircle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
} from 'lucide-react';
import { convertFcstPrecipitation } from '@/lib/util';

/**
 * 단기 예보 데이터 강수형태 아이콘 맵
 * @param precipitation 단기 예보 데이터 강수형태
 * @param className 아이콘 크기/스타일 클래스
 * @param iconColor 아이콘 색상 (미지정 시 text-white)
 * @returns 아이콘 (aria-label로 스크린 리더 지원)
 */
export default function PrecipitationIconMap(
  precipitation: string,
  className: string,
  iconColor?: string
) {
  const iconClass = clsx(!iconColor && 'text-white', className);
  const iconStyle = iconColor ? { color: iconColor } : undefined;
  const ariaLabel = convertFcstPrecipitation(precipitation);
  const precipitationIconMap: Record<string, ReactNode> = {
    '0': <MinusCircle className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '1': <CloudRain className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '2': <CloudSnow className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '3': <Snowflake className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
    '4': <CloudLightning className={iconClass} style={iconStyle} aria-label={ariaLabel} />,
  };

  return precipitationIconMap[precipitation as keyof typeof precipitationIconMap];
}
