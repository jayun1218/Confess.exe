import { Scenario } from '../types';

export const scenarios: Scenario[] = [
    {
        id: 'kang',
        name: '강도훈 단독 심문',
        caseName: '서초동 저택 살인 사건',
        description: "피해자는 강도훈의 오랜 비즈니스 파트너였으며, 자신의 자택 서재에서 살해된 채 발견되었습니다. 강도훈은 범행 현장 근처에서 목격되었으나 알리바이를 주장하며 모든 혐의를 부인하고 있습니다.",
        suspects: [
            {
                id: 'kang_v1',
                name: '강도훈',
                age: 42,
                job: 'IT 사업가',
                secret: "피해자는 당신의 오랜 원한 관계에 있던 사람이었으며, 서재의 비밀 통로를 통해 침입했다. 범행 도구는 현장의 트로피였다.",
                clues: [
                    "서재 책장 뒤에 숨겨진 비밀 통로",
                    "피해자와의 10년 전 악연 (비즈니스 배신)",
                    "혈흔이 닦인 우승 트로피"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 20,
                    contradiction: 0,
                    deception: 30,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'murder_case_ambient.mp3'
    },
    {
        id: 'shilla',
        name: '다중 용의자: 호텔 금고 털이',
        caseName: '신라 호텔 대형 금고 도난 사건',
        description: "최첨단 보안 시스템을 갖춘 신라 호텔 펜트하우스의 개인 금고에서 500억 상당의 다이아몬드가 사라졌습니다. 현장에서 검거된 3명의 용의자는 서로의 공모 사실을 부인하며 엇갈린 진술을 하고 있습니다.",
        suspects: [
            {
                id: 'suspect_01',
                name: '한정수',
                age: 38,
                job: '호텔 경리부장',
                secret: "호텔 재무 권한을 악용하여 금고 비밀번호를 빼내고, 내부자로서 보안 시스템의 허점을 이용해 다이아몬드를 훔쳤다. 횡령한 돈으로 도박 빚을 갚으려 했다.",
                clues: [
                    "한정수의 개인 사물함에서 발견된 금고 비밀번호 메모",
                    "사건 당일 재무팀 서버 비정상 접근 기록",
                    "거액의 해외 도박 빚과 채무 독촉장"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 30,
                    contradiction: 0,
                    deception: 40,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            },
            {
                id: 'suspect_02',
                name: '이민지',
                age: 26,
                job: '호텔 프런트 직원',
                secret: "사건 당일 야간 근무 중이었으나, 퇴근 후 남자친구를 만나기 위해 30분 일찍 자리를 비웠다. 이 사실이 들키면 해고될까 두려워 거짓말을 하고 있다.",
                clues: [
                    "사건 시각 주변 편의점 CCTV (남자친구와 함께)",
                    "퇴근 시간 조작 기록",
                    "동료에게 부탁한 대리 근무 문자 메시지"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 20,
                    contradiction: 5,
                    deception: 30,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            },
            {
                id: 'suspect_03',
                name: '박영호',
                age: 45,
                job: '호텔 청소부',
                secret: "우연히 펜트하우스 청소 중 금고가 열려있는 것을 목격했으나, 과거 절도 전과 때문에 의심받을까 두려워 목격 사실을 숨기고 있다.",
                clues: [
                    "펜트하우스 청소 기록 (사건 30분 전)",
                    "과거 절도 전과 기록",
                    "목격 당시 촬영한 금고 사진 (증거 확보용)"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 40,
                    contradiction: 10,
                    deception: 20,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'cyber_hacking_loop.mp3'
    },
    {
        id: 'lee',
        name: '이다혜 단독 심문',
        caseName: '프로젝트 세이렌 기밀 유출',
        description: "국가 핵심 전략 기술인 '프로젝트 세이렌'의 설계도가 해외 경쟁사로 유출되었습니다. 이다혜 연구원은 유출 당시 서버 접속 기록이 남아있으며, 최근 고액의 채무를 변제한 정황이 포착되었습니다.",
        suspects: [
            {
                id: 'lee_v1',
                name: '이다혜',
                age: 29,
                job: '바이오 연구원',
                secret: "도박 빚을 갚기 위해 다크웹의 구매자에게 설계도를 넘겼다. 전송은 연구소 내의 개인 노트북이 아닌 화장실 Wi-Fi를 이용했다.",
                clues: [
                    "다크웹 거래 내역서 (가상화폐)",
                    "여자 화장실 Wi-Fi 접속 로그",
                    "연구소 뒷문의 사각지대 경로"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 40,
                    contradiction: 10,
                    deception: 50,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'bio_lab_mystery.mp3'
    },
    {
        id: 'park',
        name: '박민석 단독 심문',
        caseName: '국가 안보국 서버 해킹',
        description: "국가 안보국의 메인 서버가 공격받아 요원 500명의 신상 정보가 탈취되었습니다. 박민석은 과거 'L0gic'이라는 닉네임으로 활동하던 전과가 있으며, 사건 당일 그의 동네 PC방에서 공격 로그가 발견되었습니다.",
        suspects: [
            {
                id: 'park_v1',
                name: '박민석',
                age: 21,
                job: '휴학생 (해커)',
                secret: "단순한 영웅 심리로 서버를 뚫었으며, 정보는 자신의 외장 하드에 암호화하여 보관 중이다. PC방의 CCTV는 미리 루팅하여 삭제했다고 믿고 있다.",
                clues: [
                    "침대 밑에 숨겨진 고성능 외장 하드",
                    "삭제된 것처럼 보이지만 복구 가능한 PC방 CCTV 로그",
                    "'L0gic' 닉네임이 사용된 해킹 포럼 게시글"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 10,
                    contradiction: 5,
                    deception: 20,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'cyber_hacking_loop.mp3'
    }
];
