interface FcstRequest {
  serviceKey?: string; // 공공데이터포털에서 받은 인증키
  pageNo: number; // 페이지 번호 (예: 1)
  numOfRows: number; // 한 페이지 결과 수 (예: 1000)
  dataType?: 'XML' | 'JSON'; // 응답 자료형식 (옵션, 기본값은 'XML')
  base_date: string; // 발표일자 (예: '20210628')
  base_time: string; // 발표시각 (예: '0600')
  nx: number; // 예보지점 X 좌표 (예: 55)
  ny: number; // 예보지점 Y 좌표 (예: 127)
}

interface FcstResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: FcstResponseItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

interface FcstResponseItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface FcstInstance {
  nx: number;
  ny: number;
  fcstDate: string;
  fcstTime: string;
  fcstData: FcstProperty[];
}

interface FcstProperty {
  category: string;
  value: string;
}

/**
 * CREATE TABLE fcst_instance (
    id SERIAL PRIMARY KEY,
    nx INTEGER NOT NULL,
    ny INTEGER NOT NULL,
    fcst_date DATE NOT NULL,
    fcst_time TIME NOT NULL
);

CREATE TABLE fcst_data (
    id SERIAL PRIMARY KEY,
    fcst_instance_id INTEGER REFERENCES fcst_instance(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    value VARCHAR(50) NOT NULL
);
 */