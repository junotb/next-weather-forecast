'use client';

import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { getAllForecastData } from '@/libs/localforage';

interface FcstContextType {
  fcstData: FcstInstance[];
  setFcstData: (fcstData: FcstInstance[]) => void;
  maxTmp: number;
  minTmp: number;
  currentFcst: FcstInstance;
}

const initialFcst: FcstInstance = {
  nx: 0,
  ny: 0,
  fcstDate: '',
  fcstTime: '',
  fcstData: [],
};

export const FcstContext = createContext<FcstContextType>({
  fcstData: [],
  setFcstData: () => {},
  maxTmp: 0,
  minTmp: 0,
  currentFcst: initialFcst,
});

export default function FcstProvider({ children }: { children: ReactNode }) {
  const [fcstData, setFcstData] = useState<FcstInstance[]>([]);
  const [maxTmp, setMaxTmp] = useState<number>(0);
  const [minTmp, setMinTmp] = useState<number>(0);
  const [currentFcst, setCurrentFcst] = useState<FcstInstance>(initialFcst);

  // 예보 데이터 가져오기
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

  // 실시간 예보 데이터와 최고 기온과 최저 기온 계산
  useEffect(() => {
    if (fcstData.length === 0) return;

    let maxTmp = 0;
    let minTmp = 0;
    
    fcstData.forEach((fcst, index) => {
      // 실시간 예보 데이터 저장
      if (index === 0) {
        setCurrentFcst(fcst);
      }

      const tmpData = fcst.fcstData.find((data) => data.category === 'TMP');
      if (!tmpData) return;
      
      const tmpValue = parseInt(tmpData.value, 10);
      if (isNaN(tmpValue)) return;

      // 최고 기온과 최저 기온 계산
      maxTmp = Math.max(maxTmp, tmpValue);
      minTmp = Math.min(minTmp, tmpValue);
    });

    setMaxTmp(maxTmp);
    setMinTmp(minTmp);
  }, [currentFcst, fcstData]);

  return (
    <FcstContext.Provider value={{ fcstData, setFcstData, maxTmp, minTmp, currentFcst }}>
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