import { formatHour } from '@/libs/util';
import SkyIconMap from '@/components/fcst/utils/SkyIconMap';
import PrecipitationIconMap from '@/components/fcst/utils/PrecipitationIconMap';
import 'bootstrap-icons/font/bootstrap-icons.css';
interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

export default function FcstTemperaturCard({ fcst }: FcstTemperatureCardProps) {
  const fcstValues = (category: string) => fcst.fcstData.find(data => data.category === category)?.value || '0';

  const temperature = fcstValues('TMP');
  const skyCondition = fcstValues('SKY');
  const precipitation = fcstValues('PTY');

  const { period, hour } = formatHour(fcst.fcstTime);

  const fcstIcon = precipitation === '0'
    ? SkyIconMap(skyCondition, 'text-2xl')
    : PrecipitationIconMap(precipitation, 'text-2xl');

  return (
    <div className="flex flex-col items-center justify-center min-w-14">
      <span className="text-white text-xs">{period}</span>
      <span className="text-white text-xs">{hour}시</span>
      {fcstIcon}
      <span className="text-white text-xs">{temperature}℃</span>
    </div>
  );
}