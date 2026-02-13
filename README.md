# Confess.exe

**Confess.exe**는 AI 범인을 심문하여 심리적으로 붕괴시키는 전략 기반 인터랙티브 웹 게임입니다. 플레이어는 고도의 질문 전략을 통해 AI의 내부 인지 상태를 흔들어 최종적으로 자백을 유도해야 합니다.

## 🚀 주요 기능

-   **인지 상태 모델링**: AI의 스트레스(Stress), 모순(Contradiction), 의지력(Willpower) 상태를 실시간으로 시뮬레이션합니다.
-   **전략적 심문 시스템**: 압박, 교란, 논리, 회유 등 4가지 질문 전략을 선택하여 AI의 반응을 끌어냅니다.
-   **몰입감 넘치는 UI**: 90년대 터미널 느낌의 사이버펑크 테마 디자인과 글리치 효과를 제공합니다.
-   **GPT-4o 연동**: OpenAI의 최신 모델을 통해 자연스럽고 입체적인 범인 캐릭터와의 대화를 경험할 수 있습니다.

## 🛠 기술 스택

-   **Frontend**: Next.js 14+ (App Router), TypeScript
-   **Styling**: Vanilla CSS (Global styles & Scoped classes)
-   **AI Engine**: OpenAI SDK (GPT-4o)
-   **Icons**: Lucide React

## 🏁 시작하기

### 1. 환경 변수 설정
프로젝트 루트 폴더에 `.env.local` 파일을 만들고 아래 내용을 입력하세요.
```env
OPENAI_API_KEY=your_actual_api_key_here
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
이제 브라우저에서 `http://localhost:3000`에 접속하여 심문을 시작하십시오.

## 🎮 게임 가이드

### 심문 전략
-   **압박(Pressure)**: 범인을 위협하여 스트레스를 높입니다.
-   **교란(Confuse)**: 과거 진술을 흔들어 논리적 모순을 유도합니다.
-   **논리(Logic)**: 수집된 정보를 바탕으로 추궁하여 의지력을 깎습니다.
-   **회유(Soft)**: 부드럽게 접근하여 경계심을 낮춥니다.

### 승리 조건
-   심문을 통해 용의자의 **WILLPOWER(의지력)**를 0%에 가깝게 떨어뜨리면 범행에 대한 자백을 받아낼 수 있습니다.

---

*본 프로젝트는 LLM의 인지적 특성과 감정적 안정성을 게임 메커니즘으로 실험하기 위해 개발되었습니다.*
