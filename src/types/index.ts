export interface InteractionState {
    stress: number;
    contradiction: number;
    deception: number;
    willpower: number;
    stressPeakTurns: number; // 스트레스 100% 지속 턴 수
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'pressure' | 'confuse' | 'logic' | 'soft' | 'default';
}

export interface Scenario {
    id: string;
    name: string;
    age: number;
    job: string;
    caseName: string;
    description: string;
    secret: string;
    clues: string[];
    initialStatus: InteractionState;
    bgm?: string;
}

export interface GameResponse {
    answer: string;
    state: InteractionState;
    explanation?: string;
    isConfessed: boolean;
}
