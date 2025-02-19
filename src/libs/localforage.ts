'use client';

import localforage from "localforage";

const STORE_NAME = "fcst_instance";

localforage.config({
  name: "WeatherForecastDB",
  storeName: STORE_NAME,
  description: "Stores short-term weather forecast data",
});

const getAllForecastData = async () => {
  const forecasts: FcstInstance[] = [];

  try {
    await localforage.iterate((value) => {
      forecasts.push(value as FcstInstance);
    });
  } catch (error) {
    console.error("모든 데이터 조회 실패:", error);
  }

  return forecasts;
};

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