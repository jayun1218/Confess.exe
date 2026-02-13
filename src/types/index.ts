export interface InteractionState {
    stress: number;
    contradiction: number;
    deception: number;
    willpower: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    type?: 'pressure' | 'confuse' | 'logic' | 'soft' | 'default';
}

export interface GameResponse {
    answer: string;
    state: InteractionState;
    explanation?: string;
    isConfessed: boolean;
}
