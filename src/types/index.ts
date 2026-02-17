export interface SuspectState {
    stress: number;
    contradiction: number;
    deception: number;
    willpower: number;
    stressPeakTurns: number;
}

export interface InteractionState {
    suspectStates: Record<string, SuspectState>;
    globalNotes?: string;
    turns: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'pressure' | 'confuse' | 'logic' | 'soft' | 'default';
    suspectId?: string; // 특정 용의자에게 질문하는 경우
    assistantName?: string; // 답변하는 용의자 이름
}

export interface Suspect {
    id: string;
    name: string;
    age: number;
    job: string;
    secret: string;
    clues: string[];
    isCulprit: boolean;
    initialStatus: SuspectState;
}

export interface Scenario {
    id: string;
    name: string; // 시나리오 표시 이름 (예: "3인 용의자")
    caseName: string;
    description: string;
    suspects: Suspect[];
    bgm?: string;
}

export interface GameResponse {
    answer: string;
    states: Record<string, SuspectState>;
    speakerId: string; // 답변하는 용의자 ID
    explanation?: string;
    isConfessed: boolean;
    confessedSuspectId?: string;
    isSystemError?: boolean; // 스트레스 오버로드로 시스템 에러 발생
    errorSuspectId?: string; // 에러 발생한 용의자 ID
}
