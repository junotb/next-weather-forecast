/**
 * 시간 형식 변환
 * @param hhmm 시간 형식
 * @returns 변환된 시간 형식
 */
const formatTime = (hhmm: string) => {
  if (!/^\d{4}$/.test(hhmm)) {
    throw new Error("Invalid input format. Expected 'hhmm' as a 4-digit string.");
  }
  
  const hh = hhmm.slice(0, 2); // 앞 2자리 (시간)
  const mm = hhmm.slice(2, 4); // 뒤 2자리 (분)
  
  return `${hh}:${mm}`;
}

/**
 * 단기 예보 데이터 카테고리 변환
 * @param category 단기 예보 데이터 카테고리
 * @returns 변환된 카테고리
 */
const convertFcstCategory = (category: string): string => {
  switch (category) {
    case 'POP': return '강수확률';
    case 'PTY': return '강수형태';
    case 'PCP': return '1시간 강수량';
    case 'REH': return '습도';
    case 'SNO': return '1시간 신적설';
    case 'SKY': return '하늘상태';
    case 'TMP': return '1시간 기온';
    case 'TMN': return '일 최저기온';
    case 'TMX': return '일 최고기온';
    case 'UUU': return '풍속(동서성분)';
    case 'VVV': return '풍속(남북성분)';
    case 'WAV': return '파고';
    case 'VEC': return '풍향';
    case 'WSD': return '풍속';
    default: return category;
  }
};
  
/**
 * 단기 예보 데이터 하늘상태 변환
 * @param skyCondition 단기 예보 데이터 하늘상태
 * @returns 변환된 하늘상태
 */
const convertFcstSkyCondition = (skyCondition: string): string => {
  switch (skyCondition) {
    case '1': return '맑음';
    case '2': return '구름 많음';
    case '3': return '흐림';
    default: return skyCondition;
  }
};

/**
 * 단기 예보 데이터 강수형태 변환
 * @param precipitation 단기 예보 데이터 강수형태
 * @returns 변환된 강수형태
 */
const convertFcstPrecipitation = (precipitation: string): string => {
  switch (precipitation) {
    case '0': return '강수 없음';
    case '1': return '비';
    case '2': return '비/눈';
    case '3': return '눈';
    case '4': return '소나기';
    default: return precipitation;
  }
};

export { formatTime, convertFcstCategory, convertFcstSkyCondition, convertFcstPrecipitation };