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

    // fcstData.fcstData의 카테고리가 TMP인 값들 중, 최대값, 최소값, 현재로부터 가장 가까운 미래의 값
    const maxTmp = Math.max(...fcstData.map((fcst) => parseInt(fcst.fcstData.find((data) => data.category === 'TMP')?.value || '0')));
    const minTmp = Math.min(...fcstData.map((fcst) => parseInt(fcst.fcstData.find((data) => data.category === 'TMP')?.value || '0')));
    
    // 가장 가까운 시간의 TMP 값을 찾음
    const nearestFcst = fcstData
      .map((fcst) => ({
        ...fcst,
        timeDiff: Math.abs(parseInt(fcst.fcstTime, 10) - parseInt(nowTime, 10)), // 시간 차이 계산
      }))
      .sort((a, b) => a.timeDiff - b.timeDiff)[0]; // 가장 가까운 시간 찾기

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