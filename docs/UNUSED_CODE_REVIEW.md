# 불필요·미사용 코드 검토

> 검토일: 2025년 3월 4일

---

## 1. Executive Summary

| 구분 | 건수 | 비고 |
|------|------|------|
| **미사용 export** | 5 | util 3개, localforage 2개 → 확장성 유지 |
| **미사용 파일** | 0 | weatherPalette은 P3 예정 |
| **불필요 import** | 2 | ~~React (Fcst, FcstFooter)~~ ✅ 제거 완료 |
| **예약/문서용** | 2 | FcstFooter, fcst.d.ts SQL 주석 |

---

## 2. 미사용 export

### 2.1 `src/lib/util.ts`

| export | 사용처 | 권장 |
|--------|--------|------|
| `formatHour` | ✅ FcstTemperatureCard | 유지 |
| `convertFcstCategory` | ❌ 없음 | 제거 또는 미사용 유지 |
| `convertFcstSkyCondition` | ❌ 없음 | 제거 또는 미사용 유지 |
| `convertFcstPrecipitation` | ❌ 없음 | 제거 또는 미사용 유지 |

**상태**: `convertFcstCategory`, `convertFcstSkyCondition`, `convertFcstPrecipitation`는 카테고리/코드 → 한글 변환 유틸로, 추후 상세 화면·접근성 텍스트 등에 활용 가능.

**결정**: 확장성 유지. 아래 「지금 활용할 수 있는 안」 참고.

---

### 2.2 `src/lib/localforage.ts`

| export | 사용처 | 비고 |
|--------|--------|------|
| `getAllForecastData` | ✅ FcstContext | 유지 |
| `getForecastData` | ❌ 없음 | 특정 nx,ny,fcstDate,fcstTime 조회 |
| `saveForecastData` | ❌ 없음 | **주의**: clear() 후 1건만 저장 (ROADMAP 이슈) |

**상태**: 지역 추가/저장 기능 구현 시 `getForecastData`, `saveForecastData`가 필요할 수 있으나, 현재 `saveForecastData` 로직 자체가 문제 있음(전체 삭제 후 1건 저장).

**결정**: 확장성 유지. 지역 추가 기능 구현 시 활용.

---

## 3. 미사용 파일·모듈

### 3.1 `src/constants/weatherPalette.ts`

| 항목 | 상태 |
|------|------|
| `WEATHER_PALETTE` | ❌ 미사용 |
| `getWeatherType()` | ❌ 미사용 |
| `getTimeOfDay()` | ❌ 미사용 |

**상태**: ROADMAP_DECISIONS P3 “낮/밤 × 날씨 색상 팔레트”용으로 작성. FcstContent, FcstTodayCard 등에 아직 적용되지 않음.

**결정**: 확장성 유지. 아래 「지금 활용할 수 있는 안」 참고.

---

### 3.2 `src/types/fcst.d.ts` – 타입 사용 현황

| 타입 | 사용처 |
|------|--------|
| `FcstInstance` | fcst.ts, FcstContext, FcstTemperatureCard, localforage |
| `FcstProperty` | FcstInstance 내부 |
| `FcstResponseItem` | fcst.ts |
| `FcstRequest` | ❌ 미사용 |
| `FcstResponse` | ❌ 미사용 |

**상태**: `FcstRequest`, `FcstResponse`는 API 스펙 문서/참고용으로 보임. fcst.ts는 `response.data`를 직접 사용.

**결정**: 확장성 유지. 아래 「지금 활용할 수 있는 안」 참고.

---

### 3.3 `src/constants/ModalIDs.ts`

| 항목 | 사용처 |
|------|--------|
| `ModalIDs.FCST_LOCATIONS` | FcstHeader, FcstEmptyState |

**상태**: enum 값 1개만 존재. 지역 추가 모달용으로 사용 중. 추후 모달 추가 시 확장 예정.

**권장**: 유지 (미사용 아님)

---

## 4. 불필요 import

### 4.1 `import React from 'react'`

| 파일 | 상태 |
|------|------|
| `Fcst.tsx` | ✅ 제거 완료 |
| `FcstFooter.tsx` | ✅ 제거 완료 |

Next.js 17+ / React 19의 `jsx: "react-jsx"` 사용 시 불필요.

---

### 4.2 기타 import

- clsx, lucide-react, @heroui 등: 사용 중
- 나머지 import: 사용 중

---

## 5. 예약/공백 코드

### 5.1 `FcstFooter`

- **상태**: 내용 없이 `<footer>`만 렌더링
- **의도**: ROADMAP “Nav 필요할 때 활용”
- **권장**: 예약 컴포넌트로 유지

### 5.2 `fcst.d.ts` SQL 주석

- **상태**: CREATE TABLE 예시 주석
- **의도**: 향후 DB 스키마 참고
- **권장**: 유지 또는 docs로 분리

---

## 6. 확장성 유지·활용 정리

- **util.ts** (convertFcstCategory 등): 접근성·상세 화면용으로 유지
- **localforage.ts** (getForecastData, saveForecastData): 지역 추가 기능용으로 유지
- **weatherPalette.ts**: ROADMAP P3 색상 팔레트용으로 유지
- **fcst.d.ts** (FcstRequest, FcstResponse): API 타입 문서·확장용으로 유지

---

## 7. 지금 활용할 수 있는 안

| 대상 | 활용 방법 | 상태 |
|------|-----------|------|
| **util.ts 변환 함수** | `SkyIconMap`, `PrecipitationIconMap`에 `aria-label` 적용 | ✅ 적용 완료 |
| **weatherPalette** | `FcstTodayCard` 배경색에 `getWeatherType()` + `getTimeOfDay()` 적용 | ✅ 적용 완료 |
| **FcstRequest, FcstResponse** | `fcst.ts`의 `requestFcst()` 반환 타입에 `FcstResponse` 적용 | ✅ 적용 완료 |

---

## 8. 정리 이력

| 일자 | 작업 |
|------|------|
| 2025-03-04 | P1: `import React from 'react'` 제거 (Fcst.tsx, FcstFooter.tsx) |
| 2025-03-04 | 7번 활용안 전부 적용: aria-label, weatherPalette, FcstResponse 타입 |
