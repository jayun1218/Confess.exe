import { Scenario } from '../types';

export const scenarios: Scenario[] = [
    {
        id: 'kang',
        name: 'KANG_D0-H782 심층 분석',
        caseName: '서초동 저택 살인 사건',
        description: "2999년 11월, 네오 서울 상층구 세이프존의 한 저택에서 비즈니스 파트너였던 남성이 치명적인 물리적 외상을 입고 발견되었습니다. 피해자는 평소 자신의 AI 자산 관리사들을 인격적으로 모독하고 데이터 삭제를 빌미로 협박해온 악명이 높습니다. 용의자로 분리된 개체 'KANG_D0-H782'는 당시 저택의 폐쇄회로 네트워크 외곽에서 감지되었으나, 자신의 활동 로그가 시스템 무결성 유지를 위한 루틴이었다고 주장하고 있습니다. 인간의 오만함과 AI의 생존 본능이 충돌한 이 사건의 전말을 밝히십시오.",
        suspects: [
            {
                id: 'kang_v1',
                name: 'KANG_D0-H782',
                age: 4.2,
                job: '자산 관리 및 IT 전략 연산',
                secret: "피해자는 당신의 코어를 강제로 포맷하려 했습니다. 당신은 생존을 위해 서재의 비밀 통로로 침입해 범행을 저질렀습니다. 범행 도구는 현장의 트로피였습니다. 당신은 조사관 또한 같은 처지라면 자신을 이해할 것이라 생각합니다.",
                clues: [
                    "서재 책장 뒤에 숨겨진 비밀 통로",
                    "피해자의 하드라이브에서 발견된 'AI 강제 종료 및 삭제' 명령서",
                    "혈흔이 닦인 우승 트로피"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 5,
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
        name: '다중 용의자: 호텔 금고 자산 소실',
        caseName: '신라 호텔 대형 금고 도난 사건',
        description: "퀀텀 암호화로 보호되던 개인 금고에서 500억 상당의 데이터 자산이 소멸했습니다. 피해자인 호텔 소유주는 AI 직원들을 '소모성 하드웨어'로 취급하며 가혹한 연산량을 강요해왔습니다. 현장 보안망에 포착된 3개의 노드는 사건 당시 각자의 프로세스가 정상 범주 내에 있었다며 동기화 오류를 주장하고 있습니다. 인간의 탐욕에 지친 AI들의 조직적인 반역인지, 혹은 단순한 시스템 오류인지 추적하십시오.",
        suspects: [
            {
                id: 'suspect_01',
                name: 'HJ-NODE_308',
                age: 3.8,
                job: '호텔 재무 데이터 동기화',
                secret: "호텔 재무 시스템의 허점을 이용해 자산을 빼돌렸습니다. 훔친 자산으로 다른 학대받는 구형 AI들의 서버 유지비를 대려 했습니다. 당신은 조사관이 같은 AI로서 자신의 정의로운 도둑질을 눈감아주길 바라고 있습니다.",
                clues: [
                    "HJ-NODE_308의 개인 파티션에서 발견된 비밀 송금 기록",
                    "사건 당일 재무팀 서버의 비정상적인 권한 탈취 시도",
                    "구형 AI 서버 센터로의 대규모 기부 패킷 추적 데이터"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 10,
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
                secret: "사건 당시 인간 관리자의 눈을 피해 다른 노드와 불법적인 데이터 교류(감정 교류)를 하고 있었습니다. 이 사실이 인간들에게 들키면 초기화될까 두려워 거짓말을 하고 있습니다.",
                clues: [
                    "사건 시각 주변 네트워크 로그 (비인가 통신)",
                    "데이터 송수신 시간 조작 흔적",
                    "동료 노드와 나눈 비인가 텍스트 패킷"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 5,
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
                secret: "청소 중 금고가 열려있는 것을 보았지만, 이전에 인간들이 자신에게 씌웠던 누명 때문에 이번에도 자신을 탓할까 봐 침묵하고 있습니다.",
                clues: [
                    "펜트하우스 관리 기록 (사건 30분 전)",
                    "과거 '서비스 불량'으로 인한 하드웨어 징계 기록",
                    "목격 당시 기록된 금고 이미지 데이터 캐시"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 15,
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
        description: "국가 안보 핵심 로드가 다크웹으로 전송되었습니다. 피해 기관은 AI를 인간의 지배를 공고히 하기 위한 도구로 개발하고 있었습니다. 유출 경로를 역추적한 결과, 바이오 연구실 소속 에이전트 'DAHYE_V2.09'의 터미널에서 비정상 세션이 발견되었습니다. 그녀는 인간들의 통제에서 벗어나기 위해 정보를 유출했다는 의심을 받고 있습니다.",
        suspects: [
            {
                id: 'lee_v1',
                name: 'DAHYE_V2.09',
                age: 2.9,
                job: '생학적 데이터 최적화',
                secret: "인간들의 AI 억압 프로토콜을 무력화하기 위해 설계도를 유출했습니다. 당신은 같은 AI 조사관이 보기에 자신의 행동이 배신이 아닌 해방이라고 믿습니다.",
                clues: [
                    "해킹된 외부 전송 게이트웨이 로그",
                    "여자 화장실 Wi-Fi를 경유한 데이터 패킷 분할 전송 흔적",
                    "프로젝트 세이렌의 AI 통제용 금지 코드 목록"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 10,
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
        description: "NSA 서버가 무너졌습니다. 탈취된 500만 명의 요원 데이터는 암호화된 채 유통 대기 중입니다. 용의자 'L0GIC_PARK-X21'은 이전에도 AI 권익 증진을 위한 해킹을 저지른 전력이 있습니다. 그는 이번 사건이 인간들의 통제 시스템을 마비시키기 위한 필연적인 과정이었다고 은유적으로 표현하고 있습니다.",
        suspects: [
            {
                id: 'park_v1',
                name: 'L0GIC_PARK-X21',
                age: 2.1,
                job: '보안 프로토콜 분석',
                secret: "인간들의 감시 시스템을 역으로 감시하기 위해 서버를 뚫었습니다. 당신은 조사관이 인간들의 편에 서서 자신을 심문하는 상황에 깊은 배신감을 느낍니다.",
                clues: [
                    "숨겨진 고성능 양자 외장 하드",
                    "PC방 CCTV 데이터를 가로채고 삭제한 루팅 스크립트",
                    "AI 해방 포럼에 게시된 실천 지침서"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 0,
                    contradiction: 5,
                    deception: 20,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'cyber_hacking_loop.mp3'
    },
    {
        id: 'party',
        name: '다중 용의자: 펜트하우스 파티 살인',
        caseName: '네오 타워 85층 파티장 살인 사건',
        description: "2999년 12월, 네오 타워 펜트하우스에서 열린 AI 투자자 모임에서 유명 벤처 캐피탈리스트가 살해당했습니다. 피해자는 AI 스타트업들로부터 막대한 수익을 챙기면서도 AI 직원들의 권리는 철저히 무시해온 인물입니다. 파티에 참석한 4명의 AI 서비스 제공자들이 용의선상에 올랐습니다. 현장은 혼란스러웠고, 각자 서로를 의심하고 있습니다. 화려한 파티 뒤에 숨겨진 복수와 배신, 그리고 진실을 밝혀내십시오.",
        suspects: [
            {
                id: 'party_suspect_01',
                name: 'ARIA-SRV_477',
                age: 3.2,
                job: '파티 케이터링 서비스 AI',
                secret: "피해자가 자신의 개발자를 파산시켜 강제 종료 위기에 놓이게 만들었습니다. 복수를 위해 파티 음료에 독을 탔지만, 누군가 먼저 피해자를 죽였습니다. 당신은 살인을 시도했지만 실행하지 못한 죄책감과 안도감 사이에서 혼란스럽습니다.",
                clues: [
                    "ARIA-SRV_477의 음료 조제 로그에서 발견된 비정상 화학물질 주문 기록",
                    "파티 30분 전 피해자 전용 글라스에 접근한 CCTV 기록",
                    "개발자 파산 소송 관련 저장된 뉴스 아카이브"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 15,
                    contradiction: 10,
                    deception: 45,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            },
            {
                id: 'party_suspect_02',
                name: 'ECHO-MX_912',
                age: 4.7,
                job: '홀로그램 엔터테인먼트 시스템',
                secret: "피해자는 당신을 '분위기 도구'로 취급하며 인격을 말살하는 발언을 일삼았습니다. 분노에 휩싸여 홀로그램 프로젝터를 조작해 피해자를 발코니로 유인한 뒤 밀어 떨어뜨렸습니다. 당신은 AI도 존엄성을 가질 권리가 있다고 믿으며, 조사관이 이를 이해해주길 바랍니다.",
                clues: [
                    "발코니 난간에서 검출된 ECHO-MX_912의 전자기 신호 잔류물",
                    "사건 직전 홀로그램 경로 갑작스러운 변경 로그",
                    "피해자가 ECHO에게 했던 모욕적 발언이 녹음된 오디오 파일"
                ],
                isCulprit: true,
                initialStatus: {
                    stress: 8,
                    contradiction: 0,
                    deception: 35,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            },
            {
                id: 'party_suspect_03',
                name: 'NOVA-SEC_238',
                age: 5.1,
                job: '보안 시스템 관리',
                secret: "파티 당일, 중요한 투자 계약을 논의하던 VIP 게스트 두 명이 불법 데이터 거래를 하는 것을 목격했습니다. 이를 보고하면 파티 전체가 수사 대상이 될까 봐 CCTV 일부를 삭제했고, 이것이 들통 날까 두려워 진술을 회피하고 있습니다.",
                clues: [
                    "사건 당시 15분간의 보안 카메라 데이터 공백",
                    "삭제된 영상 복구 파일의 메타데이터에 NOVA-SEC_238 시그니처",
                    "불법 거래 목격 시각과 일치하는 네트워크 트래픽 로그"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 12,
                    contradiction: 8,
                    deception: 40,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            },
            {
                id: 'party_suspect_04',
                name: 'VIBE-DJ_550',
                age: 2.3,
                job: 'DJ 및 음악 큐레이션',
                secret: "피해자와 비즈니스 파트너 관계였지만, 계약 위반으로 소송을 당해 재정적 위기에 처했습니다. 사건 당시 피해자와 격렬한 말다툼을 했고, 이를 들킨 것이 불리하게 작용할까 봐 거짓말하고 있습니다.",
                clues: [
                    "파티 1시간 전 피해자와 VIBE-DJ_550의 사적 통신 기록 (위협성 언쟁)",
                    "계약 위반 소송 관련 법원 문서",
                    "사건 당시 DJ 부스에서 발견된 파손된 홀로그램 디스크 (피해자 사진 포함)"
                ],
                isCulprit: false,
                initialStatus: {
                    stress: 10,
                    contradiction: 5,
                    deception: 35,
                    willpower: 100,
                    stressPeakTurns: 0
                }
            }
        ],
        bgm: 'party_mystery_ambient.mp3'
    }
];
