import { describe, it, expect } from 'vitest';
import {
  formatHour,
  convertFcstCategory,
  convertFcstSkyCondition,
  convertFcstPrecipitation,
} from './util';

describe('formatHour', () => {
  it('오전 시간 변환', () => {
    expect(formatHour('0930')).toEqual({ period: '오전', hour: 9 });
  });

  it('오후 시간 변환', () => {
    expect(formatHour('1530')).toEqual({ period: '오후', hour: 3 });
  });

  it('0시는 12시로 변환', () => {
    expect(formatHour('0000')).toEqual({ period: '오전', hour: 12 });
  });

  it('12시', () => {
    expect(formatHour('1200')).toEqual({ period: '오후', hour: 12 });
  });

  it('잘못된 형식 시 에러', () => {
    expect(() => formatHour('15')).toThrow('잘못된 시간 형식');
  });
});

describe('convertFcstCategory', () => {
  it('TMP → 1시간 기온', () => {
    expect(convertFcstCategory('TMP')).toBe('1시간 기온');
  });

  it('SKY → 하늘상태', () => {
    expect(convertFcstCategory('SKY')).toBe('하늘상태');
  });

  it('알 수 없는 카테고리는 그대로 반환', () => {
    expect(convertFcstCategory('XXX')).toBe('XXX');
  });
});

describe('convertFcstSkyCondition', () => {
  it('1 → 맑음', () => {
    expect(convertFcstSkyCondition('1')).toBe('맑음');
  });

  it('2, 3 → 구름 많음', () => {
    expect(convertFcstSkyCondition('2')).toBe('구름 많음');
    expect(convertFcstSkyCondition('3')).toBe('구름 많음');
  });

  it('4 → 흐림', () => {
    expect(convertFcstSkyCondition('4')).toBe('흐림');
  });
});

describe('convertFcstPrecipitation', () => {
  it('0 → 강수 없음', () => {
    expect(convertFcstPrecipitation('0')).toBe('강수 없음');
  });

  it('1 → 비', () => {
    expect(convertFcstPrecipitation('1')).toBe('비');
  });

  it('3 → 눈', () => {
    expect(convertFcstPrecipitation('3')).toBe('눈');
  });

  it('4 → 소나기', () => {
    expect(convertFcstPrecipitation('4')).toBe('소나기');
  });
});
