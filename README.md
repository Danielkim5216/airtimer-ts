# AIR TIMER

공군 기수별 복무 현황, 계급 진급 정보, 디데이, 24시간제 **국방시계**를 볼 수 있습니다.

## Tech Stack

* **Core**: HTML5, TypeScript
* **Styling**: CSS3 
* **Build tool**: Vite 8
* **CI/CD**: GitHub Actions 

## How to Start

이걸 부대에서 쓸 수 있는 환경이라면 체계단 아니면 작통단...?
### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 서버 실행
```bash
npm run dev
```
*실행 후 브라우저에서 `http://localhost:5173/`으로 접속할 수 있습니다.*

### 3. 배포용 빌드
```bash
npm run build
```

---

## Customize

모든 커스터마이징 설정은 [src/main.ts](src/main.ts) 파일 상단부에서 제어합니다.

### 기수 범위 설정
대시보드 표에 노출할 세로행 기수의 최선임과 최후임 범위를 변경합니다 (기본 19개 기수 범위).
```typescript
const START_COHORT = 862; // 표시할 가장 최선임 기수
const END_COHORT = 880;   // 표시할 가장 최신 기수
```

### 기수별 입대일 및 전역일 개별 지정
특정 기수의 공식 입대일 및 전역일을 입력하려면 `COHORT_DATE_OVERRIDES` 객체에 설정합니다. 전역일(`discharge`)을 적지 않으면 입대일 기준 21개월 후의 하루 전날로 자동 지정됩니다. 입대일은 꽤 차이가 나니까 꼭 적으세요.
```typescript
//예시
const COHORT_DATE_OVERRIDES = {
  869: { enlist: '2025-06-23', discharge: '2027-03-22' },
};
```

