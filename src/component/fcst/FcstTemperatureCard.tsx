import { formatTime, convertFcstSkyCondition, convertFcstPrecipitation } from '@/lib/util';
import "bootstrap-icons/font/bootstrap-icons.css";

interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

const skyIconMap = {
  '1': <i className="bi bi-sun text-xl"></i>, // 맑음
  '3': <i className="bi bi-cloud-sun text-xl"></i>, // 구름 많음
  '4': <i className="bi bi-cloudy text-xl"></i>, // 흐림
};

const precipitationIconMap = {
  '0': <i className="bi bi-dash-circle text-xl"></i>, // 없음
  '1': <i className="bi bi-cloud-rain text-xl"></i>, // 비
  '2': <i className="bi bi-cloud-sleet text-xl"></i>, // 비/눈
  '3': <i className="bi bi-snow text-xl"></i>, // 눈
  '4': <i className="bi bi-cloud-lightning-rain text-xl"></i>, // 소나기
};

export default function FcstTemperaturCard({ fcst }: FcstTemperatureCardProps) {
  const fcstDataMap = new Map<string, string>(fcst.fcstData.map((data) => [data.category, data.value]));

  const temperature = fcstDataMap.get('TMP') || '0';
  const skyCondition = fcstDataMap.get('SKY') || '0';
  const precipitation = fcstDataMap.get('PTY') || '0';

  return (
    <div className="flex flex-col items-center justify-center min-w-16">
      <p className="text-sm">{formatTime(fcst.fcstTime)}</p>
      {precipitation === '0' 
        ? skyIconMap[skyCondition as keyof typeof skyIconMap] 
        : precipitationIconMap[precipitation as keyof typeof precipitationIconMap]}
      <p className="text-sm">{temperature}</p>
    </div>
  );
}