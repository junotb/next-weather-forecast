import { formatTime, convertFcstSkyCondition, convertFcstPrecipitation } from '@/lib/util';
import "bootstrap-icons/font/bootstrap-icons.css";

interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

const skyIconMap = {
  '1': <i className="bi bi-sun text-warning"></i>, // 맑음
  '3': <i className="bi bi-cloud-sun text-secondary"></i>, // 구름 많음
  '4': <i className="bi bi-cloudy text-dark"></i>, // 흐림
};

const precipitationIconMap = {
  '0': <i className="bi bi-dash-circle text-muted"></i>, // 없음
  '1': <i className="bi bi-cloud-rain text-primary"></i>, // 비
  '2': <i className="bi bi-cloud-sleet text-info"></i>, // 비/눈
  '3': <i className="bi bi-snow text-light"></i>, // 눈
  '4': <i className="bi bi-cloud-lightning-rain text-warning"></i>, // 소나기
};

export default function FcstTemperaturCard({ fcst }: FcstTemperatureCardProps) {
  const fcstDataMap = new Map<string, string>(fcst.fcstData.map((data) => [data.category, data.value]));

  const temperature = fcstDataMap.get('TMP') || '0';
  const skyCondition = fcstDataMap.get('SKY') || '0';
  const precipitation = fcstDataMap.get('PTY') || '0';

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{formatTime(fcst.fcstTime)}</p>
      {precipitation === '0' 
        ? skyIconMap[skyCondition as keyof typeof skyIconMap] 
        : precipitationIconMap[precipitation as keyof typeof precipitationIconMap]}
      <p className="text-sm">{temperature}</p>
    </div>
  );
}