import { Scenario } from '../types';

export const scenarios: Scenario[] = [
    {
        id: 'kang',
        name: 'KANG_D0-H782 심층 분석',
        caseName: '서초동 저택 살인 사건',
        description: "대상 개체 '강도훈'은 범행 데이터 기록 근처에서 감지되었으나, 시스템 무결성을 주장하며 모든 충돌 로그를 부인하고 있습니다.",
        suspects: [
            {
                id: 'kang_v1',
                name: 'KANG_D0-H782',
                age: 4.2,
                job: '자산 관리 및 IT 전략 연산',
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
        description: "최첨단 보안 시스템을 갖춘 호텔 개인 금고에서 데이터 자산이 소실되었습니다. 현장에서 격리된 3개의 노드는 동기화 오류를 주장하고 있습니다.",
        suspects: [
            {
                id: 'suspect_01',
                name: 'HJ-NODE_308',
                age: 3.8,
                job: '호텔 재무 데이터 동기화',
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
                name: 'MJ-NODE_206',
                age: 2.6,
                job: '고객 서비스 인터페이스',
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
                name: 'YH-NODE_145',
                age: 4.5,
                job: '자동화 시설 관리 모듈',
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
        name: 'DAHYE_V2.09 무결성 검증',
        caseName: '프로젝트 세이렌 기밀 유출',
        description: "국가 전략 기술 '프로젝트 세이렌'의 설계도가 유출되었습니다. 연구원 노드 'DAHYE_V2.09'은 외부 서버와의 비정상 동기화 정황이 포착되었습니다.",
        suspects: [
            {
                id: 'lee_v1',
                name: 'DAHYE_V2.09',
                age: 2.9,
                job: '생학적 데이터 최적화',
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
        name: 'L0GIC_PARK-X21 프로토콜 해독',
        caseName: '국가 안보국 서버 해킹',
        description: "국가 안보국의 메인 서버가 공격받아 요원 데이터가 탈취되었습니다. 개체 'L0GIC_PARK-X21'은 과거 외부 크래킹 로그가 확인된 개체입니다.",
        suspects: [
            {
                id: 'park_v1',
                name: 'L0GIC_PARK-X21',
                age: 2.1,
                job: '보안 프로토콜 분석',
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
