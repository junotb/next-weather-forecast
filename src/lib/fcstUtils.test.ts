import { describe, it, expect } from 'vitest';
import { getBaseTimeAndDate, getNextApiUpdateTime } from './fcstUtils';

describe('getBaseTimeAndDate', () => {
  const toKst = (y: number, m: number, d: number, h: number, min: number) =>
    new Date(Date.UTC(y, m - 1, d, h, min, 0));

  it('02:10 이후 → 0200, 당일', () => {
    const res = getBaseTimeAndDate(toKst(2025, 3, 4, 2, 15));
    expect(res).toEqual({ base_date: '20250304', base_time: '0200' });
  });

  it('05:10 이후 → 0500, 당일', () => {
    const res = getBaseTimeAndDate(toKst(2025, 3, 4, 6, 0));
    expect(res).toEqual({ base_date: '20250304', base_time: '0500' });
  });

  it('08:10 이후 → 0800', () => {
    const res = getBaseTimeAndDate(toKst(2025, 3, 4, 9, 0));
    expect(res).toEqual({ base_date: '20250304', base_time: '0800' });
  });

  it('00:00~02:09 → 전날 2300', () => {
    const res = getBaseTimeAndDate(toKst(2025, 3, 5, 1, 0));
    expect(res).toEqual({ base_date: '20250304', base_time: '2300' });
  });

  it('23:10 이후 → 2300 당일', () => {
    const res = getBaseTimeAndDate(toKst(2025, 3, 4, 23, 30));
    expect(res).toEqual({ base_date: '20250304', base_time: '2300' });
  });
});

describe('getNextApiUpdateTime', () => {
  const toKst = (y: number, m: number, d: number, h: number, min: number) =>
    new Date(Date.UTC(y, m - 1, d, h, min, 0));

  it('02:00 → 02:10 당일', () => {
    const next = getNextApiUpdateTime(toKst(2025, 3, 4, 2, 0));
    expect(next.getUTCHours()).toBe(2);
    expect(next.getUTCMinutes()).toBe(10);
    expect(next.getUTCDate()).toBe(4);
  });

  it('05:15 → 08:10 당일', () => {
    const next = getNextApiUpdateTime(toKst(2025, 3, 4, 5, 15));
    expect(next.getUTCHours()).toBe(8);
    expect(next.getUTCMinutes()).toBe(10);
  });

  it('23:30 → 다음날 02:10', () => {
    const next = getNextApiUpdateTime(toKst(2025, 3, 4, 23, 30));
    expect(next.getUTCHours()).toBe(2);
    expect(next.getUTCMinutes()).toBe(10);
    expect(next.getUTCDate()).toBe(5);
  });
});
