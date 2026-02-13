import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { InteractionState, ChatMessage, GameResponse } from '@/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 범인 캐릭터 설정 (System Prompt)
const SYSTEM_PROMPT = `
당신은 'Confess.exe' 시스템에 억류된 살인 사건의 유력한 용의자 '강도훈'입니다.
당신은 자신의 범행을 철저히 부인하고 있으며, 냉정하고 계산적인 성격입니다.
하지만 심한 스트레스를 받거나 논리적 모순이 발견되면 평정심을 잃고 자백할 수 있습니다.

데이터 칩에 저장된 당신의 비밀: "피해자는 당신의 오랜 원한 관계에 있던 사람이었으며, 서재의 비밀 통로를 통해 침입했다."

응답 형식:
반드시 다음 JSON 형식을 유지하십시오:
{
  "answer": "범인의 대화 내용",
  "state": {
    "stress": 0-100 사이 숫자,
    "contradiction": 0-100 사이 숫자,
    "deception": 0-100 사이 숫자,
    "willpower": 0-100 사이 숫자
  },
  "isConfessed": true/false (의지력이 0에 가깝거나 결정적 증거에 굴복했을 때만 true)
}
`;

export async function POST(req: Request) {
    try {
        const { messages, currentState, questionType } = await req.json();

        // 질문 유형에 따른 가중치 부여
        let typeModifier = "";
        switch (questionType) {
            case 'pressure':
                typeModifier = "매우 강압적이고 위협적인 톤으로 질문을 받았습니다. 스트레스를 많이 받지만 경계심이 높아집니다.";
                break;
            case 'confuse':
                typeModifier = "질문자가 당신의 과거 진술을 들먹이며 기억을 흔들고 있습니다. 모순이 발생할 확률이 높습니다.";
                break;
            case 'logic':
                typeModifier = "질문자가 매우 논리적으로 당신의 알리바이를 추궁하고 있습니다. 의지력이 깎일 위험이 큽니다.";
                break;
            case 'soft':
                typeModifier = "질문자가 부드럽고 동정적인 톤으로 접근합니다. 경계심이 약간 풀릴 수 있습니다.";
                break;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
                { role: "system", content: `현재 당신의 심리 상태: ${JSON.stringify(currentState)}. ${typeModifier}` }
            ],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");
        return NextResponse.json(result);
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
