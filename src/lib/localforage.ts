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
    console.error("Error retrieving all data:", error);
  }

  return forecasts;
};

const getForecastData = async (nx: number, ny: number, fcstDate: string, fcstTime: string) => {
  const key = `${nx}_${ny}_${fcstDate}_${fcstTime}`;
  
  try {
    const data = await localforage.getItem(key);
    return data;
  } catch (error) {
    console.error("Error retrieving data:", error);
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
    console.error("Error saving data:", error);
  }
};

export { getAllForecastData, getForecastData, saveForecastData };