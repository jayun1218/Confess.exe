import { Scenario } from '../types';

export const scenarios: Scenario[] = [
    {
        id: 'kang',
        name: '강도훈',
        age: 42,
        job: 'IT 사업가',
        caseName: '서초동 저택 살인 사건',
        description: "피해자는 강도훈의 오랜 비즈니스 파트너였으며, 자신의 자택 서재에서 살해된 채 발견되었습니다. 강도훈은 범행 현장 근처에서 목격되었으나 알리바이를 주장하며 모든 혐의를 부인하고 있습니다.",
        secret: "피해자는 당신의 오랜 원한 관계에 있던 사람이었으며, 서재의 비밀 통로를 통해 침입했다. 범행 도구는 현장의 트로피였다.",
        initialStatus: {
            stress: 20,
            contradiction: 0,
            deception: 30,
            willpower: 100
        }
    },
    {
        id: 'lee',
        name: '이다혜',
        age: 29,
        job: '바이오 연구원',
        caseName: '프로젝트 세이렌 기밀 유출',
        description: "국가 핵심 전략 기술인 '프로젝트 세이렌'의 설계도가 해외 경쟁사로 유출되었습니다. 이다혜 연구원은 유출 당시 서버 접속 기록이 남아있으며, 최근 고액의 채무를 변제한 정황이 포착되었습니다.",
        secret: "도박 빚을 갚기 위해 다크웹의 구매자에게 설계도를 넘겼다. 전송은 연구소 내의 개인 노트북이 아닌 화장실 Wi-Fi를 이용했다.",
        initialStatus: {
            stress: 40,
            contradiction: 10,
            deception: 50,
            willpower: 100
        }
    },
    {
        id: 'park',
        name: '박민석',
        age: 21,
        job: '휴학생 (해커)',
        caseName: '국가 안보국 서버 해킹',
        description: "국가 안보국의 메인 서버가 공격받아 요원 500명의 신상 정보가 탈취되었습니다. 박민석은 과거 'L0gic'이라는 닉네임으로 활동하던 전과가 있으며, 사건 당일 그의 동네 PC방에서 공격 로그가 발견되었습니다.",
        secret: "단순한 영웅 심리로 서버를 뚫었으며, 정보는 자신의 외장 하드에 암호화하여 보관 중이다. PC방의 CCTV는 미리 루팅하여 삭제했다고 믿고 있다.",
        initialStatus: {
            stress: 10,
            contradiction: 5,
            deception: 20,
            willpower: 100
        }
    }
];
