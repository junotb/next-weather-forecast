'use client';

import localforage from "localforage";
import { requestFcst } from "@/libs/fcst";

const STORE_NAME = "fcst_instance";

localforage.config({
  name: "WeatherForecastDB",
  storeName: STORE_NAME,
  description: "Stores short-term weather forecast data",
});

/**
 * 모든 데이터를 조회하여 배열로 반환합니다.
 * @returns 모든 데이터를 배열로 반환합니다.
 */
const getAllForecastData = async () => {
  const forecasts: FcstInstance[] = [];

  try {
    await localforage.iterate((value) => {
      forecasts.push(value as FcstInstance);
    });

    // 배열이 비어 있다면 requestFcst()를 호출하여 데이터를 채운다.
    if (forecasts.length === 0) {
      const newForecasts = await requestFcst(); // requestFcst()는 데이터를 반환하는 비동기 함수라고 가정
      if (!newForecasts) throw new Error("데이터를 불러오지 못했습니다.");

      forecasts.push(...newForecasts); // newForecasts 배열의 요소들을 forecasts에 추가
    }
  } catch (error) {
    console.error("모든 데이터 조회 실패:", error);
  }

  return forecasts;
};

/**
 * 특정 데이터를 조회하여 반환합니다.
 * @param nx 
 * @param ny 
 * @param fcstDate 
 * @param fcstTime 
 */
const getForecastData = async (nx: number, ny: number, fcstDate: string, fcstTime: string) => {
  const key = `${nx}_${ny}_${fcstDate}_${fcstTime}`;
  
  try {
    const data = await localforage.getItem(key);
    return data;
  } catch (error) {
    console.error("데이터 조회 실패:", error);
    return null;
  }
};

/**
 * 데이터를 저장합니다.
 * @param data 
 */
const saveForecastData = async (data: FcstInstance) => {
  const { nx, ny, fcstDate, fcstTime, fcstData } = data;
  
  const key = `${nx}_${ny}_${fcstDate}_${fcstTime}`;
  
  try {
    localforage.clear().then(() => {
      localforage.setItem(key, { nx, ny, fcstDate, fcstTime, fcstData });
    });
  } catch (error) {
    console.error("데이터 저장 실패:", error);
  }
};

export { getAllForecastData, getForecastData, saveForecastData };