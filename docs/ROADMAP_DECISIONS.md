# 로드맵 의사결정 및 조사 결과

> 작성일: 2025년 3월 4일  
> 참고: 기상청41_단기예보 조회서비스_오픈API활용가이드_241128.docx, 격자_위경도(2510).xlsx

---

## 0. 기상청 단기예보 API 참고 (별첨 자료 기준)

### 0.1 API 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | VilageFcstInfoService_2.0 (단기예보 조회서비스) |
| Base URL | `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0` |
| 단기예보 엔드포인트 | `getVilageFcst` |
| 인증 | ServiceKey (URL Encode) |
| 응답 형식 | XML / JSON |

### 0.2 단기예보 조회 (getVilageFcst) 요청 파라미터

| 파라미터 | 필수 | 설명 | 예시 |
|----------|------|------|------|
| serviceKey | O | 인증키 (URL Encode) | - |
| numOfRows | - | 한 페이지 결과 수 (기본 10, 최대 1000) | 864 |
| pageNo | - | 페이지 번호 | 1 |
| dataType | - | XML / JSON | JSON |
| base_date | O | 발표일자 YYYYMMDD | 20210628 |
| base_time | O | 발표시각 HHMM | 0500 |
| nx | O | 예보지점 X 좌표 | 55 |
| ny | O | 예보지점 Y 좌표 | 127 |

**nx, ny**: 격자 좌표. 행정구역별 지점 좌표는 **별첨 엑셀(격자_위경도)** 참조.

### 0.3 발표시각 (base_time)

- **1일 8회**: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (KST)
- **API 제공 시각** (이후 호출 가능): 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10

### 0.4 예보요소 (category) 코드값

| category | 항목명 | 단위 | 비고 |
|----------|--------|------|------|
| POP | 강수확률 | % | |
| PTY | 강수형태 | 코드 | 0:없음, 1:비, 2:비/눈, 3:눈, 4:소나기 |
| PCP | 1시간 강수량 | 범주 | 1mm 미만, 실수+mm, 30~50mm, 50mm 이상 |
| REH | 습도 | % | |
| SNO | 1시간 신적설 | 범주 | 0.5cm 미만, 실수+cm, 5cm 이상 |
| SKY | 하늘상태 | 코드 | 1:맑음, 2·3:구름많음, 4:흐림 |
| TMP | 1시간 기온 | ℃ | |
| TMN | 일 최저기온 | ℃ | |
| TMX | 일 최고기온 | ℃ | |
| UUU | 풍속(동서) | m/s | |
| VVV | 풍속(남북) | m/s | |
| WAV | 파고 | M | |
| VEC | 풍향 | deg | |
| WSD | 풍속 | m/s | |

### 0.5 격자 좌표 ↔ 위경도 변환

- **격자**: NX=149, NY=253 (X, Y 축 격자점 수)
- **행정구역별 지점 좌표**: `격자_위경도(2510).xlsx` 참조 (삼청동, 을지로동, 청주시 등)
- **변환**: 위경도 ↔ 격자 좌표 전환은 가이드 내 C 예제 또는 별도 변환 로직 사용  
  - 예: `# a.out 1 59 125` → lon=126.93, lat=37.49  
  - 예: `# a.out 0 126.93 37.49` → X=59, Y=125

### 0.6 지역 추가 시 고려사항

- 지역 = **[nx, ny]** 쌍 (가이드 정의와 동일)
- **지역명 표시**: 격자_위경도 엑셀의 행정구역명 활용 가능 (삼청동, 을지로동 등)
- **위경도 → nx, ny**: 지도 검색 시 위경도 입력 → 변환 필요
- **현재 위치**: Geolocation API로 위경도 획득 후 격자 변환

### 0.7 현재 구현 vs API 가이드

| 항목 | fcst.ts 현재 | API 가이드 |
|------|--------------|------------|
| base_time | 0500 고정 | 02/05/08/11/14/17/20/23시 중 KST 기준 적절한 시각 선택 |
| nx, ny | 60, 127 하드코딩 | 요청할 지역별 nx, ny 전달 |
| numOfRows | 864 | 1000 이하 |

---

## 1. 지역 추가 로직 검토 및 논리 검증

### 1.1 정의 요약

| 항목 | 정의 |
|------|------|
| **지역** | [nx, ny] 좌표 쌍 |
| **지역 목록** | [nx, ny] 배열, IndexedDB → 최종 DB 서버 저장 |
| **현재 지역** | 사용자가 선택한 지역 |
| **currentFcst** | 현재 지역에 해당하는 FcstInstance (또는 시계열 슬라이스) |

### 1.2 현재 코드와의 괴리

| 현재 구현 | 사용자 의도 | 논리적 이슈 |
|-----------|-------------|-------------|
| `currentFcst = fcstData[0]` | 선택한 지역의 예보 | **현재는 첫 번째만 사용.** `setCurrentFcst`가 없어 사용자 선택 불가 |
| `maxTmp/minTmp` | 해당 지역 기준 | `forEach` 전체 순회로 **모든 지역이 섞여 계산됨** |
| `requestFcst()` | 지역별 요청 | **nx, ny가 60, 127로 고정** |
| `localforage.saveForecastData()` | 지역별 저장 | **clear 후 1건만 저장** → 기존 데이터 전체 삭제 |
| `getAllForecastData()` | 지역별 목록 | 키가 `nx_ny_fcstDate_fcstTime`이라 **지역 개념이 없음** |

### 1.3 필요한 구조 변경

```
[현재] fcstData: FcstInstance[] (한 지역, 다중 시각)
       currentFcst = fcstData[0] (항상 첫 번째)

[목표] locations: { nx, ny }[]           ← IndexedDB "locations" 스토어
       currentLocationIndex: number      ← 선택한 인덱스
       forecastByLocation: Map<"nx_ny", FcstInstance[]>
       currentFcst = forecastByLocation.get(currentLocationKey)의 "현재" 시각 슬라이스
       maxTmp/minTmp = currentLocation의 fcstData 기준으로 계산
```

### 1.4 결론

- **논리 오류**: “선택한 지역” 개념이 없고, 다중 지역 데이터가 한곳에 섞여 있음
- **필수 변경**: `locations` 스토어, `currentLocationIndex`, 지역별 `forecastByLocation` 구조 도입

---

## 2. FcstFooter

- **결정**: 현재는 비워두고, Nav가 필요할 때 재사용
- 별도 작업 없음

---

## 3. Empty State

- **결정**: 현재 지역이 없으면, 지역 선택을 유도
- **안내 예시**: "현재 위치로 설정" 또는 "지도에서 검색"
- **구현**: 지역 목록이 비어 있거나 `currentLocation`이 없을 때 전용 UI 노출

---

## 4. 에러 메시지

- **결정**: A안 – 항상 사용자 친화적 메시지로 변환
- **예시 매핑**:
  - 네트워크/타임아웃 → "인터넷 연결을 확인해주세요"
  - API 5xx → "잠시 후 다시 시도해주세요"
  - API 4xx/인증 → "서비스 이용에 문제가 있습니다"
  - 기타 → "예기치 않은 오류가 발생했습니다"

---

## 5. 반응형 브레이크포인트

- **결정**: 모바일 우선
- **Tailwind 기본값 기준**:

| 구간 | breakpoint | 용도 |
|------|------------|------|
| xs | (default) | 모바일 |
| sm | 640px | 모바일 가로 / 작은 태블릿 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 대형 데스크톱 |

---

## 6. 스와이프 힌트

- **결정**: 노출, 일회성, 문구 `"← 스와이프"`
- **구현**: `localStorage` 등으로 최초 1회만 표시

---

## 7. Pull-to-refresh

### 7.1 주요 날씨 앱 사용 여부

| 앱 | 적용 |
|----|------|
| Yahoo Weather | ✅ (2014년부터) |
| AccuWeather | 일반적으로 지원 |
| Weather Channel | 대부분의 앱에서 지원 |
| Breezy Weather (OSS) | 지원 |

### 7.2 결론

- **일반적**: 모바일 날씨 앱에서 많이 사용
- **현재 결정**: 우선 미적용, 추후 재검토 가능

---

## 8. 색상 팔레트 (낮/밤 × 날씨)

다크 모드 대신, **낮/밤 × 날씨** 조합별 색상 팔레트를 사용.

### 8.1 날씨 유형

| 코드 | 조건 | 설명 |
|------|------|------|
| 1 | 맑음 | Clear |
| 2, 3 | 구름 많음 | Partly cloudy |
| 4 | 흐림 | Cloudy |
| 0 | 강수 없음 | No precipitation |
| 1 | 비 | Rain |
| 2 | 비/눈 | Rain/snow |
| 3 | 눈 | Snow |
| 4 | 소나기 | Shower |

### 8.2 색상 팔레트

```ts
// src/constants/weatherPalette.ts

export type TimeOfDay = 'day' | 'night';
export type WeatherType = 'clear' | 'cloudy' | 'overcast' | 'rain' | 'snow' | 'shower';

export interface WeatherPalette {
  /** 메인 배경 그라데이션 (from → to) */
  gradient: { from: string; to: string };
  /** 카드 배경 */
  card: string;
  /** 주 텍스트 */
  text: string;
  /** 보조 텍스트 */
  textMuted: string;
  /** Primary 액센트 (버튼, 링크) */
  primary: string;
  /** Primary 전경 (버튼 위 텍스트) */
  primaryForeground: string;
}

export const WEATHER_PALETTE: Record<TimeOfDay, Record<WeatherType, WeatherPalette>> = {
  day: {
    clear: {
      gradient: { from: '#38bdf8', to: '#7dd3fc' },     // sky-400 → sky-300
      card: 'rgba(255,255,255,0.25)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.9)',
      primary: '#0ea5e9',
      primaryForeground: '#ffffff',
    },
    cloudy: {
      gradient: { from: '#94a3b8', to: '#cbd5e1' },    // slate-400 → slate-300
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#64748b',
      primaryForeground: '#ffffff',
    },
    overcast: {
      gradient: { from: '#64748b', to: '#94a3b8' },    // slate-500 → slate-400
      card: 'rgba(255,255,255,0.15)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.8)',
      primary: '#475569',
      primaryForeground: '#ffffff',
    },
    rain: {
      gradient: { from: '#0f766e', to: '#2dd4bf' },    // teal-700 → teal-400
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#14b8a6',
      primaryForeground: '#ffffff',
    },
    snow: {
      gradient: { from: '#e0e7ff', to: '#f5f3ff' },    // indigo-100 → violet-50
      card: 'rgba(99,102,241,0.15)',
      text: '#312e81',
      textMuted: '#4c1d95',
      primary: '#6366f1',
      primaryForeground: '#ffffff',
    },
    shower: {
      gradient: { from: '#4c1d95', to: '#7c3aed' },    // violet-800 → violet-500
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#8b5cf6',
      primaryForeground: '#ffffff',
    },
  },
  night: {
    clear: {
      gradient: { from: '#1e3a5f', to: '#0c4a6e' },     // blue-900 → sky-900
      card: 'rgba(255,255,255,0.1)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#38bdf8',
      primaryForeground: '#0f172a',
    },
    cloudy: {
      gradient: { from: '#334155', to: '#475569' },    // slate-700 → slate-600
      card: 'rgba(255,255,255,0.08)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.75)',
      primary: '#94a3b8',
      primaryForeground: '#0f172a',
    },
    overcast: {
      gradient: { from: '#1e293b', to: '#334155' },     // slate-800 → slate-700
      card: 'rgba(255,255,255,0.06)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.7)',
      primary: '#64748b',
      primaryForeground: '#ffffff',
    },
    rain: {
      gradient: { from: '#134e4a', to: '#0f766e' },    // teal-900 → teal-700
      card: 'rgba(255,255,255,0.1)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#2dd4bf',
      primaryForeground: '#134e4a',
    },
    snow: {
      gradient: { from: '#312e81', to: '#4c1d95' },    // violet-900 → violet-800
      card: 'rgba(255,255,255,0.1)',
      text: '#e0e7ff',
      textMuted: 'rgba(224,231,255,0.8)',
      primary: '#a5b4fc',
      primaryForeground: '#312e81',
    },
    shower: {
      gradient: { from: '#3b0764', to: '#6b21a8' },     // purple-900 → purple-700
      card: 'rgba(255,255,255,0.08)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#a78bfa',
      primaryForeground: '#3b0764',
    },
  },
};

/** SKY(1~4) + PTY(0~4) → WeatherType 매핑 */
export function getWeatherType(sky: string, pty: string): WeatherType {
  if (pty !== '0') {
    if (pty === '1') return 'rain';
    if (pty === '2') return 'rain';  // 비/눈 → rain
    if (pty === '3') return 'snow';
    if (pty === '4') return 'shower';
  }
  if (sky === '1') return 'clear';
  if (sky === '2' || sky === '3') return 'cloudy';
  if (sky === '4') return 'overcast';
  return 'clear';
}

/** 현재 시각 기준 낮/밤 (간단 휴리스틱: 6~18시 = 낮) */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}
```

### 8.3 SKY / PTY → WeatherType 매핑

| SKY | PTY | WeatherType |
|-----|-----|-------------|
| 1 | 0 | clear |
| 2, 3 | 0 | cloudy |
| 4 | 0 | overcast |
| - | 1 | rain |
| - | 2 | rain |
| - | 3 | snow |
| - | 4 | shower |

---

## 9. DraggableScroll 키보드 지원 (다른 날씨앱 조사)

### 9.1 조사 결과

| 소스 | 내용 |
|------|------|
| Bogdan on A11y | 가로 스크롤 구간에 `tabindex="0"` 및 `role`, `aria-label` 필요. 포커스 가능 요소가 있으면 Tab으로 스크롤 가능하나, 스크롤 가능 여부를 사용자가 인지하기 어려움 |
| The Weather Channel | 모바일 세로 모드 위주, 가로/키보드 UX 제한 |
| Met Office | 네이티브 컴포넌트 사용, 큰 글꼴에서 레이아웃 이슈 |
| WCAG / 가이드 | 가로 스크롤은 중요 네비게이션에 쓰지 말 것. 불가피하면 포커스/시맨틱/시각적 표시 필수 |

### 9.2 결론

- **일반적**: 주요 상용 앱이 가로 스크롤에 대한 명시적 키보드 지원을 강조하지 않음
- **접근성**: `tabindex="0"`, `role="region"`, `aria-label="시간별 예보 목록"` 정도 적용 권장
- **화살표 스크롤**: 구현 시 접근성 향상, 선택 사항으로 P2 이후 검토

---

## 10. 시간별 예보 카드 클릭/인터랙션 (다른 날씨앱 조사)

### 10.1 조사 결과

| 앱/패턴 | 적용 |
|---------|------|
| AccuWeather | 카드 탭 시 추가 정보(풍속, 습도 등) progressive disclosure |
| Google Gemini | 카드 내 탭 토글(온도/강수/바람) |
| WeatherBug 등 | 카드 확장/상세 정보 패턴 사용 |

### 10.2 결론

- **일반적**: 시간별 카드에 탭/클릭으로 상세 정보 노출이 흔함
- **권장**: 카드 `isPressable` + 상세(풍속, 습도, 강수확률 등) 확장
- **우선순위**: P2 (지역/Empty State 등 이후)
