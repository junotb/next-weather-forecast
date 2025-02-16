'use server';

import axios from 'axios';

const API_KEY_DEC = process.env.API_KEY_DEC;

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


export { requestFcst, convertFcstCategory };