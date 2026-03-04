'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  loadAllForecasts,
  getLocations,
  setLocations,
} from '@/lib/localforage';
import { findCurrentFcstIndex } from '@/lib/fcstUtils';

interface FcstContextType {
  /** 현재 선택된 지역의 예보 시계열 */
  fcstData: FcstInstance[];
  setFcstData: (fcstData: FcstInstance[]) => void;
  maxTmp: number;
  minTmp: number;
  /** 현재 시각에 해당하는 예보 (선택 지역 기준) */
  currentFcst: FcstInstance;
  /** 현재 시각에 해당하는 fcstData 인덱스 */
  currentFcstIndex: number;
  isFcstLoading: boolean;
  /** 지역 목록 */
  locations: FcstLocation[];
  /** 현재 선택 지역 인덱스 */
  currentLocationIndex: number;
  setCurrentLocationIndex: (index: number) => void;
  /** 지역 추가 (추가 후 데이터 fetch) */
  addLocation: (loc: FcstLocation) => Promise<void>;
  /** 지역 제거 */
  removeLocation: (index: number) => Promise<void>;
  /** 새로고침 (캐시 무시, API 재요청) */
  refresh: () => Promise<void>;
  /** 콘텐츠 준비 완료 (스크롤 완료 등) - 헤더 지역명 노출 시점 */
  isContentReady: boolean;
  /** 콘텐츠 준비 완료 표시 (FcstContent에서 스크롤 완료 시 호출) */
  markContentReady: () => void;
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
  currentFcstIndex: 0,
  isFcstLoading: true,
  locations: [],
  currentLocationIndex: 0,
  setCurrentLocationIndex: () => {},
  addLocation: async () => {},
  removeLocation: async () => {},
  refresh: async () => {},
  isContentReady: false,
  markContentReady: () => {},
});

export default function FcstProvider({ children }: { children: ReactNode }) {
  const [locations, setLocationsState] = useState<FcstLocation[]>([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [forecastByLocation, setForecastByLocation] = useState<
    Map<string, FcstInstance[]>
  >(new Map());
  const [maxTmp, setMaxTmp] = useState(0);
  const [minTmp, setMinTmp] = useState(0);
  const [currentFcst, setCurrentFcst] = useState<FcstInstance>(initialFcst);
  const [isFcstLoading, setIsFcstLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);

  const currentKey =
    locations[currentLocationIndex] != null
      ? `${locations[currentLocationIndex].nx}_${locations[currentLocationIndex].ny}`
      : '';
  const fcstData = useMemo(
    () => forecastByLocation.get(currentKey) ?? [],
    [forecastByLocation, currentKey]
  );

  const setFcstData = (data: FcstInstance[]) => {
    if (currentKey) {
      setForecastByLocation((prev) => {
        const next = new Map(prev);
        next.set(currentKey, data);
        return next;
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsFcstLoading(true);
      setIsContentReady(false);
      try {
        const locs = await getLocations();
        setLocationsState(locs);

        const map = await loadAllForecasts();
        setForecastByLocation(map);
      } finally {
        setIsFcstLoading(false);
      }
    };
    init();
  }, []);

  const currentFcstIndex = useMemo(
    () => (fcstData.length > 0 ? findCurrentFcstIndex(fcstData) : 0),
    [fcstData]
  );

  useEffect(() => {
    if (fcstData.length === 0) {
      setIsContentReady(false);
      return;
    }

    const idx = findCurrentFcstIndex(fcstData);
    setCurrentFcst(fcstData[idx]);

    let maxTmpVal = 0;
    let minTmpVal = Infinity;

    fcstData.forEach((fcst) => {
      const tmpData = fcst.fcstData.find((d) => d.category === 'TMP');
      if (!tmpData) return;

      const tmpValue = parseInt(tmpData.value, 10);
      if (isNaN(tmpValue)) return;

      maxTmpVal = Math.max(maxTmpVal, tmpValue);
      minTmpVal = Math.min(minTmpVal, tmpValue);
    });

    setMaxTmp(maxTmpVal);
    setMinTmp(minTmpVal === Infinity ? 0 : minTmpVal);
  }, [fcstData]);

  const addLocation = async (loc: FcstLocation) => {
    const next = [...locations, loc];
    await setLocations(next);
    setLocationsState(next);
    setCurrentLocationIndex(next.length - 1);
    const map = await loadAllForecasts();
    setForecastByLocation(map);
  };

  const removeLocation = async (index: number) => {
    const next = locations.filter((_, i) => i !== index);
    if (next.length === 0) return;
    await setLocations(next);
    setLocationsState(next);
    const newIndex = Math.min(currentLocationIndex, next.length - 1);
    setCurrentLocationIndex(newIndex);
    const map = await loadAllForecasts();
    setForecastByLocation(map);
  };

  const refresh = async () => {
    setIsFcstLoading(true);
    setIsContentReady(false);
    try {
      const map = await loadAllForecasts(true);
      setForecastByLocation(map);
    } finally {
      setIsFcstLoading(false);
    }
  };

  const markContentReady = useCallback(() => setIsContentReady(true), []);

  const value: FcstContextType = {
    fcstData,
    setFcstData,
    maxTmp,
    minTmp,
    currentFcst,
    currentFcstIndex,
    isFcstLoading,
    locations,
    currentLocationIndex,
    setCurrentLocationIndex,
    addLocation,
    removeLocation,
    refresh,
    isContentReady,
    markContentReady,
  };

  return (
    <FcstContext.Provider value={value}>{children}</FcstContext.Provider>
  );
}

export const useFcstContext = () => {
  const context = useContext(FcstContext);
  if (!context) {
    throw new Error('useFcstContext must be used within a FcstProvider');
  }
  return context;
};
