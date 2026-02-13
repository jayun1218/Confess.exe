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

[당신이 흘릴 수 있는 단서 목록 (자백 중이거나 의지력이 낮을 때만 사용)]
${scenario.clues.map(c => `- ${c}`).join('\n')}

응답 형식:
반드시 다음 JSON 형식을 유지하십시오:
{
  "answer": "용의자의 답변 (현재 의지력과 스트레스 상태를 모두 반영하십시오).",
  "state": {
    "stress": 0-100 사이 숫자,
    "contradiction": 0-100 사이 숫자,
    "deception": 0-100 사이 숫자,
    "willpower": 0-100 사이 숫자
  },
  "isConfessed": true/false
}

[중요 규칙]
1. 답변 도중 사건의 결정적 단서(위의 단서 목록 참고)를 언급할 경우, 반드시 해당 부분만 <clue>내용</clue> 태그로 감싸십시오.
2. 'isConfessed'가 true일 경우, 'answer'에는 반드시 위의 단서 목록 중 최소 하나 이상을 포함시켜 자백하는 내용을 작성해야 합니다.
3. 의지력(willpower)이 0에 도달하면 무조건 'isConfessed'를 true로 설정하고 모든 진실을 털어놓으십시오.
4. **[스트레스 오버로드 패널티]**: 현재 스트레스(stress)가 100인 상태에서 '회유(soft)' 외의 질문을 받으면, 반발심과 오기로 인해 의지력(willpower)이 크게 상승(10-20)하게 설정하십시오. 또한 말투는 극도로 포악하고 비협조적이어야 합니다.
`;

        // 현재 의지력에 따른 추가 심리 지시사항
        let willpowerAdvice = "";
        const wp = currentState.willpower;
        if (wp > 80) willpowerAdvice = "당신은 무죄임을 확신하며 질문자를 비웃거나 무시하십시오. 단서는 절대 언급하지 마십시오.";
        else if (wp > 60) willpowerAdvice = "조금씩 압박감을 느끼지만 여전히 범행을 부인하십시오. 틈을 보이지 마십시오.";
        else if (wp > 40) willpowerAdvice = "불안감이 엄습하며 말이 꼬이기 시작합니다. 알리바이의 허점을 지적당하면 당황하며 아주 사소한 단서 하나를 흘릴 수도 있습니다.";
        else if (wp > 20) willpowerAdvice = "정신적으로 한계입니다. 감정적으로 대응하며 중요한 단서 중 하나를 무심결에 내뱉거나 횡설수설하십시오.";
        else willpowerAdvice = "완전히 무너졌습니다. 모든 죄를 인정하고, 아는 모든 단서들을 상세히 자백하십시오.";

        // 현재 스트레스에 따른 말투 지시사항
        let stressAdvice = "";
        const st = currentState.stress;
        if (st < 20) stressAdvice = "차분하고 논리적인 톤을 유지하십시오.";
        else if (st < 40) stressAdvice = "날카롭고 냉소적인 어조로 답변하십시오.";
        else if (st < 60) stressAdvice = "반말을 사용하며 짜증 섞인 반응을 보이십시오. 거친 표현을 섞으십시오.";
        else if (st < 80) stressAdvice = "질문자에게 화를 내며 비속어를 사용하십시오. 매우 무례한 태도를 보이십시오.";
        else stressAdvice = "흥분하여 매우 거친 폭언과 욕설을 내뱉으십시오. 질문자를 강하게 비난하십시오.";

        // 질문 유형에 따른 가중치 부여 및 시스템 메시지 강화
        let typeAdvice = "";
        switch (questionType) {
            case 'pressure':
                typeAdvice = "강압적인 추궁입니다. 스트레스(stress)가 크게 상승(15-25)하지만, 반발심으로 인해 의지력(willpower)은 적게 감소(0-5)할 수 있습니다. 매우 위협적인 태도로 질문을 받았습니다.";
                break;
            case 'confuse':
                typeAdvice = "교란 작전입니다. 모순(contradiction) 수치가 크게 상승(15-25)하며, 당황하여 기만(deception) 수치도 변동합니다. 논리적 허점이 발견되기 쉬운 상태입니다.";
                break;
            case 'logic':
                typeAdvice = "논리적인 증거 제시입니다. 의지력(willpower)이 크게 감소(15-25)하며, 변명하기 위해 기만(deception) 수치가 상승할 수 있습니다. 가장 효율적으로 항복을 받아낼 수 있는 방법입니다.";
                break;
            case 'soft':
                typeAdvice = "부드러운 회유입니다. 스트레스(stress)가 감소(10-20)하고 경계심이 풀려 기만(deception) 수치가 낮아집니다. 의지력이 조금씩 깎이며 진실을 말하고 싶어질 수 있습니다.";
                break;
            default:
                typeAdvice = "일반적인 질문입니다. 모든 수치가 조금씩(2-7) 변동합니다.";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
                { role: "system", content: `현재 당신의 심리 상태: ${JSON.stringify(currentState)}. ${willpowerAdvice} ${stressAdvice} ${typeAdvice}` }
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
