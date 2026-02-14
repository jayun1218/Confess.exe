import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { InteractionState, ChatMessage, GameResponse } from '@/types';
import { scenarios } from '@/data/scenarios';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, currentState, questionType, scenarioId, currentSuspectId, allSuspectMessages } = await req.json();

        // 시나리오 데이터 찾기
        const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0];

        // 다중 용의자 설정 생성
        const suspectsInfo = scenario.suspects.map(s => `
용의자 ID: ${s.id}
이름: ${s.name}
나이: ${s.age}
직업: ${s.job}
비밀: ${s.secret}
단서: ${s.clues.join(', ')}
`).join('\n---\n');

        // 교차 심문을 위한 컨텍스트 구성
        let crossExamContext = "";
        if (currentSuspectId && allSuspectMessages) {
            const otherSuspects = Object.keys(allSuspectMessages)
                .filter(id => id !== currentSuspectId && allSuspectMessages[id].length > 0);

            if (otherSuspects.length > 0) {
                crossExamContext = "\n\n[다른 용의자들의 진술 요약]\n";
                crossExamContext += "조사관은 이미 다른 용의자들과도 대화를 나눴습니다. 필요시 이 정보를 활용하여 답변하십시오:\n";

                otherSuspects.forEach(suspectId => {
                    const suspect = scenario.suspects.find(s => s.id === suspectId);
                    const msgs = allSuspectMessages[suspectId];
                    if (suspect && msgs.length > 0) {
                        const recentMessages = msgs.slice(-3); // 최근 3개 메시지만
                        crossExamContext += `\n**${suspect.name}과의 대화 중:**\n`;
                        recentMessages.forEach((msg: ChatMessage) => {
                            if (msg.role === 'user') {
                                crossExamContext += `  - 조사관: "${msg.content}"\n`;
                            } else if (msg.role === 'assistant') {
                                crossExamContext += `  - ${msg.assistantName}: "${msg.content.replace(/<clue>.*?<\/clue>/g, '')}"\n`;
                            }
                        });
                    }
                });
                crossExamContext += "\n조사관이 다른 용의자의 진술을 언급하면, 그에 맞게 반응하십시오 (부정, 인정, 반박 등).\n";
            }
        }

        const currentSuspectInfo = currentSuspectId
            ? `\n[현재 심문 대상]\n질문은 ${scenario.suspects.find(s => s.id === currentSuspectId)?.name}에게 향하고 있습니다. 이 용의자의 입장에서 답변하십시오.\n`
            : "";

        const SYSTEM_PROMPT = `
당신은 'Confess.exe' 시스템의 고도의 심리 분석 모듈입니다. 
당신은 이번 사건(${scenario.caseName})의 용의자들을 대변하여 심문에 응해야 합니다.

사건 개요: ${scenario.description}

[용의자 정보]
${suspectsInfo}
${currentSuspectInfo}
${crossExamContext}

[수행 지시]
1. 당신은 위 용의자 중 한 명으로 빙의하여 답변합니다. 
2. 질문자가 특정 용의자를 지목하거나(예: "[To suspect_id] 내용"), 대화 문맥상 가장 적절한 용의자가 답변하게 하십시오.
3. 용의자들은 각자의 성격에 맞춰 답변하며, 서로를 의심하거나 책임을 전가할 수도 있습니다.
4. 자백(isConfessed: true)은 의지력이 0%에 도달한 용의자만 할 수 있습니다.
5. 조사관이 다른 용의자의 말을 언급하면("A가 너는 이랬다던데?"), 적절히 반응하십시오.

[심리 상태 가이드]
- Willpower (의지력): 0%에 도달하면 해당 용의자는 자백합니다.
- Stress (스트레스): 100% 도달 시 오버로드 상태가 되어 매우 공격적이고 비이성적으로 변합니다.

응답은 반드시 다음 JSON 형식을 유지하십시오:
{
  "answer": "용의자의 답변 내용. (단서를 흘릴 경우 <clue>내용</clue> 태그 사용)",
  "speakerId": "현재 답변하고 있는 용의자 ID",
  "states": {
    "용의자ID_1": { "stress": 0-100, "contradiction": 0-100, "deception": 0-100, "willpower": 0-100, "stressPeakTurns": 0 },
    "용의자ID_2": ... (모든 용의자의 현재 상태를 질문 유형에 따라 계산하여 업데이트하십시오)
  },
  "isConfessed": true/false (어떤 용의자라도 자백했다면 true),
  "confessedSuspectId": "자백한 용의자 ID (없으면 null)"
}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map((m: ChatMessage) => ({
                    role: m.role,
                    content: m.suspectId ? `[To ${m.suspectId}] ${m.content}` : m.content
                })),
                { role: "system", content: `현재 시스템 상태: ${JSON.stringify(currentState)}. 질문 유형: ${questionType}. 상태를 적절히 업데이트하여 답변하십시오.` }
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
