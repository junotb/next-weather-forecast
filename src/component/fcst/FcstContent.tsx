'use client';

import { useEffect, useState } from 'react';
import { getAllForecastData } from '@/lib/localforage';
import { formatTime } from '@/lib/util';

export default function Content() {
  const [fcstData, setFcstData] = useState<FcstInstance[]>([]);
  
  const fetchFcst = async () => {
    const res = await getAllForecastData();
    setFcstData(res);
  };

  useEffect(() => {
    fetchFcst();
  }, []);

  return (
    <div className="flex flex-col py-16 size-full bg-white">
      <div className="flex gap-2 size-full overflow-x-auto">
        {fcstData.map((fcst, index) => (
          <div key={index} className="flex flex-col gap-2">
            <h1>{formatTime(fcst.fcstTime)}</h1>
            {fcst.fcstData.filter((data) => data.category === 'TMP').map((data, index) => (
              <p key={index}>{data.value}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}