# CONFESS.EXE - AI Interrogation Simulator

![Project License](https://img.shields.io/badge/license-ISC-green)
![Version](https://img.shields.io/badge/version-1.0.4-blue)

> **"접속을 환영합니다, 심문관님. 대상의 진실을 추출하십시오."**

`CONFESS.EXE`는 OpenAI의 고급 언어 모델을 기반으로 한 텍스트 기반 사이버펑크 심문 시뮬레이션 게임입니다. 플레이어는 고도로 발달된 심문 시스템에 접속하여, 자백을 거부하는 용의자들의 심리적 허점을 파고들어 진실을 밝혀내야 합니다.

---

## 🖥 주요 시스템 (Key Systems)

### 1. 실시간 시나리오 기반 심문
*   **AI 용의자**: OpenAI API를 통해 실시간으로 생성되는 유동적인 대화 시스템. 용의자는 자신의 설정과 비밀을 바탕으로 사용자의 질문에 대응합니다.
*   **사전 준비 단계 (Setup Phase)**: 심문 시작 전, 조명 설정, 증거물 배치, 첫인상 선택 등을 통해 용의자의 초기 상태를 조절할 수 있습니다.

### 2. 심리적 지표 추적 (Psychological Stats)
*   **STRESS (스트레스)**: 용의자의 심리적 압박 상태. 100% 도달 시 시스템 오버로드가 발생하지만, 조절 실패 시 심문이 강제 종료될 수 있습니다.
*   **CONTRADICTION (모순)**: 진술 사이의 불일치를 나타냅니다. 모순이 높을수록 자백을 유도하기 쉬워집니다.
*   **WILLPOWER (의지력)**: 용의자의 자백 거부 의사. 0%에 도달하면 진실을 고백하게 됩니다.

### 3. 전략적 접근 (Interrogation Strategies)
단순한 대화가 아닌, 상황에 맞는 다섯 가지 전문 심문 전략을 선택하여 효과를 극대화할 수 있습니다:
*   **기본 (Default)**: 일반적인 정보 수집.
*   **압박 (Pressure)**: 스트레스를 급격히 높여 평정심을 유지하기 어렵게 만듭니다.
*   **교란 (Confuse)**: 과거 진술의 모순을 유도하여 논리적 허점을 찾습니다.
*   **논리 (Logic)**: 의지력을 직접적으로 침식시킵니다.
*   **회유 (Soft)**: 경계심을 풀어 솔직한 답변을 유도합니다.

### 4. 고유한 사이버펑크 비주얼
*   터미널 스타일의 어두운 테마와 강렬한 네온 컬러 스타일링.
*   시스템 오버로드 시 발생하는 역동적인 글리치(Glitch) 효과와 에러 팝업 시뮬레이션.

---

## 🛠 기술 스택 (Tech Stack)

*   **Framework**: Next.js (App Router)
*   **Development**: TypeScript, React
*   **Styling**: Vanilla CSS (Custom Keyframe Animations & Responsive Layout)
*   **AI Engine**: OpenAI API
*   **Icons**: Lucide React

---

## 🚀 시작하기 (Getting Started)

### 의존성 설치
```bash
npm install
```

### 환경 변수 설정
본 프로젝트를 실행하기 위해서는 OpenAI API 키가 필요합니다. 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하십시오:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 개발 서버 실행
```bash
npm run dev
```
이후 기본 브라우저에서 `http://localhost:3000`에 접속하여 심문을 시작하십시오.

---

## ⚖ 라이선스 (License)
본 프로젝트는 **ISC 라이선스**를 따릅니다.

---
*주의: 모든 시나리오는 가상의 사건이며, 실제 인물이나 단체와 관련이 없습니다.*
