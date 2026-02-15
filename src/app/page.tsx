'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, InteractionState, GameResponse, Scenario } from '@/types';
import { scenarios } from '@/data/scenarios';
import { Shield, Brain, Zap, Heart, AlertTriangle, Send, User, Briefcase, FileText, Settings, Volume2, Terminal } from 'lucide-react';

export default function Home() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [hoveredScenarioId, setHoveredScenarioId] = useState<string | null>(null);
    const [setupStep, setSetupStep] = useState<number>(0); // 0: 선택전, 1~3: 준비단계
    const [tempStress, setTempStress] = useState<number>(0); // 준비단계에서 누적되는 스트레스
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [suspectMessages, setSuspectMessages] = useState<Record<string, ChatMessage[]>>({});
    const [activeSuspectId, setActiveSuspectId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentState, setCurrentState] = useState<InteractionState>({
        suspectStates: {},
        turns: 0
    });
    const [selectedType, setSelectedType] = useState<ChatMessage['type']>('default');
    const [clues, setClues] = useState<Record<string, string[]>>({});
    const [notes, setNotes] = useState<string>('');
    const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
    const [isCulpritSelected, setIsCulpritSelected] = useState<boolean>(false);
    const [culpritResult, setCulpritResult] = useState<{ success: boolean, name: string } | null>(null);
    const [volume, setVolume] = useState(0.5);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 오프닝 씬 관련 상태
    const [hasSeenOpening, setHasSeenOpening] = useState(false);
    const [showOpening, setShowOpening] = useState(true);
    const [canProceed, setCanProceed] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 오프닝 시퀀스 타이머 및 이벤트 리스너
    useEffect(() => {
        if (!hasSeenOpening && showOpening) {
            const timer = setTimeout(() => {
                setCanProceed(true);
            }, 2000);

            const handleInteraction = () => {
                if (canProceed) {
                    setShowOpening(false);
                    setHasSeenOpening(true);
                }
            };

            window.addEventListener('keydown', handleInteraction);
            window.addEventListener('mousedown', handleInteraction);

            return () => {
                clearTimeout(timer);
                window.removeEventListener('keydown', handleInteraction);
                window.removeEventListener('mousedown', handleInteraction);
            };
        }
    }, [hasSeenOpening, showOpening, canProceed]);

    // BGM 재생 및 볼륨 조절 로직
    useEffect(() => {
        if (selectedScenario && selectedScenario.bgm) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            const audio = new Audio(`/audio/${selectedScenario.bgm}`);
            audio.loop = true;
            audio.volume = volume;
            audio.play().catch(err => console.log("Audio play deferred:", err));
            audioRef.current = audio;
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [selectedScenario]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectScenario = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setSetupStep(1);
        setTempStress(0);
        setMessages([]);
        setSuspectMessages({});
        setActiveSuspectId(null);
        setClues({});
        setNotes('');
        setSelectedSuspectId(null);
        setIsCulpritSelected(false);
        setCulpritResult(null);
    };

    const handleSetupChoice = (stressBonus: number) => {
        const nextStressBase = tempStress + stressBonus;
        if (setupStep < 3) {
            setTempStress(nextStressBase);
            setSetupStep(prev => prev + 1);
        } else {
            if (selectedScenario) {
                const initialSuspectStates: Record<string, any> = {};
                selectedScenario.suspects.forEach(s => {
                    initialSuspectStates[s.id] = {
                        ...s.initialStatus,
                        stress: Math.max(0, s.initialStatus.stress + nextStressBase)
                    };
                });
                setCurrentState({
                    suspectStates: initialSuspectStates,
                    turns: 0
                });

                // 다중 용의자 시나리오: 각 용의자별로 빈 메시지 배열 초기화 및 첫 용의자 선택
                if (selectedScenario.suspects.length > 1) {
                    const initialMessages: Record<string, ChatMessage[]> = {};
                    selectedScenario.suspects.forEach(s => {
                        initialMessages[s.id] = [];
                    });
                    setSuspectMessages(initialMessages);
                    setActiveSuspectId(selectedScenario.suspects[0].id);
                } else {
                    // 단독 시나리오: 기존 방식대로
                    setMessages([]);
                    setActiveSuspectId(null);
                }

                setSetupStep(0);
            }
        }
    };

    const setupSteps = [
        {
            title: "STEP 01: ENVIRONMENT_SETTING",
            question: "취조실의 조명을 어떻게 설정하겠습니까?",
            options: [
                { label: "암전 및 단독 조명", desc: "압박감을 극대화합니다.", stress: 10 },
                { label: "일상적인 조명", desc: "경계심을 완화시킵니다.", stress: 0 }
            ]
        },
        {
            title: "STEP 02: EVIDENCE_EXPOSURE",
            question: "책상 위에 무엇을 배치하겠습니까?",
            options: [
                { label: "결정적 증거물 배치", desc: "범행 도구를 미리 보여줍니다.", stress: 10 },
                { label: "빈 책상 유지", desc: "심리적 허점을 노립니다.", stress: 0 }
            ]
        },
        {
            title: "STEP 03: INITIAL_APPROACH",
            question: "용의자에게 처음 건넬 첫마디는?",
            options: [
                { label: "고압적인 호통", desc: "기선을 제압합니다.", stress: 10 },
                { label: "부드러운 티타임", desc: "협조를 유도합니다.", stress: 0 }
            ]
        }
    ];

    const handleSend = async () => {
        if (!input.trim() || isLoading || !selectedScenario) return;

        // 다중 용의자이지만 용의자가 선택되지 않은 경우
        if (selectedScenario.suspects.length > 1 && !activeSuspectId) {
            alert('용의자를 먼저 선택해주세요.');
            return;
        }

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
            type: selectedType,
            suspectId: activeSuspectId || selectedSuspectId || undefined
        };

        // 다중 vs 단독 시나리오에 따라 메시지 저장 위치 결정
        const isMultiSuspect = selectedScenario.suspects.length > 1;
        if (isMultiSuspect && activeSuspectId) {
            setSuspectMessages(prev => ({
                ...prev,
                [activeSuspectId]: [...(prev[activeSuspectId] || []), userMessage]
            }));
        } else {
            setMessages(prev => [...prev, userMessage]);
        }

        setInput('');
        setIsLoading(true);

        try {
            // 현재 대화 기록 결정
            const currentMessages = isMultiSuspect && activeSuspectId
                ? suspectMessages[activeSuspectId] || []
                : messages;

            const response = await fetch('/api/interrogate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...currentMessages, userMessage],
                    currentState,
                    questionType: selectedType,
                    scenarioId: selectedScenario.id,
                    currentSuspectId: activeSuspectId, // 현재 심문 중인 용의자
                    allSuspectMessages: isMultiSuspect ? suspectMessages : undefined // 교차 심문용
                }),
            });

            const data: GameResponse = await response.json();

            if (data.answer) {
                const speaker = selectedScenario.suspects.find(s => s.id === data.speakerId);
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: data.answer,
                    assistantName: speaker?.name || 'Unknown',
                    suspectId: data.speakerId
                };

                // 응답 메시지도 적절한 위치에 저장
                if (isMultiSuspect && activeSuspectId) {
                    setSuspectMessages(prev => ({
                        ...prev,
                        [activeSuspectId]: [...(prev[activeSuspectId] || []), assistantMessage]
                    }));
                } else {
                    setMessages(prev => [...prev, assistantMessage]);
                }

                setCurrentState({
                    suspectStates: data.states,
                    turns: currentState.turns + 1
                });

                // 단서 추출 및 용의자별 정렬 로직
                const clueMatches = data.answer.match(/<clue>(.*?)<\/clue>/g);
                if (clueMatches) {
                    const newClues = clueMatches.map(m => m.replace(/<\/?clue>/g, ''));
                    setClues(prev => {
                        const updated = { ...prev };
                        if (!updated[data.speakerId]) updated[data.speakerId] = [];
                        newClues.forEach(nc => {
                            if (!updated[data.speakerId].includes(nc)) {
                                updated[data.speakerId].push(nc);
                            }
                        });
                        return updated;
                    });
                }

                if (data.isConfessed && data.confessedSuspectId) {
                    const confessedSuspect = selectedScenario.suspects.find(s => s.id === data.confessedSuspectId);
                    setMessages(prev => [...prev, {
                        role: 'system',
                        content: `SYSTEM: 용의자 ${confessedSuspect?.name}이(가) 자백했습니다.`
                    }]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (showOpening && !hasSeenOpening) {
        const codeParticles = [
            { text: '0x7FF00A', top: '20%', left: '15%', delay: '0s' },
            { text: 'TCP_ESTABLISHED', top: '15%', left: '70%', delay: '1.2s' },
            { text: 'BYPASS_KEY_V2', top: '75%', left: '20%', delay: '0.5s' },
            { text: 'ENCRYPT_ACTIVE', top: '80%', left: '65%', delay: '2.1s' },
            { text: 'ROOT_ACCESS_GRANTED', top: '40%', left: '80%', delay: '1.5s' },
            { text: 'MEM_ALLOC_0x34', top: '60%', left: '10%', delay: '0.8s' },
            { text: 'FIREWALL_DISABLED', top: '30%', left: '5%', delay: '1.7s' },
            { text: 'DB_QUERY_SUCCESS', top: '85%', left: '40%', delay: '2.5s' },
        ];

        return (
            <div className="opening-container overflow-hidden">
                {codeParticles.map((p, idx) => (
                    <div
                        key={idx}
                        className="code-snippet"
                        style={{ top: p.top, left: p.left, animationDelay: p.delay }}
                    >
                        {p.text}
                    </div>
                ))}
                <div className="opening-symbol-wrapper">
                    <Terminal size={48} className="opening-icon" />
                    <div className="opening-system-text text-[8px] opacity-40 mt-2 font-black tracking-[0.2em]">
                        SYSTEM_INITIALIZING... [OK]
                    </div>
                </div>
                <h1 className="opening-title mt-6">CONFESS.EXE</h1>
                {canProceed && (
                    <div className="press-any-button animate-in fade-in duration-1000">
                        PRESS ANY BUTTON TO START
                    </div>
                )}
            </div>
        );
    }

    if (!selectedScenario) {
        return (
            <main className="container flex flex-col items-center py-20 min-h-screen overflow-y-auto">
                <div className="w-full max-w-6xl px-4">
                    <h1 className="text-4xl text-center mb-16 glow-text tracking-[0.3em]">SELECT_SCENARIO</h1>
                    <div className="flex flex-col gap-16">
                        {/* 단독 심문 섹션 */}
                        <div>
                            <div className="text-[10px] text-[#00ff41]/50 uppercase tracking-[0.5em] mb-6 text-center">SINGLE_INTERROGATION</div>
                            <div className="scenario-container hide-scrollbar">
                                {scenarios.filter(s => s.suspects.length === 1).map((s) => (
                                    <div
                                        key={s.id}
                                        className={`scenario-card p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between transition-all duration-500 ${hoveredScenarioId === s.id ? `hover-active theme-${s.id}` : ''}`}
                                        onClick={() => handleSelectScenario(s)}
                                        onMouseEnter={() => setHoveredScenarioId(s.id)}
                                        onMouseLeave={() => setHoveredScenarioId(null)}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41] opacity-20 group-hover:opacity-100 transition-all duration-300"></div>
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ff41] opacity-20 group-hover:opacity-100 transition-all duration-300"></div>
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-3xl font-black group-hover:text-[#00ff41] transition-colors leading-tight">{s.name}</h3>
                                                <div className="text-[10px] py-1 px-2 border border-[#333] opacity-50 uppercase tracking-[0.2em]">{s.id}</div>
                                            </div>
                                            <div className="text-xs text-[#00ff41] font-bold uppercase tracking-widest bg-[#00ff41]/10 self-start px-2 py-1">{s.caseName}</div>
                                            <p className="text-base line-clamp-8 text-[#aaa] font-light leading-relaxed tracking-tight">{s.description}</p>
                                        </div>
                                        <div className="mt-12 backdrop-blur-sm bg-black/20 p-4 border border-white/5">
                                            <div className="grid grid-cols-2 gap-4 text-xs opacity-60">
                                                <div className="flex flex-col border-l border-[#00ff41] pl-3">
                                                    <span className="text-[8px] uppercase opacity-50">Suspects</span>
                                                    <span className="text-lg font-bold">{s.suspects.length}명</span>
                                                </div>
                                                <div className="flex flex-col border-l border-[#00ff41] pl-3">
                                                    <span className="text-[8px] uppercase opacity-50">Difficulty</span>
                                                    <span className="text-lg font-bold uppercase truncate">NORMAL</span>
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-[#00ff41]/20 text-center text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-[#00ff41] font-black tracking-[0.4em]">
                                                ACCESS_DENIED_BY_ROOT {">"}
                                            </div>
                                        </div>
                                        {s.id === 'park' && hoveredScenarioId === 'park' && (
                                            <>
                                                <div className="hacking-popup" style={{ top: '15%', left: '10%', animationDelay: '0s' }}>{">"} IP_FOUND: 192.168.0.1</div>
                                                <div className="hacking-popup" style={{ top: '60%', left: '55%', animationDelay: '0.5s' }}>{">"} BRUTE_FORCING...</div>
                                                <div className="hacking-popup" style={{ top: '40%', left: '20%', animationDelay: '1.2s' }}>{">"} ROOT_ACCESS_GRANTED</div>
                                                <div className="hacking-popup" style={{ top: '75%', left: '40%', animationDelay: '0.8s' }}>{">"} PACKET_SNIFFING...</div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 다중 심문 섹션 */}
                        {scenarios.some(s => s.suspects.length > 1) && (
                            <div>
                                <div className="text-[10px] text-[#00ff41]/50 uppercase tracking-[0.5em] mb-6 text-center">MULTI_INTERROGATION</div>
                                <div className="scenario-container hide-scrollbar">
                                    {scenarios.filter(s => s.suspects.length > 1).map((s) => (
                                        <div
                                            key={s.id}
                                            className={`scenario-card p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between transition-all duration-500 ${hoveredScenarioId === s.id ? `hover-active theme-${s.id}` : ''}`}
                                            onClick={() => handleSelectScenario(s)}
                                            onMouseEnter={() => setHoveredScenarioId(s.id)}
                                            onMouseLeave={() => setHoveredScenarioId(null)}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff41] opacity-20 group-hover:opacity-100 transition-all duration-300"></div>
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00ff41] opacity-20 group-hover:opacity-100 transition-all duration-300"></div>
                                            <div className="flex flex-col gap-6">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-3xl font-black group-hover:text-[#00ff41] transition-colors leading-tight">{s.name}</h3>
                                                    <div className="text-[10px] py-1 px-2 border border-[#333] opacity-50 uppercase tracking-[0.2em]">{s.id}</div>
                                                </div>
                                                <div className="text-xs text-[#00ff41] font-bold uppercase tracking-widest bg-[#00ff41]/10 self-start px-2 py-1">{s.caseName}</div>
                                                <p className="text-base line-clamp-8 text-[#aaa] font-light leading-relaxed tracking-tight">{s.description}</p>
                                            </div>
                                            <div className="mt-12 backdrop-blur-sm bg-black/20 p-4 border border-white/5">
                                                <div className="grid grid-cols-2 gap-4 text-xs opacity-60">
                                                    <div className="flex flex-col border-l border-[#00ff41] pl-3">
                                                        <span className="text-[8px] uppercase opacity-50">Suspects</span>
                                                        <span className="text-lg font-bold">{s.suspects.length}명</span>
                                                    </div>
                                                    <div className="flex flex-col border-l border-[#00ff41] pl-3">
                                                        <span className="text-[8px] uppercase opacity-50">Difficulty</span>
                                                        <span className="text-lg font-bold uppercase truncate">HIGH</span>
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-[#00ff41]/20 text-center text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-[#00ff41] font-black tracking-[0.4em]">
                                                    ACCESS_DENIED_BY_ROOT {">"}
                                                </div>
                                            </div>
                                            {s.id === 'shilla' && hoveredScenarioId === 'shilla' && (
                                                <div className="diamond-display-box">
                                                    <div className="diamond-pixel" />
                                                    <div className="box-corner top-left" />
                                                    <div className="box-corner top-right" />
                                                    <div className="box-corner bottom-left" />
                                                    <div className="box-corner bottom-right" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    if (setupStep > 0) {
        const currentSetup = setupSteps[setupStep - 1];
        return (
            <div className="setup-container">
                <div className="w-full max-w-2xl px-4">
                    <div className="mb-8 text-center bg-[#00ff41]/5 p-2 border border-[#00ff41]/20">
                        <span className="text-[#00ff41] text-xs font-black tracking-[0.5em]">{currentSetup.title}</span>
                    </div>
                    <h2 className="text-2xl text-center mb-12 text-white font-bold">{currentSetup.question}</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {currentSetup.options.map((opt: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleSetupChoice(opt.stress)}
                                className="setup-option-card group border border-[#333] p-8 text-center hover:border-[#00ff41] transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="text-[#00ff41] font-black tracking-[0.3em] text-xl mb-3 uppercase">{opt.label}</div>
                                <p className="text-sm text-[#888] font-light italic">{opt.desc}</p>
                                <div className="absolute top-0 right-0 w-0 h-full bg-[#00ff41]/5 group-hover:w-full transition-all duration-500 -z-10"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const anyOverload = Object.values(currentState.suspectStates).some(s => s.stress >= 100);
    return (
        <main className={`container h-screen overflow-hidden ${anyOverload ? 'main-glitch' : ''}`}>
            {/* 전체 화면 오버레이 레이어 */}
            {anyOverload && (
                <>
                    <div className="overload-overlay" />
                    <div className="error-window" style={{ top: '20%', left: '15%', animationDelay: '0s' }}>ACCESS_DENIED: RESOURCE_LOCKED</div>
                    <div className="error-window" style={{ top: '50%', left: '60%', animationDelay: '1.2s' }}>MEMORY_SEGMENTATION_FAULT</div>
                    <div className="error-window" style={{ top: '40%', left: '30%', animationDelay: '0.5s' }}>CORE_DUMP_IN_PROGRESS</div>
                    <div className="error-window" style={{ top: '70%', left: '10%', animationDelay: '2.3s' }}>UNKNOWN_EXCEPTION_DETECTED</div>
                </>
            )}

            {/* 범인 지목 결과 화면 */}
            {isCulpritSelected && culpritResult && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <div className={`p-12 border-2 ${culpritResult.success ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-red-500 bg-red-500/5'} text-center max-w-xl w-full`}>
                        <h2 className={`text-4xl font-black mb-6 ${culpritResult.success ? 'text-[#00ff41]' : 'text-red-500'}`}>
                            {culpritResult.success ? 'MISSION_ACCOMPLISHED' : 'MISSION_FAILED'}
                        </h2>
                        <p className="text-xl mb-8">
                            당신이 지목한 {culpritResult.name}는 {culpritResult.success ? '진범이었습니다.' : '진범이 아니었습니다.'}
                        </p>
                        <button
                            onClick={() => setSelectedScenario(null)}
                            className={`px-8 py-3 font-bold border ${culpritResult.success ? 'border-[#00ff41] text-[#00ff41]' : 'border-red-500 text-red-500'}`}
                        >
                            RETURN_TO_MENU
                        </button>
                    </div>
                </div>
            )}

            {/* 상단 상태 바 - 레트로 스타일 복구 */}
            <div className={`status-bar flex flex-row items-center justify-between w-full h-12 px-6 border-b border-[#00ff41]/30 z-50 ${Object.values(currentState.suspectStates).some(s => s.stress >= 100) ? 'border-red-500' : 'bg-black/80'}`}>

                {/* 좌측: 용의자 상태 모니터 */}
                <div className="flex flex-row gap-6 overflow-x-auto hide-scrollbar items-center flex-1 mr-4">
                    {selectedScenario.suspects
                        .filter(suspect => {
                            const isMulti = selectedScenario.suspects.length > 1;
                            // 다중 용의자: activeSuspectId만 표시, 단독: 전체 표시
                            return !isMulti || suspect.id === activeSuspectId;
                        })
                        .map(suspect => {
                            const state = currentState.suspectStates[suspect.id] || suspect.initialStatus;
                            const isOverload = state.stress >= 100;
                            const isMulti = selectedScenario.suspects.length > 1;

                            return (
                                <div
                                    key={suspect.id}
                                    className="flex flex-row items-center gap-3 text-[#00ff41]"
                                >
                                    {isMulti && (
                                        <span className="text-xs uppercase tracking-wider font-bold border-b border-[#00ff41]">
                                            [{suspect.name}]
                                        </span>
                                    )}
                                    <div className="flex flex-row gap-4 text-xs font-mono tracking-tight">
                                        <span className={`flex items-center gap-1 ${state.stress >= 100 ? 'text-red-500 animate-pulse' : ''}`}>
                                            <Zap size={10} /> STRESS: {state.stress}%
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <AlertTriangle size={10} /> CONTRADICTION: {state.contradiction}%
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Shield size={10} /> WILLPOWER: {state.willpower}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                {/* 우측: 컨트롤 및 세션 정보 */}
                <div className="flex flex-row gap-3 items-center flex-shrink-0">
                    <span className="text-[10px] text-[#00ff41] font-mono tracking-wider opacity-80 hidden md:block whitespace-nowrap">
                        CONFESS.EXE v1.1.0 - ACTIVE_SESSION ({selectedScenario.name})
                    </span>

                    <button
                        onClick={() => {
                            setSelectedScenario(null);
                            setSetupStep(0);
                            setTempStress(0);
                        }}
                        className="h-8 min-h-8 max-h-8 leading-none text-[10px] font-bold px-3 py-0 border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all uppercase tracking-widest whitespace-nowrap flex items-center"
                        style={{ boxSizing: 'border-box' }}
                    >
                        ABORT_SESSION
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="h-8 w-8 min-h-8 max-h-8 min-w-8 max-w-8 leading-none p-0 border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all flex items-center justify-center flex-shrink-0"
                        style={{ boxSizing: 'border-box' }}
                        title="SETTINGS"
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            {/* 설정 모달 (볼륨 조절) */}
            {isSettingsOpen && (
                <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
                    <div className="settings-card" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center items-center w-full mb-6 border-b border-[#00ff41]/20 pb-2">
                            <h3 className="text-[#00ff41] font-black tracking-[0.2em] text-[10px] m-0">SYSTEM_SETTINGS</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] uppercase tracking-tighter opacity-70">
                                    <span className="flex items-center gap-2"><Volume2 size={12} /> BGM_VOLUME</span>
                                    <span>{Math.round(volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="volume-slider"
                                />
                            </div>
                            <div className="pt-4 border-t border-white/5 text-[8px] opacity-30 text-center uppercase tracking-[0.2em]">
                                CONFESS_OS_CORE_V1.1.0
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="main-layout">
                {/* 메인 심문 구역 (왼쪽 전체 영역) */}
                <div className="chat-column">
                    {/* 채팅 로그 구역 (빨간 네모 - 스크롤 발생 구역) */}
                    <div className="chat-log-area" ref={scrollRef}>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        {(() => {
                            // 표시할 메시지 결정
                            const isMultiSuspect = selectedScenario.suspects.length > 1;
                            const displayMessages = isMultiSuspect && activeSuspectId
                                ? (suspectMessages[activeSuspectId] || [])
                                : messages;

                            if (displayMessages.length === 0) {
                                return (
                                    <div className="text-center mt-20 opacity-50">
                                        심문을 시작하십시오.
                                        {isMultiSuspect && activeSuspectId
                                            ? ` 대상: ${selectedScenario.suspects.find(s => s.id === activeSuspectId)?.name}`
                                            : ` 대상: ${selectedScenario.suspects.map(s => s.name).join(', ')}`
                                        }
                                    </div>
                                );
                            }

                            return displayMessages.map((m, i) => (
                                <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 border ${m.role === 'user' ? 'investigator-msg' : 'border-[#666] text-white bg-[#111]'
                                        } ${m.role === 'system' ? 'border-red-500 text-red-500 w-full text-center' : ''}`}>
                                        <div className="text-[10px] uppercase opacity-50 mb-1">
                                            {m.role === 'user' ? 'Investigator' : (m.assistantName || 'Suspect')}
                                            {m.suspectId && m.role === 'user' && ` > TO: ${selectedScenario.suspects.find(s => s.id === m.suspectId)?.name}`}
                                        </div>
                                        <div className="whitespace-pre-wrap">
                                            {m.content.split(/(<clue>.*?<\/clue>)/g).map((part, index) => {
                                                if (part.startsWith('<clue>') && part.endsWith('</clue>')) {
                                                    const content = part.replace('<clue>', '').replace('</clue>', '');
                                                    return <span key={index} className="clue-text">{content}</span>;
                                                }
                                                return part;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                        {isLoading && <div className="animate-pulse">분석 중...</div>}
                    </div>

                    {/* 질문 타입 선택 및 입력창 (파란 네모 하단 고정) */}
                    <div className="input-area">
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
                            {[
                                { id: 'default', label: '기본', icon: <Send size={14} /> },
                                { id: 'pressure', label: '압박', icon: <Zap size={14} /> },
                                { id: 'confuse', label: '교란', icon: <Brain size={14} /> },
                                { id: 'logic', label: '논리', icon: <Shield size={14} /> },
                                { id: 'soft', label: '회유', icon: <Heart size={14} /> }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedType(t.id as any)}
                                    className={`flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${selectedType === t.id ? 'active-strategy' : ''}`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                        handleSend();
                                    }
                                }}
                                placeholder="질문을 입력하십시오..."
                                className="flex-1"
                            />
                            <button onClick={handleSend} disabled={isLoading} className="px-6 flex items-center gap-2 text-xl">
                                <Send />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 사이드바: 시나리오 및 가이드 */}
                <aside className="sidebar">
                    <section className="info-section">
                        <div className="info-title"><FileText size={16} /> CASE SCENARIO</div>
                        <div className="scenario-text">
                            <p className="mb-2"><strong>사건명:</strong> {selectedScenario.caseName}</p>
                            <p className="mb-4 text-sm">{selectedScenario.description}</p>
                        </div>
                    </section>

                    {/* 다중 용의자 시나리오일 경우에만 용의자 선택 섹션 표시 */}
                    {selectedScenario.suspects.length > 1 && (
                        <section className="info-section">
                            <div className="info-title"><User size={16} /> INTERROGATION TARGET</div>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedScenario.suspects.map(suspect => {
                                    const state = currentState.suspectStates[suspect.id];
                                    const isActive = activeSuspectId === suspect.id;

                                    return (
                                        <button
                                            key={suspect.id}
                                            onClick={() => setActiveSuspectId(suspect.id)}
                                            className={`text-[10px] py-2 px-3 text-left border transition-all ${isActive
                                                ? 'active-strategy border-[#00ff41]'
                                                : 'border-[#333] text-[#888] hover:border-[#00ff41] hover:text-[#00ff41]'
                                                }`}
                                        >
                                            <div className="font-bold">{suspect.name}</div>
                                            <div className="text-[9px] opacity-60 mt-1">{suspect.job}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    <section className="info-section">
                        <div className="info-title"><Briefcase size={16} /> EVIDENCE LOG</div>
                        {Object.keys(clues).length === 0 ? (
                            <div className="text-[10px] opacity-40">아직 발견된 단서가 없습니다.</div>
                        ) : (
                            <div className="space-y-4">
                                {selectedScenario.suspects.map(s => clues[s.id] && (
                                    <div key={s.id} className="suspect-clue-group">
                                        <div className="text-[10px] font-bold text-[#00ff41] mb-1 opacity-60 uppercase tracking-tighter border-b border-[#00ff41]/20">{s.name}</div>
                                        <div className="space-y-1">
                                            {clues[s.id].map((clue, idx) => (
                                                <div key={idx} className="evidence-item text-[11px] animate-in fade-in duration-500">
                                                    {clue}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="info-section">
                        <div className="info-title"><Zap size={16} /> STRATEGY GUIDE</div>
                        <div className="guide-item">
                            <span className="guide-tag">기본</span> 일상적인 질문으로 정보를 얻습니다.
                        </div>
                        <div className="guide-item">
                            <span className="guide-tag">압박</span> 스트레스를 높여 평정심을 깎습니다.
                        </div>
                        <div className="guide-item">
                            <span className="guide-tag">교란</span> 과거 진술의 모순을 유도합니다.
                        </div>
                        <div className="guide-item">
                            <span className="guide-tag">논리</span> 의지력을 직접적으로 깎아냅니다.
                        </div>
                        <div className="guide-item">
                            <span className="guide-tag">회유</span> 경계심을 풀어 솔직함을 유도합니다.
                        </div>
                    </section>

                    <section className="info-section">
                        <div className="info-title"><AlertTriangle size={16} /> SYSTEM NOTES</div>
                        <ul className="text-xs text-[#888] list-disc ml-4 space-y-1">
                            <li>WILLPOWER가 0%에 도달하면 자백합니다.</li>
                            <li>STRESS가 100% 도달 시 <span className="text-red-500 font-bold">SYSTEM OVERLOAD</span>가 발생합니다.</li>
                            <li>오버로드 상태가 <span className="text-white font-bold">3턴간 지속</span>되면 심문이 강제 종료됩니다.</li>
                            <li>폭주 상태에서는 강압적 질문 시 의지력이 회복될 수 있습니다.</li>
                        </ul>
                    </section>

                    {selectedScenario.suspects.length > 1 && (
                        <section className="info-section">
                            <div className="info-title"><Shield size={16} /> IDENTIFY CULPRIT</div>
                            <p className="text-[10px] opacity-50 mb-3">충분한 증거가 확보되었나요? 진범을 지목하십시오.</p>
                            <div className="grid grid-cols-1 gap-2">
                                {selectedScenario.suspects.map(s => (
                                    <button
                                        key={s.id}
                                        className="text-[10px] py-2 px-3 text-left border border-[#333] text-[#888] hover:border-[#00ff41] hover:text-[#00ff41] transition-all"
                                        onClick={() => {
                                            setIsCulpritSelected(true);
                                            setCulpritResult({ success: s.isCulprit, name: s.name });
                                        }}
                                    >
                                        <div className="font-bold">{s.name}</div>
                                        <div className="text-[9px] opacity-60 mt-1">{s.job}</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="info-section">
                        <div className="info-title"><User size={16} /> INVESTIGATIVE NOTES</div>
                        <textarea
                            className="investigative-notes"
                            placeholder="사건에 관한 메모를 남기십시오..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </section>
                </aside>
            </div>
        </main>
    );
}
