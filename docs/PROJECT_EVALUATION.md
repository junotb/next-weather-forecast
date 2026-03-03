# 프로젝트 평가 및 개선점 검토

> 작성일: 2025년 3월 4일  
> 프로젝트: next-weather-forecast  
> 대상: 전체 코드베이스, 아키텍처, 문서화, 품질

---

## 1. Executive Summary

| 구분 | 평가 | 요약 |
|------|------|------|
| **전반적 품질** | 양호 | Next.js 16·React 19 기반 구조가 잘 잡혀 있으며, 타입/문서화가 체계적임 |
| **강점** | ⭐⭐⭐⭐ | App Router, Server Actions, Context 패턴, 문서화, UI 개선 이력 |
| **개선 필요** | ⚠️ | 캐시 미동작, 테스트 부재, 지역 고정, API 유연성 부족 |
| **우선순위** | P1~P3 | P1: 캐시 수정, P2: 테스트·SSR 검토, P3: 지역·base_time 확장 |

---

## 2. 프로젝트 개요

### 2.1 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 16.1.6, React 19.2.4 |
| **언어** | TypeScript 5 |
| **스타일** | Tailwind CSS v4, clsx |
| **UI** | HeroUI, Framer Motion, Lucide React |
| **데이터** | 기상청 단기예보 API, localforage (IndexedDB) |
| **빌드** | webpack (next build --webpack) |

### 2.2 주요 기능

- 단기 예보 조회 (시간별 48시간)
- 날씨 유형별 배경 팔레트 (낮/밤 × 맑음/흐림/비/눈 등)
- 글래스모피즘 UI
- 로딩/에러/Empty State 처리
- 지역 추가 모달 UI (추가 기능 미완성)

---

## 3. 강점 (Strengths)

### 3.1 아키텍처 및 구조

| 항목 | 상세 |
|------|------|
| **폴더 구조** | `src/` 기반, app·components·contexts·lib·types 분리 명확 |
| **기능별 그룹핑** | `components/fcst/`, `fcst/utils/` 등 도메인 중심 구조 |
| **Path alias** | `@/*` → `./src/*` 사용 |
| **타입 정의** | `fcst.d.ts`로 API 관련 타입 중앙 관리 |

### 3.2 Next.js 활용

| 항목 | 상세 |
|------|------|
| **App Router** | layout·page·loading·error 구조 준수 |
| **Server Actions** | `fcst.ts`의 `requestFcst()`로 API 키 서버 전용 처리 |
| **메타데이터** | metadata·viewport export |
| **폰트** | `next/font` Noto Sans KR |

### 3.3 코드 품질

| 항목 | 상세 |
|------|------|
| **TypeScript** | strict 모드, FcstResponse/FcstInstance 등 타입 활용 |
| **Context + 훅** | `useFcstContext`, `useModal`로 Provider 누락 시 예외 처리 |
| **불필요 import 제거** | React 자동 JSX 런타임 기준 React import 제거 완료 |

### 3.4 UI/UX

| 항목 | 상세 |
|------|------|
| **날씨 팔레트** | `WEATHER_PALETTE` day/night × weatherType 적용 |
| **반응형** | min-h-dvh, 모바일 우선 레이아웃 |
| **접근성** | `aria-label`, convertFcstCategory 기반 aria-label 활용 |
| **에러 처리** | error.tsx, toUserFriendlyMessage 적용 |

### 3.5 문서화

| 문서 | 용도 |
|------|------|
| `ROADMAP_DECISIONS.md` | API 가이드, 지역 추가, 에러 메시지, 색상 팔레트 등 의사결정 |
| `NEXTJS_TYPESCRIPT_PATTERNS_REVIEW.md` | Next.js·TS 패턴 점검 및 적용 이력 |
| `UI_IMPROVEMENT_OPTIONS.md` | 타 앱 참고, 개선 옵션 A~D, 적용 이력 |
| `UNUSED_CODE_REVIEW.md` | 미사용 export·파일 검토, 활용 방안 |

---

## 4. 개선점 (Improvement Points)

### 4.1 P1: 캐시 미동작 (Critical)

**현상**: `getAllForecastData()`에서 캐시가 비어 있을 때 `requestFcst()`로 데이터를 가져오지만, **IndexedDB에 저장하지 않음**.

```ts
// localforage.ts - 현재 동작
if (forecasts.length === 0) {
  const newForecasts = await requestFcst();
  if (!newForecasts) throw new Error("...");
  forecasts.push(...newForecasts);  // 메모리에만 추가
  // localforage.setItem 호출 없음 → 새로고침 시 매번 API 재호출
}
return forecasts;
```

**영향**: 매 페이지 새로고침마다 API 호출 → 호출 횟수 증가, 사용자 경험 저하.

**권장 수정**:
```ts
if (forecasts.length === 0) {
  const newForecasts = await requestFcst();
  if (!newForecasts) throw new Error("...");
  // 각 인스턴스를 localforage에 저장
  for (const fcst of newForecasts) {
    const key = `${fcst.nx}_${fcst.ny}_${fcst.fcstDate}_${fcst.fcstTime}`;
    await localforage.setItem(key, fcst);
  }
  forecasts.push(...newForecasts);
}
```

**추가**: 캐시 TTL(예: 1시간) 도입 권장. 기상청 API는 3시간마다 갱신되므로, 만료 시점에 재요청 로직 필요.

---

### 4.2 P1: saveForecastData 로직 오류

**현상**: `saveForecastData()`가 `clear()` 후 1건만 저장. 다중 지역 지원 시 기존 데이터 전체 삭제됨.

**권장**: `clear()` 대신 해당 키만 덮어쓰기. 다중 지역 구조 도입 시 `ROADMAP_DECISIONS.md` 1.3절 구조 변경 참고.

---

### 4.3 P2: 테스트 부재

**현상**: `*.test.ts`, `*.spec.ts`, Jest/Vitest 설정 없음.

**권장**:
- 단위: `util.ts` (formatHour, convertFcst*), `getWeatherType`, `getTimeOfDay`
- 통합: `requestFcst()` mock 기반, `transformFcstResponseItems`
- E2E: Playwright로 메인 플로우 검증 (선택)

---

### 4.4 P2: 지역 하드코딩

**현상**: `fcst.ts`에서 `nx: 60`, `ny: 127` 고정 (서울 일부 지역).

**권장**: `ROADMAP_DECISIONS.md` 1.2~1.4절 구조 변경 적용. `locations` 스토어, `currentLocationIndex`, `forecastByLocation` 도입.

---

### 4.5 P2: base_time 단일 사용

**현상**: `base_time: '0500'` 고정. API는 02/05/08/11/14/17/20/23시 8회 제공.

**권장**: KST 기준 현재 시각에 맞는 `base_time` 선택 로직 추가. 02:10 이전 → 23:00, 05:10 이전 → 02:00 등.

---

### 4.6 P2: SSR 초기 데이터

**현상**: 현재는 클라이언트 `useEffect`에서만 데이터 로딩. 초기 HTML에 데이터 없음.

**권장** (선택): `page.tsx`에서 `requestFcst()` 호출 후 `FcstProvider`에 `initialData` 전달. LCP 개선 가능. 단, IndexedDB와의 동기화 전략 필요.

---

### 4.7 P3: README 정비

**현상**: create-next-app 기본 README 유지. 프로젝트 설명·실행 방법·환경 변수 등 없음.

**권장**:
- 프로젝트 소개·기능
- `npm run dev`, `API_KEY_DEC` 등 설정 안내
- 기존 docs 링크

---

### 4.8 P3: FcstFooter

**현상**: 내용 없이 `<footer>`만 렌더링.

**권장**: ROADMAP에 따라 Nav 필요 시 활용. 당장은 유지해도 무방.

---

### 4.9 P3: 에러 피드백

**현상**: `getAllForecastData()` 실패 시 `[]` 반환. `requestFcst()` 실패 시 `undefined` 반환. 사용자에게 "네트워크 오류" 등 명시적 안내 없음.

**권장**: `ROADMAP_DECISIONS.md` 4번 에러 메시지 매핑 적용. `FcstContext`에 `error` 상태 추가, `FcstEmptyState`에서 안내 노출.

---

### 4.10 P3: 환경 변수 검증

**현상**: `API_KEY_DEC` 없을 때 런타임에서만 오류 발생.

**권장**: `requestFcst()` 초기에 `if (!API_KEY_DEC) throw new Error('API_KEY_DEC 미설정')` 추가 또는 빌드 시 검증.

---

## 5. 개선 우선순위 매트릭스

| 우선순위 | 항목 | 영향 | 난이도 | 예상 공수 |
|:--------:|------|------|--------|-----------|
| **P1** | 캐시 저장 로직 수정 | 높음 | 낮음 | 0.5일 |
| **P1** | saveForecastData clear 제거 | 높음 | 중간 | 0.5일 |
| **P2** | 단위 테스트 도입 | 중간 | 중간 | 1~2일 |
| **P2** | 지역 선택/다중 지역 구조 | 높음 | 높음 | 3~5일 |
| **P2** | base_time 동적 선택 | 중간 | 낮음 | 0.5일 |
| **P2** | SSR 초기 데이터 (선택) | 중간 | 중간 | 1일 |
| **P3** | README 정비 | 낮음 | 낮음 | 0.5일 |
| **P3** | 에러 상태·메시지 개선 | 중간 | 낮음 | 0.5일 |
| **P3** | API_KEY_DEC 검증 | 낮음 | 낮음 | 0.1일 |

---

## 6. 종합 평가

### 6.1 점수 (5점 만점)

| 영역 | 점수 | 비고 |
|------|:----:|------|
| 아키텍처 | 4.0 | 구조·분리 양호, 지역 구조 보완 필요 |
| 코드 품질 | 4.0 | 타입·패턴 양호, 테스트 부재 |
| 문서화 | 4.5 | docs 체계적, README만 보완 |
| UI/UX | 4.0 | 팔레트·글래스 적용, 세부 개선 여지 |
| 안정성 | 3.0 | 캐시 미동작, 에러 피드백 부족 |

**종합: 3.9 / 5.0**

### 6.2 핵심 권장 사항

1. **즉시**: `getAllForecastData()`에서 fetched 데이터를 localforage에 저장.
2. **단기**: `saveForecastData` clear 로직 수정, base_time 동적 선택.
3. **중기**: 단위 테스트, 에러 상태·메시지 개선, README 정비.
4. **장기**: 다중 지역 구조 전환, SSR 초기 데이터 검토.

---

## 7. 적용 이력

| 일자 | 항목 | 내용 |
|------|------|------|
| 2025-03-04 | 4.1 | 기상청 API 갱신 주기 기반 캐시 TTL 도입 (getNextApiUpdateTime, fcstUtils) |
| 2025-03-04 | 4.2, 4.4 | 다중 지역 구조 도입 (FcstLocation, locations 스토어, forecastByLocation, addLocation, removeLocation) |
| 2025-03-04 | 4.3 | Vitest 단위 테스트 추가 (util, weatherPalette, fcstUtils) |
| 2025-03-04 | 4.5 | base_time 동적 선택 (getBaseTimeAndDate, API 제공 시각 기반) |
| 2025-03-04 | 4.7 | README 정비 (프로젝트 소개, 실행 방법, 환경 변수, 문서 링크) |
| 2025-03-04 | 4.8 | FcstFooter 권장 내용 반영 (저작권 표시, aria-label) |

---

## 8. 참고 문서

- [docs/ROADMAP_DECISIONS.md](./ROADMAP_DECISIONS.md) - API·지역·에러·색상 의사결정
- [docs/NEXTJS_TYPESCRIPT_PATTERNS_REVIEW.md](./NEXTJS_TYPESCRIPT_PATTERNS_REVIEW.md) - Next.js·TS 패턴
- [docs/UI_IMPROVEMENT_OPTIONS.md](./UI_IMPROVEMENT_OPTIONS.md) - UI 개선 옵션
- [docs/UNUSED_CODE_REVIEW.md](./UNUSED_CODE_REVIEW.md) - 미사용 코드 검토
