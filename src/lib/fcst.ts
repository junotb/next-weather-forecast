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
  const today = new Date();
  today.setHours(today.getHours() + 9); // KST (UTC+9) 기준 시간으로 설정 (서버가 UTC 시간대이므로)

  // 24시 이후의 데이터를 요청할 경우, 다음 날 데이터를 요청하도록 설정
  if (today.getHours() >= 24) {
    today.setDate(today.getDate() + 1);
    today.setHours(today.getHours() - 24);
  }
  
  const todayDate = today.toISOString().slice(0, 10).replace(/-/g, '');
  const todayTime = today.toISOString().slice(11, 13) + '00';

  const fcstResponseItems: FcstResponseItem[] = [];

  try {
    const response = await axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
      params: {
        ServiceKey: API_KEY_DEC,
        pageNo: 1,
        numOfRows: 864,
        dataType: 'JSON',
        base_date: todayDate,
        base_time: todayTime,
        nx: 60,
        ny: 127,
      },
    });

    console.log(response.data);

    const { header, body } = response.data.response;

    if (header.resultCode !== '00') throw new Error(`API 호출 실패: ${header.resultMsg}`);

    const { item } = body.items;

    fcstResponseItems.push(...item);
    
    return transformFcstResponseItems(fcstResponseItems);
  } catch (error) {
    console.error('Forecast API 호출 실패:', error);
  }
};

export { requestFcst };