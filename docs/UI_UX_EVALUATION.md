# UI/UX 평가 및 개선사항 분석

> 평가일: 2025년 3월 4일  
> 프로젝트: next-weather-forecast  
> 기준: Next.js, HeroUI(NextUI), TypeScript, Tailwind CSS

---

## 1. Executive Summary

| 구분 | 현재 상태 | 평가 |
|------|-----------|------|
| **기술 스택 통합** | 양호 | Next.js 16 + HeroUI + Tailwind v4 + TypeScript 적용 |
| **시각적 일관성** | 양호 | sky 계열 그라데이션, HeroUI 컴포넌트 통일 |
| **접근성** | 부분적 | HeroUI 기반 개선됐으나 보완 필요 |
| **반응형** | 미흡 | sm:w-md만 사용, 모바일 최적화 부족 |
| **UX 피드백** | 부분적 | 로딩/에러 있음, 상호작용 피드백 부족 |

---

## 2. 기술 스택 평가

### 2.1 Next.js

| 항목 | 상태 | 비고 |
|------|------|------|
| App Router | ✅ | app/ 디렉터리 구조 |
| Server/Client 분리 | ✅ | 'use client' 적절히 사용 |
| loading.tsx | ✅ | HeroUI Spinner로 로딩 UI |
| error.tsx | ✅ | HeroUI Alert + Button |
| metadata | ⚠️ | title, description만 있음, viewport 미설정 |
| Font Optimization | ✅ | Noto Sans KR (font-display: swap) |

**개선 제안**
- `viewport` 메타 태그: 모바일 최적화를 위해 `layout.tsx`에 viewport export 추가
- `generateMetadata` 또는 동적 metadata: 페이지별 SEO 강화

### 2.2 HeroUI (NextUI)

| 항목 | 상태 | 비고 |
|------|------|------|
| Button | ✅ | FcstHeader, Modal |
| Input | ✅ | 지역 추가 모달 |
| Card | ✅ | FcstTodayCard, FcstTemperatureBar, FcstTemperatureCard |
| Modal | ✅ | HeroUI Modal |
| Spinner | ✅ | loading.tsx |
| Alert | ✅ | error.tsx |
| 테마 커스터마이징 | ✅ | primary: sky-500 |

**개선 제안**
- Modal: `placement` 조정 (모바일 bottom, 데스크톱 center)
- Input: `autoFocus`로 모달 열림 시 포커스 자동 이동
- Card: `isPressable` 또는 호버 피드백으로 인터랙션 강화 검토

### 2.3 TypeScript

| 항목 | 상태 | 비고 |
|------|------|------|
| 컴포넌트 Props | ✅ | 대부분 타입 정의 |
| FcstInstance | ✅ | fcst.d.ts |
| Context | ⚠️ | ModalContext 타입 있으나 제네릭 활용 부족 |
| Strict Mode | 확인 필요 | tsconfig strict 옵션 |

**개선 제안**
- `ReactNode` 대신 구체적 children 타입 where possible
- Modal `children` prop에 React.ReactNode 외 타입 제한 검토

### 2.4 Tailwind CSS v4

| 항목 | 상태 | 비고 |
|------|------|------|
| 유틸리티 클래스 | ✅ | 일관된 사용 |
| 커스텀 테마 | ✅ | @theme, HeroUI 플러그인 |
| 반응형 | ⚠️ | sm: 만 사용, md/lg/xl 활용 적음 |
| dark mode | 미적용 | html class 기반 테마 전환 없음 |

**개선 제안**
- `bg-linear-to-b` → `bg-gradient-to-b` (Tailwind v4 문법 확인)
- Container queries: 시간별 예보 카드 그리드에 검토
- `prefers-reduced-motion`: 접근성 고려

---

## 3. 레이아웃 및 시각 구조

### 3.1 현재 구조

```
page.tsx (main)
  └─ Fcst (relative, sm:w-md)
       ├─ FcstHeader (absolute top)
       ├─ FcstContent (py-16, bg-linear-to-b from-sky-400 to-sky-200)
       │    ├─ FcstTodayCard
       │    └─ FcstTemperatureBar
       │         └─ DraggableScroll → FcstTemperatureCard[]
       └─ FcstFooter (absolute bottom, 비어있음)
```

### 3.2 시각적 계층

| 요소 | 스타일 | 평가 |
|------|--------|------|
| 배경 | sky-400 → sky-200 그라데이션 | ✅ 날씨 앱에 적합 |
| 카드 | bg-gray-200/10, shadow-xl | ✅ 가독성 양호 |
| 텍스트 | text-white | ✅ 대비 양호 (배경 대비) |
| 헤더/푸터 | absolute, h-16 | ⚠️ 콘텐츠와 겹침 가능 |

### 3.3 개선 제안

1. **FcstFooter**: 현재 비어있음 → 현재 위치 정보, 설정 링크 등 활용
2. **Safe Area**: 모바일 노치/홈 인디케이터 대응 `env(safe-area-inset-*)`
3. **FcstContent padding**: `py-16`이 헤더/푸터 높이와 맞는지 검증 (h-16 × 2 = 8rem)

---

## 4. 접근성(Accessibility)

### 4.1 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| aria-label | ✅ | FcstHeader Button "지역 추가" |
| 키보드 포커스 | ⚠️ | HeroUI 기본 지원, DraggableScroll 마우스 전용 |
| 스크린 리더 | ⚠️ | 의미적 라벨 부족 (오늘 날씨, 시간별 예보) |
| 색상 대비 | ✅ | white on sky 배경 (WCAG AA 충족) |
| 포커스 링 | ⚠️ | HeroUI 기본, 커스텀 오버라이드 확인 |
| lang="ko" | ✅ | layout.tsx |

### 4.2 개선 제안

1. **시맨틱 구조**
   - FcstTodayCard: `<section aria-label="오늘 날씨">`
   - FcstTemperatureBar: `<section aria-label="시간별 예보">`
   - FcstHeader: `<header>` 사용 중 ✅

2. **DraggableScroll**
   - 터치 스와이프는 기본 스크롤로 동작할 수 있음
   - 키보드: 좌우 화살표로 스크롤 가능하게 할지 검토
   - `role="region"` + `aria-label="시간별 예보 목록"`

3. **로딩 상태**
   - `aria-live="polite"` + "날씨 정보 불러오는 중" 텍스트

4. **에러 화면**
   - Alert에 `role="alert"` (HeroUI 기본 제공 여부 확인)

---

## 5. 반응형 및 모바일 UX

### 5.1 현재 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| viewport meta | ⚠️ | Next.js 기본값 의존 |
| max-width | sm:w-md (28rem) | 데스크톱에서 좁은 카드 |
| 터치 타겟 | ⚠️ | Button size-12 (48px) ✅, FcstTemperatureCard min-w-14 (56px) |
| DraggableScroll | ✅ | 마우스 드래그 + 터치 스와이프(브라우저 기본) |
| 가로 스크롤 | ✅ | overflow-x-auto |

### 5.2 개선 제안

1. **viewport**
   ```tsx
   // layout.tsx
   export const viewport = { width: 'device-width', initialScale: 1 };
   ```

2. **반응형 브레이크포인트**
   - 모바일: 카드 전체 너비
   - 태블릿: max-w-lg
   - 데스크톱: max-w-xl 또는 고정 너비

3. **스와이프 힌트**
   - 시간별 예보 처음 로드 시 "← 스와이프" 안내 (일회성)
   - ScrollShadow로 끝단 그라데이션 추가 (문서 Phase 4)

4. **Pull-to-refresh**
   - 모바일에서 아래로 당겨 새로고침 검토

---

## 6. UX 패턴 분석

### 6.1 로딩 상태

| 항목 | 평가 |
|------|------|
| Spinner + 텍스트 | ✅ 명확 |
| 전체 화면 차지 | ✅ 적절 |
| 배경색 일관성 | ✅ sky-200 |

### 6.2 에러 상태

| 항목 | 평가 |
|------|------|
| Alert + 재시도 버튼 | ✅ 복구 경로 제공 |
| error.message 노출 | ⚠️ 사용자 친화적 메시지로 변환 권장 |
| 로깅 | ✅ useEffect로 console.error |

### 6.3 모달 UX

| 항목 | 평가 |
|------|------|
| 제목/본문/푸터 | ✅ 구조적 |
| 닫기 버튼 | ✅ 제공 |
| 오버레이 클릭 | HeroUI 기본 (isDismissable) |
| Input 제출 | ⚠️ "추가" 클릭 시 동작 없음 (핸들러 미연결) |

### 6.4 데이터 표시

| 항목 | 평가 |
|------|------|
| opacity 전환 | ✅ 700ms ease-in-out 부드러움 |
| 최고/최저/현재 | ✅ 명확한 레이블 |
| 시간별 카드 | ✅ period(오전/오후) + hour |

### 6.5 개선 제안

1. **Empty State**: fcstData가 없을 때 "예보 데이터가 없습니다" + 안내
2. **Modal 폼 연동**: onSubmit, 지역 목록 표시
3. **낙관적 UI**: 추가 버튼 클릭 시 로딩 스피너 또는 비활성화

---

## 7. 스타일 일관성

### 7.1 색상 시스템

| 용도 | 값 | 비고 |
|------|-----|------|
| Primary | #0ea5e9 (sky-500) | HeroUI theme |
| 배경 그라데이션 | sky-400 → sky-200 | FcstContent |
| 카드 배경 | gray-200/10 | 반투명 |
| 텍스트 | white | 일관됨 |

### 7.2 간격 및 타이포그래피

| 요소 | 값 |
|------|-----|
| 헤더/푸터 높이 | h-16 (4rem) |
| 카드 간격 | gap-2 |
| 패딩 | px-2, py-4, px-4 |

### 7.3 globals.css 이슈

```css
html, body { font-family: Arial, Helvetica, sans-serif; }
```

- `body`에 `notoSansKR.className`을 적용했으나 globals.css에서 Arial로 덮어씀
- **수정**: globals.css의 font-family 제거 또는 body 우선순위 확인

---

## 8. 우선순위별 개선 로드맵

### P0 (즉시)

1. **globals.css font-family**: Noto Sans KR과 충돌 해결
2. **Modal "추가" 버튼**: 핸들러 연결 또는 placeholder 안내
3. **viewport**: layout에 viewport export 추가

### P1 (단기)

1. **시맨틱/ARIA**: section aria-label, role 보강
2. **Empty State**: 데이터 없을 때 UI
3. **에러 메시지**: 사용자 친화적 변환

### P2 (중기)

1. **FcstFooter 활용**: 현재 위치, 설정 등
2. **ScrollShadow**: 시간별 예보 스크롤 끝단 시각적 피드백
3. **반응형 브레이크포인트** 세분화

### P3 (장기)

1. **다크 모드**: theme 전환
2. **prefers-reduced-motion**: 애니메이션 축소
3. **Pull-to-refresh** (모바일)

---

## 9. 참고 문서

- [Next.js Accessibility](https://nextjs.org/docs/architecture/accessibility)
- [HeroUI Components](https://nextui.org/docs/components/button)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
