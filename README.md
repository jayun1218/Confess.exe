# CONFESS.EXE - AI Interrogation Simulator

![Project License](https://img.shields.io/badge/license-ISC-green)
![Version](https://img.shields.io/badge/version-1.1.0-blue)

> **"접속을 환영합니다, 심문관님. 대상의 진실을 추출하십시오."**

`CONFESS.EXE`는 OpenAI의 고급 언어 모델을 기반으로 한 텍스트 기반 사이버펑크 심문 시뮬레이션 게임입니다. 플레이어는 고도로 발달된 심문 시스템에 접속하여, 자백을 거부하는 용의자들의 심리적 허점을 파고들어 진실을 밝혀내야 합니다.

---

## 🖥 주요 시스템 (Key Systems)

### 1. 실시간 시나리오 기반 심문
*   **AI 용의자**: OpenAI API를 통해 실시간으로 생성되는 유동적인 대화 시스템. 용의자는 자신의 설정과 비밀을 바탕으로 사용자의 질문에 대응합니다.
*   **다중 용의자 심문 시스템 (Multi-Suspect System)**: 단일 용의자뿐만 아니라, 여러 명의 용의자가 연루된 사건을 해결할 수 있습니다. 상호 간의 진술 모순을 찾아내어 진실에 다가가십시오.
*   **교차 심문 (Cross-Examination)**: 특정 용의자에게 얻은 정보를 다른 용의자에게 제시하여 심리적 압박을 가하거나 진술의 허점을 찌를 수 있습니다.

### 2. 심리적 지표 추적 (Psychological Stats)
*   **STRESS (스트레스)**: 용의자의 심리적 압박 상태. 100% 도달 시 시스템 오버로드가 발생하지만, 조절 실패 시 심문이 강제 종료될 수 있습니다.
*   **CONTRADICTION (모순)**: 진술 사이의 불일치를 나타냅니다. 모순이 높을수록 자백을 유도하기 쉬워집니다.
*   **WILLPOWER (의지력)**: 용의자의 자백 거부 의사. 0%에 도달하면 진실을 고백하게 됩니다.

### 3. 전략적 접근 (Interrogation Strategies)
단순한 대화가 아닌, 상황에 맞는 전문 심문 전략을 선택하여 효과를 극대화할 수 있습니다:
*   **기본 (Default)**: 일반적인 정보 수집.
*   **압박 (Pressure)**: 스트레스를 급격히 높여 평정심을 유지하기 어렵게 만듭니다.
*   **교란 (Confuse)**: 과거 진술의 모순을 유도하여 논리적 허점을 찾습니다.
*   **논리 (Logic)**: 의지력을 직접적으로 침식시킵니다.
*   **회유 (Soft)**: 경계심을 풀어 솔직한 답변을 유도합니다.

### 4. 고유한 사이버펑크 UI/UX
*   **터미널 테마**: 어두운 배경과 강렬한 네온 컬러의 대비로 완성된 몰입형 인터페이스.
*   **시각적 피드백**: 시나리오 선택 시 발생하는 각 시나리오별 고유 이펙트(예: 픽셀 다이아몬드) 및 심문 중 실시간 글리치 연출.
*   **반응형 사이드바**: 심문 타겟 전환 및 사건 정보 확인을 위한 직관적인 대시보드.

### 5. 몰입형 음향 시스템 (Audio System)
*   **시나리오별 테마 BGM**: 각 사건의 분위기에 맞춘 배경 음악이 자동으로 재생됩니다.
*   **볼륨 컨트롤**: 상단 바의 설정 메뉴에서 BGM 음량을 실시간으로 조절할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

*   **Framework**: Next.js (App Router)
*   **Development**: TypeScript, React
*   **Styling**: Vanilla CSS (Custom Keyframe Animations)
*   **AI Engine**: OpenAI API
*   **Icons**: Lucide React

---

## 🚀 시작하기 (Getting Started)

### 의존성 설치
```bash
npm install
```

### 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하십시오:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 개발 서버 실행
```bash
npm run dev
```

---

## 📂 시나리오 가이드 (Scenario Guide)

1.  **강도훈**: 서초동 저택 살인 사건 (단독 심문)
2.  **이다혜**: 프로젝트 세이렌 기밀 유출 (단독 심문)
3.  **박민석**: 국가 안보국 서버 해킹 (단독 심문)
4.  **호텔 금고 털이**: 신라 호텔 대형 금고 도난 사건 (**다중 용의자**)

### 🎵 BGM 배치 경로
`public/audio/` 폴더 내에 시나리오별 배경음악을 배치하십시오:
*   `murder_case_ambient.mp3`
*   `bio_lab_mystery.mp3`
*   `cyber_hacking_loop.mp3`

---

## ⚖ 라이선스 (License)
본 프로젝트는 **ISC 라이선스**를 따릅니다.

---
*주의: 모든 시나리오는 가상의 사건이며, 실제 인물이나 단체와 관련이 없습니다.*
