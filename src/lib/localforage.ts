'use client';

import localforage from 'localforage';
import { requestFcst } from '@/lib/fcst';
import { getNextApiUpdateTime } from '@/lib/fcstUtils';

const STORE_NAME = 'fcst_instance';
const LOCATIONS_KEY = 'fcst_locations';
const CACHE_META_KEY = 'fcst_meta';

const DEFAULT_LOCATIONS: FcstLocation[] = [{ nx: 60, ny: 127, name: '서울' }];

localforage.config({
  name: 'WeatherForecastDB',
  storeName: STORE_NAME,
  description: 'Stores short-term weather forecast data',
});

function getKstNow(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours() + 9,
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );
}

function locationKey(nx: number, ny: number): string {
  return `${nx}_${ny}`;
}

function instanceKey(fcst: FcstInstance): string {
  return `${fcst.nx}_${fcst.ny}_${fcst.fcstDate}_${fcst.fcstTime}`;
}

export interface CacheMeta {
  expiresAt: number;
}

export async function getCacheMeta(): Promise<CacheMeta | null> {
  try {
    const meta = await localforage.getItem<CacheMeta>(CACHE_META_KEY);
    return meta;
  } catch {
    return null;
  }
}

export async function setCacheMeta(expiresAt: number): Promise<void> {
  try {
    await localforage.setItem<CacheMeta>(CACHE_META_KEY, { expiresAt });
  } catch (error) {
    console.error('캐시 메타 저장 실패:', error);
  }
}

export function isCacheExpired(meta: CacheMeta | null): boolean {
  if (!meta) return true;
  return Date.now() >= meta.expiresAt;
}

export async function getLocations(): Promise<FcstLocation[]> {
  try {
    const locs = await localforage.getItem<FcstLocation[]>(LOCATIONS_KEY);
    if (locs && locs.length > 0) return locs;
    await setLocations(DEFAULT_LOCATIONS);
    return DEFAULT_LOCATIONS;
  } catch (error) {
    console.error('지역 목록 조회 실패:', error);
    return DEFAULT_LOCATIONS;
  }
}

export async function setLocations(locations: FcstLocation[]): Promise<void> {
  try {
    await localforage.setItem<FcstLocation[]>(LOCATIONS_KEY, locations);
  } catch (error) {
    console.error('지역 목록 저장 실패:', error);
  }
}

/**
 * 특정 지역의 예보 데이터 조회 (캐시에서)
 */
export async function getForecastsForLocation(
  nx: number,
  ny: number
): Promise<FcstInstance[]> {
  const prefix = `${nx}_${ny}_`;
  const result: FcstInstance[] = [];

  try {
    await localforage.iterate((value, key) => {
      if (typeof key === 'string' && key.startsWith(prefix)) {
        result.push(value as FcstInstance);
      }
    });
  } catch (error) {
    console.error('지역별 예보 조회 실패:', error);
  }

  result.sort((a, b) => {
    const d = a.fcstDate.localeCompare(b.fcstDate);
    if (d !== 0) return d;
    return a.fcstTime.localeCompare(b.fcstTime);
  });
  return result;
}

/**
 * 특정 지역의 예보 데이터 저장 (기존 키만 덮어쓰기, clear 사용 안 함)
 */
export async function saveForecastsForLocation(
  nx: number,
  ny: number,
  instances: FcstInstance[],
  expiresAt: number
): Promise<void> {
  try {
    for (const fcst of instances) {
      await localforage.setItem(instanceKey(fcst), fcst);
    }
    await setCacheMeta(expiresAt);
  } catch (error) {
    console.error('예보 데이터 저장 실패:', error);
  }
}

/**
 * 모든 지역의 예보 로드 (캐시 유효 시 캐시 사용, 만료 시 API 호출 후 저장)
 * @returns Map<"nx_ny", FcstInstance[]>
 */
export async function loadAllForecasts(): Promise<Map<string, FcstInstance[]>> {
  const locations = await getLocations();
  const meta = await getCacheMeta();
  const expired = isCacheExpired(meta);
  const result = new Map<string, FcstInstance[]>();

  const kstNow = getKstNow();
  const nextUpdate = getNextApiUpdateTime(kstNow);
  const expiresAt = nextUpdate.getTime();

  for (const loc of locations) {
    const key = locationKey(loc.nx, loc.ny);
    let data = expired ? [] : await getForecastsForLocation(loc.nx, loc.ny);

    if (data.length === 0) {
      const fetched = await requestFcst(loc.nx, loc.ny);
      if (fetched && fetched.length > 0) {
        await saveForecastsForLocation(loc.nx, loc.ny, fetched, expiresAt);
        data = fetched;
      }
    }

    result.set(key, data);
  }

  return result;
}

/**
 * 특정 지역의 예보 조회 (단건)
 */
export async function getForecastData(
  nx: number,
  ny: number,
  fcstDate: string,
  fcstTime: string
): Promise<FcstInstance | null> {
  const key = `${nx}_${ny}_${fcstDate}_${fcstTime}`;
  try {
    const data = await localforage.getItem<FcstInstance>(key);
    return data;
  } catch (error) {
    console.error('데이터 조회 실패:', error);
    return null;
  }
}

/**
 * 단일 인스턴스 저장 (기존 데이터 유지, 해당 키만 덮어쓰기)
 */
export async function saveForecastData(data: FcstInstance): Promise<void> {
  const key = instanceKey(data);
  try {
    await localforage.setItem(key, data);
  } catch (error) {
    console.error('데이터 저장 실패:', error);
  }
}
