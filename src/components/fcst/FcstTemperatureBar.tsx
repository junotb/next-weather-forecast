'use client';

import { useFcstContext } from '@/contexts/FcstContext';
import DraggableScroll from '@/components/DraggableScroll';
import FcstTemperatureCard from '@/components/fcst/FcstTemperatureCard';

export default function FcstTemperaturBar() {
  const { fcstData } = useFcstContext();
  
  return (
    <DraggableScroll className="flex items-center py-2 space-x-2 w-full h-28 bg-gray-200/10 overflow-x-auto rounded-xl shadow-xl">
      {fcstData.map((fcst, index) => (
        <FcstTemperatureCard key={index} fcst={fcst} />
      ))}
    </DraggableScroll>
  );
}