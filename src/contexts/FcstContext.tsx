'use client';

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getAllForecastData } from "@/libs/localforage";

interface FcstContextType {
  fcstData: FcstInstance[];
  setFcstData: (fcstData: FcstInstance[]) => void;
  maxTmp: number;
  minTmp: number;
  currentTmp: number;
}

export const FcstContext = createContext<FcstContextType>({
  fcstData: [],
  setFcstData: () => {},
  maxTmp: 0,
  minTmp: 0,
  currentTmp: 0,
});

export default function FcstProvider({ children }: { children: ReactNode }) {
  const [fcstData, setFcstData] = useState<FcstInstance[]>([]);
  const [maxTmp, setMaxTmp] = useState<number>(0);
  const [minTmp, setMinTmp] = useState<number>(0);
  const [currentTmp, setCurrentTmp] = useState<number>(0);

  useEffect(() => {
    // 이미 데이터가 있으면 데이터를 가져오지 않음
    if (fcstData.length > 0) return;

    // 데이터가 없으면 데이터를 가져옴
    const fetchFcst = async () => {
      const newFcstData = await getAllForecastData();
      setFcstData(newFcstData);
    };
    
    fetchFcst();
  }, [fcstData.length, setFcstData]);

  useEffect(() => {
    if (fcstData.length === 0) return;

    let maxTmp = 0;
    let minTmp = 0;
    let currentTmp = 0;
    let minTimeDiff = 0;

    const currentHour = new Date().getHours(); // 현재 시간 (24시간)
    
    fcstData.forEach((fcst) => {
      const tmpData = fcst.fcstData.find((data) => data.category === 'TMP');
      if (!tmpData) return;
      
      const tmpValue = parseInt(tmpData.value, 10);
      if (isNaN(tmpValue)) return;

      maxTmp = Math.max(maxTmp, tmpValue);
      minTmp = Math.min(minTmp, tmpValue);
      
      const timeDiff = Math.abs(parseInt(fcst.fcstTime, 10) - currentHour);
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        currentTmp = tmpValue;
      }
    });

    setMaxTmp(maxTmp);
    setMinTmp(minTmp);
    setCurrentTmp(currentTmp);
  }, [currentTmp, fcstData]);

  return (
    <FcstContext.Provider value={{ fcstData, setFcstData, maxTmp, minTmp, currentTmp }}>
      {children}
    </FcstContext.Provider>
  );
}

export const useFcstContext = () => {
  const context = useContext(FcstContext);
  if (!context) {
    throw new Error('useFcstContext must be used within a FcstProvider');
  }
  return context;
};