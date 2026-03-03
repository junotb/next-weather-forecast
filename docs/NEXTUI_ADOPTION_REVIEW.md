# NextUI(HeroUI) 컴포넌트 도입 검토

> 검토일: 2025년 3월 4일  
> 프로젝트: next-weather-forecast  
> 참고: NextUI는 HeroUI로 리브랜딩됨 (공식 문서: nextui.org, heroui.com)

---

## 1. Executive Summary

| 항목 | 상태 | 비고 |
|------|------|------|
| **호환성** | ✅ 양호 | Next.js 16, React 19, Tailwind v4 조건 충족 |
| **도입 효과** | 높음 | Modal, Button, Card, Input 등 8개+ 컴포넌트 매핑 가능 |
| **추가 의존성** | Framer Motion, Lucide | HeroUI peer dependency; bootstrap-icons → Lucide 대체 |
| **권장 전략** | 점진적 도입 | 핵심 UI부터 순차 적용 |

---

## 2. 환경 호환성

### 2.1 HeroUI 요구 사항 vs 현재 프로젝트

| 요구 사항 | 최소 버전 | 현재 프로젝트 | 상태 |
|-----------|-----------|---------------|------|
| Next.js | 12+ | 16.1.6 | ✅ |
| React | 18+ | 19.2.4 | ✅ |
| Tailwind CSS | v4 | v4.2.1 | ✅ |
| Framer Motion | 11.9+ | 없음 | ⚠️ **추가 필요** |

### 2.2 HeroUI 버전 참고

- **HeroUI v2** (현재 안정): `@heroui/react` – nextui.org 문서 기준
- **HeroUI v3**: 신규 프로젝트 권장 (v3.heroui.com)
- 본 문서는 v2 기준으로 작성 (문서·예제 풍부)

---

## 3. 현재 컴포넌트 → HeroUI 매핑

### 3.1 매핑 개요

| 현재 컴포넌트 | HeroUI 대체 | 우선순위 | 효과 |
|---------------|-------------|:--------:|------|
| **Modal** | `Modal` | 1 | 접근성, 애니메이션, 스타일 통일 |
| **FcstHeader 버튼** | `Button` (isIconOnly) | 1 | 아이콘 버튼, 호버/포커스 |
| **Modal 내 Input/Button** | `Input`, `Button` | 1 | 폼 스타일, validation |
| **FcstTodayCard** | `Card` | 2 | 카드 레이아웃, 섀도우 |
| **FcstTemperatureBar 컨테이너** | `Card` | 2 | 섹션 구분, 스타일 일관 |
| **FcstTemperatureCard** | `Card` 또는 `Chip` | 2 | 시간별 예보 카드 |
| **loading.tsx** | `Spinner` | 1 | 로딩 UI 표준화 |
| **error.tsx** | `Button`, `Alert` | 2 | 에러 UI 개선 |
| **DraggableScroll** | `ScrollShadow` (참고) | 3 | 스크롤 끝단 그림자 (Drag는 유지) |

### 3.2 상세 매핑

#### 3.2.1 Modal (`src/components/Modal.tsx`)

**현재**: 커스텀 Context 기반 모달, 기본 오버레이 + div 레이아웃

**HeroUI Modal**:
- `Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter` 컴포지션
- React Aria 기반 접근성 (포커스 트랩, Esc, 역할)
- Framer Motion 애니메이션
- `isOpen`, `onOpenChange`로 제어

**마이그레이션 시**: 기존 `ModalContext`와 `useModal` 훅을 HeroUI Modal과 연결하거나, HeroUI `useDisclosure`로 점진적 교체

---

#### 3.2.2 FcstHeader (`src/components/fcst/FcstHeader.tsx`)

**현재**: 네이티브 `<button>`, `<input>`

**HeroUI**:
- **Button** (isIconOnly): 플러스 아이콘 버튼 → `Button` + Lucide `Plus`
- **Input**: 지역 검색/추가용
- **Button**: "추가" 버튼

---

#### 3.2.3 FcstTodayCard / FcstTemperatureCard

**현재**: `section`, `div` + Tailwind (bg-gray-200/10, rounded-xl 등)

**HeroUI Card**:
- `Card`, `CardHeader`, `CardBody`, `CardFooter` 컴포지션
- `shadow`, `radius` 등 variant
- 기존 날씨 아이콘·텍스트는 유지, 레이아웃만 Card로 교체

---

#### 3.2.4 loading.tsx

**현재**: 커스텀 `animate-spin` div

**HeroUI Spinner**:
- `size`, `color` 등 옵션
- Tailwind와 통합된 스타일

---

#### 3.2.5 error.tsx

**현재**: 커스텀 스타일 `button`

**HeroUI**:
- **Alert**: 에러 메시지 표현
- **Button**: "다시 시도" 버튼

---

#### 3.2.6 DraggableScroll

**현재**: 마우스 드래그로 가로 스크롤하는 커스텀 컴포넌트

**HeroUI ScrollShadow**:
- 스크롤 끝에 그라데이션 그림자
- **드래그 스크롤 기능은 HeroUI에 없음** → `DraggableScroll` 유지하고, 필요 시 `ScrollShadow`로 감싸 스타일만 보강

---

## 4. 설치 및 설정

### 4.0 빌드 참고
- Next.js 16 + Turbopack 기본 사용 시 HeroUI와 `createContext` 호환 이슈가 있을 수 있음
- 이 경우 `next build --webpack`으로 빌드 (package.json의 build 스크립트에 반영됨)

### 4.1 패키지 설치

```bash
# HeroUI + Framer Motion (peer dependency) + Lucide 아이콘
npm install @heroui/react framer-motion lucide-react

# bootstrap-icons 제거 (Lucide로 대체)
# npm uninstall bootstrap-icons

# 또는 CLI로 개별 컴포넌트만 설치 (권장)
npx heroui-cli@latest add button modal input card spinner
```

### 4.2 Tailwind v4 설정

프로젝트는 이미 Tailwind v4 + `@tailwindcss/postcss`를 사용 중.

**1) `src/lib/hero.ts` 생성** (HeroUI Tailwind 플러그인):

```ts
import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#0ea5e9",  // sky-500
          foreground: "#ffffff",
        },
      },
    },
  },
});
```

**2) `globals.css` 수정**:

```css
@import "tailwindcss";
@plugin "./src/lib/hero";  /* hero.ts 경로에 맞게 조정 */

@theme {
  /* 기존 @theme 유지 */
}
```

### 4.3 Provider 설정

**`src/app/providers.tsx`** 생성:

```tsx
'use client';

import { HeroUIProvider } from '@heroui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
```

**`src/app/layout.tsx`** 수정:

```tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 5. 도입 단계별 로드맵

### Phase 1: 기반 구축 (1일)
1. `@heroui/react`, `framer-motion`, `lucide-react` 설치 / `bootstrap-icons` 제거
2. `hero.ts` + `globals.css` 설정
3. `HeroUIProvider` 적용
4. `loading.tsx` → `Spinner` 교체

### Phase 2: 핵심 UI (2–3일)
1. `Modal` → HeroUI `Modal` 교체
2. FcstHeader `Button` → HeroUI `Button` (isIconOnly)
3. FcstHeader 내 `Input`, `Button` → HeroUI 컴포넌트

### Phase 3: 카드/레이아웃 (2일)
1. `FcstTodayCard` → HeroUI `Card`
2. `FcstTemperatureBar` 컨테이너 → `Card`
3. `FcstTemperatureCard` → `Card` 또는 `Chip`

### Phase 4: 에러/기타 (1일)
1. `error.tsx` → `Alert` + `Button`
2. `ScrollShadow` 적용 검토 (선택)

---

## 6. 장단점 및 고려사항

### 6.1 장점
- **접근성**: React Aria 기반 키보드, 스크린 리더 지원
- **일관성**: 버튼, 입력, 카드 등 공통 디자인 시스템
- **애니메이션**: Framer Motion 기반 전환 효과
- **Tailwind 통합**: 유틸리티 클래스로 오버라이드 용이
- **번들**: 개별 컴포넌트 설치로 Tree-shaking 가능

### 6.2 고려사항
- **Framer Motion 의존성**: 허용. HeroUI 필수 peer dependency로 추가 (번들 크기 증가는 수용)
- **bootstrap-icons 제거**: Lucide 아이콘으로 대체. HeroUI와 동일한 아이콘 라이브러리 사용으로 일관성 확보
- **커스텀 스타일**: theme/className 오버라이드로 적용. 날씨 앱 전용 그라데이션(sky-400 → sky-200) 등은 Tailwind 유틸리티 클래스로 오버라이드

### 6.3 Lucide 아이콘 사용
- HeroUI 컴포넌트와 동일하게 Lucide 아이콘 사용
- `Button`의 `startContent`/`endContent`에 `<Plus />` 등 Lucide 아이콘 컴포넌트 전달

---

## 7. 참고 문서

- [HeroUI Next.js 가이드](https://nextui.org/docs/frameworks/nextjs)
- [HeroUI Tailwind v4 가이드](https://nextui.org/docs/guide/tailwind-v4)
- [HeroUI 컴포넌트 목록](https://nextui.org/docs/components/button)
- [HeroUI Modal](https://nextui.org/docs/components/modal)
- [HeroUI Card](https://nextui.org/docs/components/card)
- [HeroUI Spinner](https://nextui.org/docs/components/spinner)

---

## 8. 요약

| 구분 | 내용 |
|------|------|
| **도입 권장** | ✅ 조건 충족, 점진적 도입 적합 |
| **추가 패키지** | `@heroui/react`, `framer-motion`, `lucide-react` (bootstrap-icons 제거) |
| **우선 교체** | Modal, Button, Input, Spinner(loading), Card |
| **유지** | DraggableScroll(드래그 스크롤), ModalContext(또는 useDisclosure로 전환) |
