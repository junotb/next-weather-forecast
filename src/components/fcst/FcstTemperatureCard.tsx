import { formatHour } from '@/lib/util';
import SkyIconMap from '@/components/fcst/utils/SkyIconMap';
import PrecipitationIconMap from '@/components/fcst/utils/PrecipitationIconMap';

interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

export default function FcstTemperatureCard({ fcst }: FcstTemperatureCardProps) {
  const fcstValues = (category: string) => fcst.fcstData.find(data => data.category === category)?.value || '0';

  const temperature = fcstValues('TMP');
  const skyCondition = fcstValues('SKY');
  const precipitation = fcstValues('PTY');

  const { period, hour } = formatHour(fcst.fcstTime);

  const fcstIcon = precipitation === '0'
    ? SkyIconMap(skyCondition, 'size-8')
    : PrecipitationIconMap(precipitation, 'size-8');

  return (
    <div className="min-w-16 shrink-0 snap-start flex flex-col items-center justify-center gap-0.5 py-2 px-3">
      <span className="text-white/90 text-xs">{period}</span>
      <span className="text-white/90 text-xs">{hour}시</span>
      {fcstIcon}
      <span className="text-white text-sm font-medium">{temperature}℃</span>
    </div>
  );
}