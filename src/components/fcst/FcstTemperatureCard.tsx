import { formatHour } from '@/libs/util';
import "bootstrap-icons/font/bootstrap-icons.css";
import { ReactNode } from 'react';

interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

const skyIconMap: Record<string, ReactNode> = {
  '1': <i className="bi bi-sun-fill text-white text-2xl"></i>, // 맑음
  '3': <i className="bi bi-cloud-sun-fill text-white text-2xl"></i>, // 구름 많음
  '4': <i className="bi bi-cloudy-fill text-white text-2xl"></i>, // 흐림
};

const precipitationIconMap: Record<string, ReactNode> = {
  '0': <i className="bi bi-dash-circle-fill text-white text-2xl"></i>, // 없음
  '1': <i className="bi bi-cloud-rain-fill text-white text-2xl"></i>, // 비
  '2': <i className="bi bi-cloud-sleet-fill text-white text-2xl"></i>, // 비/눈
  '3': <i className="bi bi-snow-fill text-white text-2xl"></i>, // 눈
  '4': <i className="bi bi-cloud-lightning-rain-fill text-white text-2xl"></i>, // 소나기
};

export default function FcstTemperaturCard({ fcst }: FcstTemperatureCardProps) {
  const fcstValues = (category: string) => fcst.fcstData.find(data => data.category === category)?.value || '0';

  const temperature = fcstValues('TMP');
  const skyCondition = fcstValues('SKY');
  const precipitation = fcstValues('PTY');

  const { period, hour } = formatHour(fcst.fcstTime);

  const fcstIcon = precipitation === '0'
    ? skyIconMap[skyCondition as keyof typeof skyIconMap]
    : precipitationIconMap[precipitation as keyof typeof precipitationIconMap];

  return (
    <div className="flex flex-col items-center justify-center min-w-14">
      <p className="text-white text-xs">{period}</p>
      <p className="text-white text-xs">{hour}시</p>
      {fcstIcon}
      <p className="text-white text-xs">{temperature}℃</p>
    </div>
  );
}