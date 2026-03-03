import { describe, it, expect } from 'vitest';
import { getWeatherType, getTimeOfDay } from './weatherPalette';

describe('getWeatherType', () => {
  it('SKY 1 + PTY 0 → clear', () => {
    expect(getWeatherType('1', '0')).toBe('clear');
  });

  it('SKY 2,3 + PTY 0 → cloudy', () => {
    expect(getWeatherType('2', '0')).toBe('cloudy');
    expect(getWeatherType('3', '0')).toBe('cloudy');
  });

  it('SKY 4 + PTY 0 → overcast', () => {
    expect(getWeatherType('4', '0')).toBe('overcast');
  });

  it('PTY 1 → rain', () => {
    expect(getWeatherType('1', '1')).toBe('rain');
  });

  it('PTY 2 → rain (비/눈)', () => {
    expect(getWeatherType('1', '2')).toBe('rain');
  });

  it('PTY 3 → snow', () => {
    expect(getWeatherType('1', '3')).toBe('snow');
  });

  it('PTY 4 → shower', () => {
    expect(getWeatherType('1', '4')).toBe('shower');
  });

  it('알 수 없는 값 → clear 기본', () => {
    expect(getWeatherType('9', '0')).toBe('clear');
  });
});

describe('getTimeOfDay', () => {
  it('6시~17시 → day', () => {
    expect(getTimeOfDay(new Date(2025, 2, 4, 6, 0))).toBe('day');
    expect(getTimeOfDay(new Date(2025, 2, 4, 12, 0))).toBe('day');
    expect(getTimeOfDay(new Date(2025, 2, 4, 17, 59))).toBe('day');
  });

  it('18시~5시 → night', () => {
    expect(getTimeOfDay(new Date(2025, 2, 4, 18, 0))).toBe('night');
    expect(getTimeOfDay(new Date(2025, 2, 4, 0, 0))).toBe('night');
    expect(getTimeOfDay(new Date(2025, 2, 4, 5, 59))).toBe('night');
  });
});
