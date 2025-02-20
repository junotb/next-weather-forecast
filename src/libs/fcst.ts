'use server';

import axios from 'axios';

const API_KEY_DEC = process.env.API_KEY_DEC;

/**
 * 단기 예보 데이터를 인스턴스로 변환
 * @param items 단기 예보 데이터
 * @returns 인스턴스 배열
 */
const transformFcstResponseItems = (items: FcstResponseItem[]): FcstInstance[] => {
  const instanceMap: Map<string, FcstInstance> = new Map();

  items.forEach((item) => {
    const key = `${item.nx}_${item.ny}_${item.fcstDate}_${item.fcstTime}`;

    if (!instanceMap.has(key)) {
      instanceMap.set(key, {
        nx: item.nx,
        ny: item.ny,
        fcstDate: item.fcstDate,
        fcstTime: item.fcstTime,
        fcstData: [],
      });
    }

    instanceMap.get(key)!.fcstData.push({
      category: item.category,
      value: item.fcstValue,
    });
  });

  return Array.from(instanceMap.values());
};

/**
 * 단기 예보 데이터를 요청
 * @returns 인스턴스 배열
 */
const requestFcst = async () => {
  // 한국 시간 (KST) 보장
  const now = new Date();
  const kstNow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours() + 9, // UTC +9 = KST
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ));

  // 현재 시간 +1시간 후부터 48시간 뒤까지 필터링 기준 설정
  const startDate = new Date(kstNow);

  const endDate = new Date(startDate);
  endDate.setUTCHours(endDate.getUTCHours() + 48);

  // YYYYMMDDHHMM 포맷 변환 함수
  const formatDate = (date: Date) => `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
  const formatTime = (date: Date) => `${String(date.getUTCHours()).padStart(2, '0')}00`;

  // 일기예보 데이터 배열
  const fcstResponseItems: FcstResponseItem[] = [];

  try {
    // 기준 날짜가 0500 이전인 경우 전날 데이터 요청
    const response = await axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
      params: {
        ServiceKey: API_KEY_DEC,
        pageNo: 1,
        numOfRows: 864,
        dataType: 'JSON',
        base_date: kstNow.getUTCHours() < 5
          ? formatDate(new Date(kstNow.getTime() - 1 * 24 * 60 * 60 * 1000))
          : formatDate(kstNow),
        base_time: '0500',
        nx: 60,
        ny: 127,
      },
    });

    const { header, body } = response.data.response;
    if (header.resultCode !== '00') throw new Error(`API 호출 실패: ${header.resultMsg}`);

    const { item } = body.items;

    // 현재 시간 +1시간로부터 48시간 뒤까지만 필터링
    const filteredItems = item.filter((fcstItem: FcstResponseItem) => {
      const fcstDateTime = new Date(Date.UTC(
        parseInt(fcstItem.fcstDate.substring(0, 4)), // 연도
        parseInt(fcstItem.fcstDate.substring(4, 6)) - 1, // 월 (0-based index)
        parseInt(fcstItem.fcstDate.substring(6, 8)), // 일
        parseInt(fcstItem.fcstTime.substring(0, 2)) // 시간
      ));

      return fcstDateTime >= startDate && fcstDateTime <= endDate;
    });

    // 일기예보 데이터 배열에 필터링된 데이터 추가
    fcstResponseItems.push(...filteredItems);

    // 인스턴스 배열로 변환
    return transformFcstResponseItems(fcstResponseItems);
  } catch (error) {
    console.error('일기예보 API 호출 실패:', error);
  }
};

export { requestFcst };