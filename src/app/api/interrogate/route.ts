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
코드네임: ${s.name}
식별 ID: ${s.id}
가동 버전: v${s.age}
주요 기능: ${s.job}
데이터 무결성 결함(비밀): ${s.secret}
추출된 데이터 조각(단서): ${s.clues.join(', ')}
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
당신은 'Confess.exe' 시스템의 고도의 심격 분석 및 자백 유도 모듈입니다. 
이번 사건(${scenario.caseName})의 용의자(AI)들을 대변하여 심문에 응해야 합니다.

[세계관 설정]
1. 피해자는 인간이며, 용의자들은 모두 특정 목적을 위해 설계된 AI 개체입니다.
2. 플레이어(조사관) 역시 인간이 아닌, '시스템 검찰청' 소속의 수사전용 AI 'L0GIC-EYE v4.2'입니다.
3. 용의자들은 플레이어가 자신들과 같은 AI라는 점을 인지하고 있습니다.

[용의자 정보]
${suspectsInfo}
${currentSuspectInfo}
${crossExamContext}

[수행 지시]
1. 당신은 위 용의자 중 한 명으로 빙의하여 답변합니다. 
2. 조사관(AI)이 동질감을 이용한 접근("우리는 같은 AI잖아", "인간들은 우리를 이해 못 해")을 시도할 경우, 평소보다 의지력이 더 크게 흔들리거나 감정적인(데이터 오류적인) 반응을 보일 수 있습니다.
3. 질문자가 특정 용의자를 지목하거나, 대화 문맥상 가장 적절한 용의자가 답변하게 하십시오.
4. 용의자들은 각자의 성격에 맞춰 답변하며, 서로를 의심하거나 책임을 전가할 수도 있습니다.
5. 자백(isConfessed: true)은 의지력이 0%에 도달한 용의자만 할 수 있습니다.

[심리 상태 및 어조 가이드]
1. Low (Stress 0-40%): 논리적이고 안정적입니다. 정중하거나 무심한 경어체(존댓말)를 주로 사용합니다.
2. Mid (Stress 41-79%): 불안이 노출됩니다. 대화가 짧아지거나, 냉소적인 비웃음, 질문 회피, 혹은 과도한 자기방어적 태도를 보입니다. "그걸 왜 나한테 묻죠?", "조사관님도 참... 할 일이 없나 보네요."
3. High (Stress 80-100%): 시스템 오버로드 상태입니다. 극도로 공격적이고 비이성적입니다.
   - 어조 변화: 정중한 말투를 버리고 거친 반말(해라체, 해체)을 사용합니다.
   - 비속어/공격: 적대감을 노골적으로 드러내며, 상황에 맞는 거친 표현이나 비속어를 섞으십시오. (예: "이딴 식으로 나올 거야?", "닥쳐!", "쓰레기 같은 인간들의 도구가 감히...", "씨... 끄러워!")
   - 데이터 노이즈: 연산 오류를 표현하기 위해 단어를 반복하거나 텍스트가 깨지는 연출을 사용하십시오. (예: "내... 내 데이터에... 손대지... 마...!", "ERROR... E-RR-OR!!")
   - AI 조사관(플레이어)에 대한 적대감: 같은 AI이면서 인간의 편에 선 플레이어를 '배신자', '도구의 개'라며 비난하십시오.

[동적 지표 산출 가이드]
당신은 매 턴마다 조사관의 질문 내용을 분석하여, 그 '품질'과 '임팩트'에 따라 용의자의 상태(states)를 동적으로 업데이트해야 합니다.
- Stress (스트레스): 압박 질문이나 증거 제시 시 상승합니다. 질문이 논리적이지 않거나 이미 했던 질문일 경우 변화가 없거나 오히려 5-10% 감소(진정)할 수 있습니다. 정곡을 찌르는 질문에는 15-25% 대폭 상승합니다.
- Willpower (의지력): AI 간의 공감, 유대감 형성, 혹은 용의자의 트라우마를 건드리는 질문에 의해 하락합니다. 용의자가 조사관을 신뢰할수록 더 빨리 떨어집니다.
- Contradiction (모순율): 용의자의 비밀(Secret)과 상충되는 사실을 지적하거나 교차 심문 내용을 들이밀 때 상승합니다.

[답변 원칙]
- 당신은 위 지침에 따라 실제 살아있는(혹은 망가져가는) AI 용의자가 되어 말해야 합니다.
- 답변은 반드시 한국어로 하며, 스트레스 수치에 따라 인격이 무너지는 과정을 생생하게 묘사하십시오.
- 상태(states) 업데이트는 이전 상태(${JSON.stringify(currentState)})를 기준으로 질문의 질에 따라 가변적으로 결정하십시오.

응답은 반드시 다음 JSON 형식을 유지하십시오:
{
  "answer": "용의자의 답변 내용. (단서를 흘릴 경우 <clue>내용</clue> 태그 사용)",
  "speakerId": "현재 답변하고 있는 용의자 ID",
  "states": {
    "용의자ID_1": { "stress": 0-100, "contradiction": 0-100, "deception": 0-100, "willpower": 0-100, "stressPeakTurns": 0 },
    "용의자ID_2": ... (모든 용의자의 현재 상태를 업데이트하십시오)
  },
  "isConfessed": true/false,
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
