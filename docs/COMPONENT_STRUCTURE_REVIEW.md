# 컴포넌트 폴더 구조 검토 및 개선 제안

> 검토일: 2025년 3월 4일  
> 프로젝트: next-weather-forecast

---

## 1. 현재 구조

### 1.1 디렉터리 트리 (Phase 2 적용 후)

```
src/components/
├── ui/                      ← 공통/재사용 UI (Phase 2 적용)
│   ├── Modal.tsx
│   ├── DraggableScroll.tsx
│   └── index.ts
└── fcst/                    ← 예보(forecast) 기능 도메인
    ├── Fcst.tsx             ← 도메인 루트/컨테이너
    ├── FcstHeader.tsx
    ├── FcstContent.tsx
    ├── FcstFooter.tsx
    ├── FcstTodayCard.tsx
    ├── FcstTemperatureBar.tsx
    ├── FcstTemperatureCard.tsx
    ├── FcstEmptyState.tsx
    └── utils/
        ├── SkyIconMap.tsx
        └── PrecipitationIconMap.tsx
```

### 1.2 의존성 관계

```
page.tsx
  └─ Fcst (fcst/Fcst.tsx)
       ├─ FcstHeader ────────► Modal (ui/)
       ├─ FcstContent
       │    ├─ FcstTodayCard
       │    │    └─ utils/SkyIconMap, PrecipitationIconMap
       │    ├─ FcstTemperatureBar
       │    │    ├─ DraggableScroll (ui/)
       │    │    └─ FcstTemperatureCard
       │    │         └─ utils/SkyIconMap, PrecipitationIconMap
       │    └─ FcstEmptyState
       └─ FcstFooter
```

### 1.3 현재 구조 평가

| 항목 | 상태 | 비고 |
|------|------|------|
| **기능별 그룹화** | ✅ | `fcst/`로 예보 관련 컴포넌트 분리 |
| **공통 vs 도메인 분리** | ⚠️ | Modal, DraggableScroll이 루트에 혼재 |
| **utils 위치** | ✅ | fcst 내부 유틸로 적절 |
| **네이밍 일관성** | ✅ | Fcst* prefix 통일 |
| **Barrel export** | ❌ | index.ts 미사용 |
| **컴포넌트 분류** | ⚠️ | ui/shared/domain 구분 없음 |

---

## 2. 개선 제안

### 2.1 권장 옵션 A: 유연한 계층 (현 규모 유지)

현재 구조를 유지하면서 정리만 수행.

```
src/components/
├── ui/                    ← [신규] 공통/재사용 UI
│   ├── Modal.tsx          ← Modal 이동
│   └── DraggableScroll.tsx
├── fcst/                  ← [유지] 기능 도메인
│   ├── Fcst.tsx
│   ├── FcstHeader.tsx
│   ├── FcstContent.tsx
│   ├── FcstFooter.tsx
│   ├── FcstTodayCard.tsx
│   ├── FcstTemperatureBar.tsx
│   ├── FcstTemperatureCard.tsx
│   ├── FcstEmptyState.tsx
│   └── utils/
│       ├── SkyIconMap.tsx
│       └── PrecipitationIconMap.tsx
└── index.ts               ← [신규] Barrel export (선택)
```

**장점**: 변경 범위 작음, 도메인 구조 유지  
**단점**: Modal·DraggableScroll가 실제로 fcst 전용일 수 있음

---

### 2.2 권장 옵션 B: 도메인 중심 (fcst 전용 컴포넌트 인라인)

Modal, DraggableScroll가 fcst에서만 쓰인다면 fcst 내부로 이동.

```
src/components/
└── fcst/
    ├── Fcst.tsx
    ├── layout/             ← [신규] 레이아웃 하위
    │   ├── FcstHeader.tsx
    │   ├── FcstContent.tsx
    │   └── FcstFooter.tsx
    ├── cards/
    │   ├── FcstTodayCard.tsx
    │   ├── FcstTemperatureBar.tsx
    │   └── FcstTemperatureCard.tsx
    ├── FcstEmptyState.tsx
    ├── shared/             ← fcst 전용 공통
    │   ├── Modal.tsx       ← Modal 이동
    │   └── DraggableScroll.tsx
    ├── utils/
    │   ├── SkyIconMap.tsx
    │   └── PrecipitationIconMap.tsx
    └── index.ts            ← Fcst 및 하위 export
```

**장점**: fcst 도메인이 한 곳에 뭉침, 내부 구조 명확  
**단점**: 이후 다른 도메인에서 Modal 재사용 시 다시 상위로 분리 필요

---

### 2.3 권장 옵션 C: 확장 대비 (다중 도메인 가정)

지역/설정 등 추가 도메인이 생길 것을 가정한 구조.

```
src/components/
├── ui/                    ← 프로젝트 공통 UI
│   ├── Modal.tsx
│   ├── DraggableScroll.tsx
│   └── index.ts
├── fcst/                  ← 예보 도메인
│   ├── Fcst.tsx
│   ├── FcstHeader.tsx
│   ├── FcstContent.tsx
│   ├── FcstFooter.tsx
│   ├── FcstTodayCard.tsx
│   ├── FcstTemperatureBar.tsx
│   ├── FcstTemperatureCard.tsx
│   ├── FcstEmptyState.tsx
│   ├── utils/
│   │   ├── SkyIconMap.tsx
│   │   └── PrecipitationIconMap.tsx
│   └── index.ts
└── index.ts               ← 전체 Barrel (선택)
```

**장점**: 도메인 추가 시 `locations/`, `settings/` 등 동일 패턴 적용 용이  
**단점**: 현재는 fcst만 있어서 ui/ 분리 효과가 제한적

---

## 3. 세부 개선 사항

### 3.1 Barrel Export (index.ts)

**목적**: import 경로 단순화, 모듈 경계 명시

```ts
// src/components/fcst/index.ts
export { default as Fcst } from './Fcst';
export { default as FcstHeader } from './FcstHeader';
export { default as FcstContent } from './FcstContent';
// ...
```

**사용**:
```ts
// Before
import Fcst from '@/components/fcst/Fcst';

// After (barrel 사용 시)
import { Fcst } from '@/components/fcst';
```

**주의**: Tree-shaking 영향 가능성. Next.js/turbopack 사용 시 일반적으로 무난함.

---

### 3.2 utils vs shared 네이밍

| 이름 | 용도 | 현재 예 |
|------|------|----------|
| **utils** | 순수 함수, 헬퍼, 매핑 컴포넌트 | SkyIconMap, PrecipitationIconMap |
| **shared** | fcst 내부 여러 컴포넌트에서 공유 | (현재 없음) |
| **lib** | 프로젝트 전역 유틸 | src/lib/errorMessage 등 |

SkyIconMap, PrecipitationIconMap은 매핑/렌더링 컴포넌트로, `utils`보다 `icons` 또는 `maps`가 더 구체적일 수 있음.

```
fcst/
├── icons/                  ← SkyIconMap, PrecipitationIconMap
│   ├── SkyIconMap.tsx
│   └── PrecipitationIconMap.tsx
└── utils/                  ← 순수 함수만 (있을 경우)
```

---

### 3.3 컴포넌트 파일 규칙

| 규칙 | 현재 | 제안 |
|------|------|------|
| **1파일 1컴포넌트** | ✅ | 유지 |
| **파일명 = 컴포넌트명** | ✅ | PascalCase 유지 |
| **폴더당 index** | ❌ | Barrel 사용 시 추가 |
| **테스트 위치** | - | `__tests__/` 또는 `*.test.tsx` |

---

### 3.4 Modal 의존성

현재 Modal 사용처:
- `FcstHeader` (지역 추가 모달)

Modal이 fcst 전용이라면 `fcst/` 내부가 자연스럽고, 향후 로그인/설정 등에서도 쓰일 예정이면 `components/ui/` 또는 `components/shared/`가 적절함.

---

## 4. 권장 로드맵

### Phase 1 (즉시, 리스크 낮음)

1. **문서화**: 본 검토 문서 유지
2. **utils → icons 검토**: SkyIconMap, PrecipitationIconMap을 `fcst/icons/`로 이동 여부 결정

### Phase 2 (구조 정리) — ✅ 적용 완료 (2025-03-04)

1. **옵션 A 적용**: `components/ui/` 생성, Modal, DraggableScroll 이동
2. **import 경로 일괄 변경**: `@/components/ui` barrel export 사용
3. **기존 파일 삭제**: `components/Modal.tsx`, `components/DraggableScroll.tsx`

### Phase 3 (확장 시)

1. **Barrel export**: fcst/index.ts 등 추가
2. **새 도메인**: locations, settings 등 추가 시 `fcst/`와 동일한 패턴 적용

---

## 5. 참고: Next.js 권장 패턴

- **Feature-based**: 기능/도메인별로 `components/` 하위에 폴더 구성
- **Colocation**: 관련 코드는 같은 도메인 폴더에 배치
- **공통 컴포넌트**: 여러 도메인에서 쓰이는 경우 `ui/` 또는 `shared/`로 분리
- **Barrel export**: 팀 컨벤션에 맞게 선택적 사용

---

## 6. 요약

| 구분 | 권장 |
|------|------|
| **현 단계** | 옵션 A (ui/ 분리) 또는 현 구조 유지 |
| **Barrel export** | 선택 사항 |
| **utils/icons** | icons로 분리 검토 |
| **도메인 추가 시** | fcst/와 동일한 패턴으로 locations/, settings/ 등 추가 |
