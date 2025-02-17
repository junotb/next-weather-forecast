import { formatTime, convertFcstCategory, convertFcstSkyCondition, convertFcstPrecipitation } from '@/lib/util';
import { useEffect, useState } from 'react';

interface FcstTemperatureCardProps {
  fcst: FcstInstance;
}

export default function FcstTemperaturCard({ fcst }: FcstTemperatureCardProps) {
  const [temperature, setTemperature] = useState<string>('');
  const [skyCondition, setSkyCondition] = useState<string>('');
  const [precipitation, setPrecipitation] = useState<string>('');

  useEffect(() => {
    const temperature = fcst.fcstData.filter((data) => data.category === 'TMP')[0]?.value || '0';
    const skyCondition = fcst.fcstData.filter((data) => data.category === 'SKY')[0]?.value || '0';
    const precipitation = fcst.fcstData.filter((data) => data.category === 'PCP')[0]?.value || '0';

    setTemperature(temperature);
    setSkyCondition(skyCondition);
    setPrecipitation(precipitation);
  }, [fcst]);

  return (
    <div className="flex flex-col gap-2">
      <h1>{formatTime(fcst.fcstTime)}</h1>
      <p>{temperature}</p>
      <p>{skyCondition}</p>
      <p>{precipitation}</p>
    </div>
  );
}