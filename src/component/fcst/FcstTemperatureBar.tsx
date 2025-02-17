'use client';

import { useEffect } from 'react';
import { useFcstContext } from '@/context/FcstContext';
import { getAllForecastData } from '@/lib/localforage';
import FcstTemperatureCard from '@/component/fcst/FcstTemperatureCard';
export default function FcstTemperaturBar() {
  const { fcstData, setFcstData } = useFcstContext();

  useEffect(() => {
    const fetchFcst = async () => {
      const res = await getAllForecastData();
      setFcstData(res);
    };
    
    fetchFcst();
  }, [setFcstData]);
  
  return (
    <div className="flex gap-2 w-full h-24 bg-violet-300 overflow-x-auto rounded-xl shadow-xl">
      {fcstData.map((fcst, index) => (
        <FcstTemperatureCard key={index} fcst={fcst} />
      ))}
    </div>
  );
}