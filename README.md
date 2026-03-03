# Next Weather Forecast

기상청 단기예보 API를 활용한 날씨 예보 웹 앱입니다. Next.js 16, React 19, TypeScript로 구성되어 있습니다.

## 주요 기능

- **단기 예보**: 48시간 시간별 예보 (기온, 하늘상태, 강수 등)
- **다중 지역**: 여러 지역의 예보 저장 및 전환
- **캐시 TTL**: 기상청 API 갱신 주기(3시간)에 맞춘 자동 캐시 만료
- **날씨 팔레트**: 낮/밤 × 날씨 유형별 배경 색상
- **글래스모피즘 UI**: 반투명 카드, backdrop-blur

## 실행 방법

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# 테스트
npm run test
```

## 환경 변수

`.env.local` 파일을 생성하고 다음을 설정하세요:

```
API_KEY_DEC=your_공공데이터포털_인증키
```

- [공공데이터포털](https://www.data.go.kr/) → 기상청 단기예보 API 신청
- 인증키는 URL 인코딩(디코딩) 상태로 사용

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16, React 19 |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS v4 |
| UI | HeroUI, Framer Motion, Lucide React |
| 데이터 | 기상청 단기예보 API, localforage (IndexedDB) |

## 프로젝트 구조

```
src/
├── app/           # App Router (layout, page, loading, error)
├── components/    # UI 컴포넌트 (fcst/, ui/)
├── contexts/     # FcstContext, ModalContext
├── constants/    # weatherPalette, ModalIDs
├── lib/          # fcst API, localforage, util
└── types/        # fcst.d.ts (API 타입)
```

## 문서

- [docs/PROJECT_EVALUATION.md](docs/PROJECT_EVALUATION.md) - 프로젝트 평가 및 개선점
- [docs/ROADMAP_DECISIONS.md](docs/ROADMAP_DECISIONS.md) - API·지역·에러·색상 의사결정
- [docs/UI_IMPROVEMENT_OPTIONS.md](docs/UI_IMPROVEMENT_OPTIONS.md) - UI 개선 옵션
- [docs/UNUSED_CODE_REVIEW.md](docs/UNUSED_CODE_REVIEW.md) - 미사용 코드 검토

## 라이선스

Private
