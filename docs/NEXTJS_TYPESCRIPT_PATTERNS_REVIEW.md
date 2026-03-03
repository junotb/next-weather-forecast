# Next.js & TypeScript 권장 패턴 검토 보고서

> 검토일: 2025년 3월 3일  
> 프로젝트: next-weather-forecast  
> Next.js 16 / React 19 / TypeScript 5

---

## 1. Executive Summary

| 항목 | 상태 | 비고 |
|------|------|------|
| App Router 구조 | ✅ 양호 | 단일 페이지, 적절한 layout 구조 |
| 폴더 구조 | ✅ 양호 | src 패턴, 권장 계층 준수 (일부 보완 권장) |
| Server/Client 구분 | ✅ 양호 | Modal에 `'use client'` 추가 완료 |
| TypeScript 설정 | ✅ 양호 | strict 모드 활성화, path alias 사용 |
| 데이터 페칭 | ⚠️ 개선 권장 | Client-first → Server-first 전환 검토 |
| 타입 정의 | ✅ 양호 | `fcst.d.ts`로 API 타입 중앙 관리 |
| 메타데이터 | ✅ 양호 | Root layout에 metadata export |

---

## 2. 상세 검토

### 2.1 TypeScript 설정 (`tsconfig.json`)

**✅ 잘 적용된 점**

- **`strict: true`** – 엄격 모드로 타입 안정성 확보
- **`paths: { "@/*": ["./src/*"] }`** – 경로 별칭으로 import 가독성 향상
- **`jsx: "react-jsx"`** – React 자동 런타임 (Next.js 권장)
- **`moduleResolution: "bundler"`** – Next.js 번들러와 호환
- **`isolatedModules: true`** – Turbopack/SWC와 호환

**개선 제안**

```json
// target을 ES2022로 상향 시 현대 브라우저 최적화 가능 (선택사항)
"target": "ES2022"
```

---

### 2.2 폴더 구조 (Next.js & TypeScript 권장 패턴)

#### 현재 프로젝트 구조

```
next-weather-forecast/
├── .env.local              ← 루트 (권장 ✅)
├── next.config.ts          ← 루트 (권장 ✅)
├── package.json            ← 루트 (권장 ✅)
├── tsconfig.json           ← 루트 (권장 ✅)
├── eslint.config.mjs       ← 루트 (권장 ✅)
├── postcss.config.mjs      ← 루트 (권장 ✅)
├── public/                 ← 정적 에셋 (권장 ✅)
├── docs/
└── src/                    ← 애플리케이션 소스 (권장 ✅)
    ├── app/                ← App Router
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/         ← 공통 컴포넌트
    │   ├── DraggableScroll.tsx
    │   ├── Modal.tsx
    │   └── fcst/          ← 기능별 서브폴더 (Feature-based)
    │       ├── Fcst*.tsx
    │       └── utils/     ← 기능 내 유틸
    ├── constants/
    ├── contexts/
    ├── lib/                ← Server Actions, 유틸 (Next.js 권장)
    └── types/              ← 타입 선언 (.d.ts)
```

#### ✅ 잘 적용된 점

| 항목 | Next.js 권장 | 현재 상태 |
|------|--------------|-----------|
| **src 폴더** | app, components, lib 등을 src에 배치 지원 | ✅ `src/` 하위에 소스 일괄 배치 |
| **설정 파일** | package.json, next.config, tsconfig는 루트 유지 | ✅ 루트에 위치 |
| **환경 변수** | .env.* 파일은 루트 유지 | ✅ `.env.local` 루트 |
| **tsconfig paths** | `@/*` 사용 시 `./src/*` 포함 | ✅ `"@/*": ["./src/*"]` |
| **app 디렉터리** | layout, page, globals.css | ✅ `layout.tsx`, `page.tsx`, `globals.css` |
| **favicon** | app 내 favicon.ico 지원 | ✅ `src/app/favicon.ico` |
| **기능별 그룹핑** | components/lib 등 도메인별 분리 | ✅ `fcst/`, `utils/` |
| **타입 분리** | TypeScript 타입 선언 분리 | ✅ `src/types/fcst.d.ts` |

#### ✅ 보완 권장 적용 완료

| 항목 | 권장 사항 | 적용 상태 |
|------|-----------|-----------|
| **public 폴더** | 정적 에셋용 루트 `public/` | ✅ 생성 완료 |
| **로딩/에러 UI** | `loading.tsx`, `error.tsx` | ✅ 추가 완료 |
| **lib 폴더** | Next.js 예제에서 `lib` 사용 | ✅ `libs` → `lib` 변경 완료 |

#### 참고: Next.js Top-level 컨벤션

- **필수/권장 루트**: `app` 또는 `src/app`, `package.json`, `tsconfig.json`, `next.config.*`
- **선택 루트**: `public/`, `instrumentation.ts`, `proxy.ts`
- **루트 유지**: `.env.*`, config 파일들

---

### 2.3 Next.js 설정 (`next.config.ts`)

**✅ 잘 적용된 점**

- `NextConfig` 타입으로 타입 안전성 확보
- ESM `export default` 사용

---

### 2.4 App Router 구조

**✅ 잘 적용된 점**

```
src/app/
├── layout.tsx    ← Root Layout (메타데이터, 폰트)
├── page.tsx      ← Home 페이지
├── loading.tsx   ← 로딩 UI (Suspense)
├── error.tsx     ← 에러 바운더리
└── globals.css
```

- **Layout** – `children`을 `Readonly<>`로 감싸 불변성 명시
- **Metadata** – `title`, `description` export로 SEO 대응
- **폰트** – `next/font`의 `Noto_Sans_KR` 사용 (권장 방식)

---

### 2.5 Server Components vs Client Components

**현재 구조 요약**

| 파일 | 'use client' | 용도 | 평가 |
|------|:------------:|------|------|
| Fcst.tsx | ❌ | Provider 조합 | ✅ SC로 유지 적절 |
| FcstContent.tsx | ❌ | 레이아웃 | ✅ SC 적절 |
| FcstHeader.tsx | ✅ | useModal, onClick | ✅ CC 필요 |
| FcstFooter.tsx | ✅ | (현재 로직 없음) | ⚠️ 불필요할 수 있음 |
| FcstTodayCard.tsx | ✅ | useFcstContext, useState | ✅ CC 필요 |
| FcstTemperatureBar.tsx | ✅ | useFcstContext, useState | ✅ CC 필요 |
| FcstTemperatureCard.tsx | ❌ | props만 사용 | ✅ SC로 OK (CC 하위에서 렌더) |
| Modal.tsx | ✅ | useModal 사용 | ✅ 'use client' 추가 완료 |
| FcstContext.tsx | ✅ | useContext, useState | ✅ CC 필요 |
| ModalContext.tsx | ✅ | useContext, useState | ✅ CC 필요 |
| DraggableScroll.tsx | ✅ | useRef, useState | ✅ CC 필요 |
| localforage.ts | ✅ | 브라우저 API | ✅ CC 필요 |

**적용 완료**

1. **`Modal.tsx`** – `'use client'` 추가 완료 ✅

2. **`FcstFooter.tsx`** – 현재 클라이언트 전용 기능 없음. 향후 이벤트 핸들러가 추가되면 `'use client'` 유지, 그렇지 않으면 제거 검토

---

### 2.6 데이터 페칭 패턴

**현재 흐름**

```
[Client] FcstContext useEffect
    → getAllForecastData() (localforage - IndexedDB)
        → 캐시 없음 시 requestFcst() (Server Action) 호출
```

**현재 방식의 장점**

- IndexedDB로 클라이언트 캐싱
- Server Action으로 API 키 등 민감 정보 서버에서만 사용

**권장 개선 (선택)**

- **SSR/초기 로딩**: 
  - `page.tsx`에서 `requestFcst()`로 초기 데이터 fetch
  - props로 `FcstProvider`에 전달
- **Hydration**: 클라이언트의 IndexedDB 캐시와 서버 데이터 병합/동기화 전략 정의

```tsx
// page.tsx (예시)
export default async function Home() {
  const initialData = await requestFcst();
  return (
    <main>
      <Fcst initialData={initialData} />
    </main>
  );
}
```

---

### 2.7 타입 정의

**✅ 잘 적용된 점**

- `src/types/fcst.d.ts` – API 관련 인터페이스 중앙 관리
- `FcstRequest`, `FcstResponse`, `FcstInstance`, `FcstProperty` 등 도메인 타입 정리

**개선 제안**

1. **타입 export**

- `fcst.d.ts`가 전역 선언이라 별도 import 없이 사용 가능
- 재사용/유지보수를 위해 명시적 export 고려

```ts
// fcst.d.ts - 선택적
export interface FcstInstance { ... }
export interface FcstResponseItem { ... }
```

2. **props 타입**

- `FcstTemperatureCardProps` 등 props 인터페이스 사용 → 권장 패턴에 부합

---

### 2.8 Server Actions

**`src/lib/fcst.ts`**

**✅ 잘 적용된 점**

- `'use server'`로 Server Action 명시
- API 키를 `process.env`로 관리
- `FcstResponseItem` 등 타입 활용

**적용 완료**

- `requestFcst()` 반환 타입을 `Promise<FcstInstance[] | undefined>`로 명시 완료 ✅
- `catch` 블록에 `return undefined` 추가 완료 ✅

---

### 2.9 Context 패턴

**✅ 잘 적용된 점**

- `FcstContext`: `createContext` + `useContext` + Provider
- `useFcstContext`, `useModal` 커스텀 훅으로 Provider 누락 시 에러 throw
- `ModalContext`: `undefined` 초기값으로 타입 안전성 확보

**Provider 중첩 구조**

```
FcstProvider (fcstData, maxTmp, minTmp, currentFcst)
  └── ModalProvider (modals, openModal, closeModal)
        └── FcstHeader, FcstContent, FcstFooter
```

---

### 2.10 스타일링

**✅ 잘 적용된 점**

- Tailwind CSS v4 `@import "tailwindcss"` 사용
- `@theme`로 CSS 변수 정의
- `clsx`로 조건부 클래스 처리

---

### 2.11 기타 발견 사항 (수정 완료)

1. **`SkyIconMap.tsx`** – `skyCondition === '2'`(구름 많음) 케이스 추가 완료 ✅

2. **`FcstContext.tsx` – minTmp 계산** – 초기값을 `Infinity`로 변경, `minTmp === Infinity` 시 `0` 설정 로직 적용 완료 ✅

3. **`FcstTemperatureBar` vs `FcstTemperatureCard`** – 컴포넌트명 오타 수정 완료 (`FcstTemperatureBar`, `FcstTemperatureCard`) ✅

---

## 3. 권장 패턴 체크리스트

| 패턴 | 적용 여부 | 비고 |
|------|:---------:|------|
| src 폴더 패턴 | ✅ | app, components, lib, types 등 src 하위 배치 |
| 루트 설정 파일 | ✅ | next.config, tsconfig, package.json 루트 유지 |
| Path alias (@/*) | ✅ | tsconfig paths `./src/*` |
| App Router 사용 | ✅ | |
| metadata export | ✅ | layout.tsx |
| next/font | ✅ | Noto_Sans_KR |
| Path alias (@/*) | ✅ | tsconfig paths |
| strict TypeScript | ✅ | |
| Server/Client 경계 명확화 | ✅ | Modal에 'use client' 추가 완료 |
| Server Actions 분리 | ✅ | fcst.ts |
| API 타입 정의 | ✅ | fcst.d.ts |
| Context + 커스텀 훅 | ✅ | |
| Readonly props | ✅ | layout children |

---

## 4. 액션 아이템 우선순위

| 우선순위 | 항목 | 상태 |
|:--------:|------|------|
| 1 | Modal.tsx에 `'use client'` 추가 | ✅ 완료 |
| 2 | FcstContext minTmp 버그 수정 | ✅ 완료 |
| 3 | SkyIconMap '2' 케이스 추가 | ✅ 완료 |
| 4 | requestFcst 반환 타입 명시 | ✅ 완료 |
| 5 | 컴포넌트명 오타 수정 (FcstTemperaturBar/Card) | ✅ 완료 |
| 6 | SSR 초기 데이터 로딩 검토 | 선택 사항 |

---

## 5. 참고 문서

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js src Folder](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Server and Client Composition](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [TypeScript in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
