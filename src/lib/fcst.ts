'use server';

import axios from 'axios';
import { getBaseTimeAndDate } from '@/lib/fcstUtils';

const API_KEY_DEC = process.env.API_KEY_DEC;

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

/**
 * 단기 예보 데이터를 인스턴스로 변환
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
 * @param nx 예보지점 X 좌표 (기본 60)
 * @param ny 예보지점 Y 좌표 (기본 127)
 * @returns 인스턴스 배열 또는 undefined (실패 시)
 */
const requestFcst = async (nx = 60, ny = 127): Promise<FcstInstance[] | undefined> => {
  if (!API_KEY_DEC) {
    console.error('API_KEY_DEC가 설정되지 않았습니다.');
    return undefined;
  }

  const kstNow = getKstNow();
  const { base_date, base_time } = getBaseTimeAndDate(kstNow);

  const startDate = new Date(kstNow);
  const endDate = new Date(startDate);
  endDate.setUTCHours(endDate.getUTCHours() + 48);

  try {
    const response = await axios.get<FcstResponse>(
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
      {
        params: {
          ServiceKey: API_KEY_DEC,
          pageNo: 1,
          numOfRows: 864,
          dataType: 'JSON',
          base_date,
          base_time,
          nx,
          ny,
        },
      }
    );

    const { header, body } = response.data.response;
    if (header.resultCode !== '00') throw new Error(`API 호출 실패: ${header.resultMsg}`);

    const { item } = body.items;

    const filteredItems = item.filter((fcstItem: FcstResponseItem) => {
      const fcstDateTime = new Date(
        Date.UTC(
          parseInt(fcstItem.fcstDate.substring(0, 4)),
          parseInt(fcstItem.fcstDate.substring(4, 6)) - 1,
          parseInt(fcstItem.fcstDate.substring(6, 8)),
          parseInt(fcstItem.fcstTime.substring(0, 2))
        )
      );
      return fcstDateTime >= startDate && fcstDateTime <= endDate;
    });

    return transformFcstResponseItems(filteredItems);
  } catch (error) {
    console.error('일기예보 API 호출 실패:', error);
    return undefined;
  }
};

export { requestFcst };
