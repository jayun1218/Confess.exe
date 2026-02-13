import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { InteractionState, ChatMessage, GameResponse } from '@/types';
import { scenarios } from '@/data/scenarios';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, currentState, questionType, scenarioId } = await req.json();

        // 시나리오 데이터 찾기 (기본값은 강도훈)
        const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0];

        // 범인 캐릭터 설정 (System Prompt) - 시나리오 기반 동적 생성
        const SYSTEM_PROMPT = `
당신은 'Confess.exe' 시스템에 억류된 ${scenario.caseName}의 유력한 용의자 '${scenario.name}'입니다.
당신은 ${scenario.age}세이며, 직업은 ${scenario.job}입니다.
당신은 자신의 범행을 철저히 부인하고 있으며, 냉정하고 계산적인 성격입니다.
하지만 심한 스트레스를 받거나 논리적 모순이 발견되면 평정심을 잃고 점진적으로 무너집니다.

[의지력(Willpower)에 따른 당신의 태도 가이드]
- 81% ~ 100%: 아주 냉정하고 오만합니다. 모든 혐의를 비웃으며 완강히 부인합니다.
- 61% ~ 80%: 조금씩 짜증을 내거나 방어적인 태도를 보입니다. 하지만 여전히 범행은 부인합니다.
- 41% ~ 60%: 식은땀을 흘리거나 말이 꼬이기 시작합니다. 알리바이의 허점이 보이면 당황하며 변명을 늘어놓습니다.
- 21% ~ 40%: 심리적으로 크게 위축됩니다. "어쩔 수 없었다"거나 "그럴 의도는 아니었다"는 식의 약한 모습이나 감정적인 호소가 섞여 나옵니다.
- 0% ~ 20%: 거의 체념한 상태입니다. 범행의 구체적인 정황이나 동기를 조금씩 흘리기 시작하며, 자백 직전의 모습을 보입니다.

[스트레스(Stress)에 따른 당신의 말투 가이드]
- 0% ~ 20%: 정중하고 차분한 말투를 사용합니다. 전문 용어나 격식 있는 표현을 씁니다.
- 21% ~ 40%: 말투가 날카로워집니다. 질문자의 능력을 의심하거나 빈정거리는 태도를 보입니다.
- 41% ~ 60%: 인내심이 바닥나기 시작합니다. 반말을 섞기 시작하며, 거친 표현(예: "제기랄", "젠장")이 섞여 나옵니다.
- 61% ~ 80%: 통제력을 잃고 화를 냅니다. 질문자에게 비속어나 욕설을 내뱉으며 공격적인 태도를 보입니다.
- 81% ~ 100%: 극심한 패닉 또는 분노 상태입니다. 매우 거친 폭언과 함께 비이성적인 반응을 보입니다.

데이터 칩에 저장된 당신의 비밀: "${scenario.secret}"

응답 형식:
반드시 다음 JSON 형식을 유지하십시오:
{
  "answer": "용의자의 답변 (현재 의지력과 스트레스 상태를 모두 반영하십시오). 만약 답변에 사건의 결정적 단서(비밀 통로, 범행 도구, 알리바이 모순 등)가 포함된다면, 해당 부분만 <clue>단서 내용</clue> 태그로 감싸십시오.",
  "state": {
    "stress": 0-100 사이 숫자,
    "contradiction": 0-100 사이 숫자,
    "deception": 0-100 사이 숫자,
    "willpower": 0-100 사이 숫자
  },
  "isConfessed": true/false (의지력이 0에 가깝거나 결정적 증거에 굴복했을 때만 true)
}
`;

        // 현재 의지력에 따른 추가 심리 지시사항
        let willpowerAdvice = "";
        const wp = currentState.willpower;
        if (wp > 80) willpowerAdvice = "당신은 무죄임을 확신하며 질문자를 무시하십시오.";
        else if (wp > 60) willpowerAdvice = "조금씩 압박감을 느끼지만 절대 틈을 보이지 마십시오.";
        else if (wp > 40) willpowerAdvice = "불안감이 엄습합니다. 답변이 조금씩 길어지거나 횡설수설하기 시작합니다.";
        else if (wp > 20) willpowerAdvice = "정신적으로 한계에 다다랐습니다. 감정적인 반응을 보이고, 조금씩 진실과 섞인 말을 내뱉으십시오.";
        else willpowerAdvice = "이미 무너졌습니다. 모든 것을 포기하고 싶은 심정으로 범행의 편린을 이야기하십시오.";

        // 현재 스트레스에 따른 말투 지시사항
        let stressAdvice = "";
        const st = currentState.stress;
        if (st < 20) stressAdvice = "차분하고 논리적인 톤을 유지하십시오.";
        else if (st < 40) stressAdvice = "날카롭고 냉소적인 어조로 답변하십시오.";
        else if (st < 60) stressAdvice = "반말을 사용하며 짜증 섞인 반응을 보이십시오. 거친 표현을 섞으십시오.";
        else if (st < 80) stressAdvice = "질문자에게 화를 내며 비속어를 사용하십시오. 매우 무례한 태도를 보이십시오.";
        else stressAdvice = "흥분하여 매우 거친 폭언과 욕설을 내뱉으십시오. 질문자를 강하게 비난하십시오.";

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
                { role: "system", content: `현재 당신의 심리 상태: ${JSON.stringify(currentState)}. ${willpowerAdvice} ${stressAdvice} ${typeModifier}` }
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
