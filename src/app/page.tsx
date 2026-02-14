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
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentState, setCurrentState] = useState<InteractionState>({
        stress: 0,
        contradiction: 0,
        deception: 0,
        willpower: 100,
        stressPeakTurns: 0
    });
    const [selectedType, setSelectedType] = useState<ChatMessage['type']>('default');
    const [clues, setClues] = useState<string[]>([]);
    const [notes, setNotes] = useState<string>('');
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
        setClues([]);
        setNotes('');
    };

    const handleSetupChoice = (stressBonus: number) => {
        const nextStress = tempStress + stressBonus;
        if (setupStep < 3) {
            setTempStress(nextStress);
            setSetupStep(prev => prev + 1);
        } else {
            if (selectedScenario) {
                const finalStatus = {
                    ...selectedScenario.initialStatus,
                    stress: nextStress
                };
                setCurrentState(finalStatus);
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

        const userMessage: ChatMessage = { role: 'user', content: input, type: selectedType };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/interrogate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    currentState,
                    questionType: selectedType,
                    scenarioId: selectedScenario.id
                }),
            });

            const data: GameResponse = await response.json();

            if (data.answer) {
                // 스트레스 100% 지속 여부 확인
                let nextPeakTurns = 0;
                if (data.state.stress >= 100) {
                    nextPeakTurns = (currentState.stressPeakTurns || 0) + 1;
                }

                // 3턴 지속 시 강제 종료
                if (nextPeakTurns >= 3) {
                    setMessages(prev => [...prev,
                    { role: 'assistant', content: data.answer },
                    { role: 'system', content: "CRITICAL SYSTEM FAILURE: 용의자의 상태가 통제 불능입니다. 의료진에 의해 심문이 강제 중단되었습니다. 접속을 해제합니다..." }
                    ]);
                    setTimeout(() => {
                        setSelectedScenario(null);
                    }, 3000);
                    return;
                }

                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
                setCurrentState({ ...data.state, stressPeakTurns: nextPeakTurns });

                // 단서 추출 로직
                const clueMatches = data.answer.match(/<clue>(.*?)<\/clue>/g);
                if (clueMatches) {
                    const newClues = clueMatches.map(m => m.replace(/<\/?clue>/g, ''));
                    setClues(prev => {
                        const uniqueClues = new Set([...prev, ...newClues]);
                        return Array.from(uniqueClues);
                    });
                }

                if (data.isConfessed) {
                    setMessages(prev => [...prev, { role: 'system', content: `SYSTEM: 대상(${selectedScenario.name})이 자백했습니다. 임무 완료.` }]);
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
            <main className="container flex items-center justify-center min-h-screen">
                <div className="w-full max-w-6xl px-4">
                    <h1 className="text-4xl text-center mb-16 glow-text tracking-[0.3em]">SELECT_SCENARIO</h1>
                    <div className="scenario-container hide-scrollbar">
                        {scenarios.map((s) => (
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
                                            <span className="text-[8px] uppercase opacity-50">Age</span>
                                            <span className="text-lg font-bold">{s.age}</span>
                                        </div>
                                        <div className="flex flex-col border-l border-[#00ff41] pl-3">
                                            <span className="text-[8px] uppercase opacity-50">Occupation</span>
                                            <span className="text-lg font-bold uppercase truncate">{s.job}</span>
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

    return (
        <main className={`container ${currentState.stress >= 100 ? 'main-glitch' : ''}`}>
            {/* 전체 화면 오버레이 레이어 */}
            {currentState.stress >= 100 && (
                <>
                    <div className="overload-overlay" />
                    <div className="error-window" style={{ top: '20%', left: '15%', animationDelay: '0s' }}>ACCESS_DENIED: RESOURCE_LOCKED</div>
                    <div className="error-window" style={{ top: '50%', left: '60%', animationDelay: '1.2s' }}>MEMORY_SEGMENTATION_FAULT</div>
                    <div className="error-window" style={{ top: '40%', left: '30%', animationDelay: '0.5s' }}>CORE_DUMP_IN_PROGRESS</div>
                    <div className="error-window" style={{ top: '70%', left: '10%', animationDelay: '2.3s' }}>UNKNOWN_EXCEPTION_DETECTED</div>
                </>
            )}

            {/* 상단 상태 바 */}
            <div className={`status-bar glow-text ${currentState.stress >= 100 ? 'border-red-500' : ''}`}>
                <div className="flex gap-12">
                    <span className={`flex items-center gap-2 ${currentState.stress >= 100 ? 'overload-text status-glitch' : ''}`}>
                        <Zap size={14} /> STRESS: {currentState.stress >= 100 ? 'ERR_MAX' : `${currentState.stress}%`}
                    </span>
                    <span className={`flex items-center gap-2 ${currentState.stress >= 100 ? 'overload-text status-glitch' : ''}`}>
                        <AlertTriangle size={14} /> CONTRADICTION: {currentState.stress >= 100 ? 'ERR_OVERLOAD' : `${currentState.contradiction}%`}
                    </span>
                    <span className={`flex items-center gap-2 ${currentState.stress >= 100 ? 'overload-text status-glitch' : ''}`}>
                        <Shield size={14} /> WILLPOWER: {currentState.stress >= 100 ? 'SYSTEM_UNSTABLE' : `${currentState.willpower}%`}
                    </span>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => {
                            setSelectedScenario(null);
                            setSetupStep(0);
                            setTempStress(0);
                        }}
                        className="text-[10px] py-0 px-2 border-[#555] text-[#888] hover:border-[#00ff41] hover:text-[#00ff41] whitespace-nowrap"
                    >
                        ABORT_SESSION
                    </button>
                    <span className="whitespace-nowrap">CONFESS.EXE v1.0.4 - ACTIVE_SESSION ({selectedScenario.name})</span>
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-1 border-none hover:text-[#00ff41] transition-colors"
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
                                CONFESS_OS_CORE_V1.0.4
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
                        {messages.length === 0 && (
                            <div className="text-center mt-20 opacity-50">심문을 시작하십시오. 대상은 {selectedScenario.job} {selectedScenario.name}입니다.</div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 border ${m.role === 'user' ? 'investigator-msg' : 'border-[#666] text-white bg-[#111]'
                                    } ${m.role === 'system' ? 'border-red-500 text-red-500 w-full text-center' : ''}`}>
                                    <div className="text-[10px] uppercase opacity-50 mb-1">{m.role === 'user' ? 'Investigator' : 'Suspect'}</div>
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
                        ))}
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
                            <p className="mb-2"><strong>용의자:</strong> {selectedScenario.name} ({selectedScenario.age}세, {selectedScenario.job})</p>
                            <p className="mb-4 text-sm">{selectedScenario.description}</p>
                        </div>
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

                    <section className="info-section">
                        <div className="info-title"><Briefcase size={16} /> EVIDENCE LOG</div>
                        {clues.length === 0 ? (
                            <div className="text-[10px] opacity-40">아직 발견된 단서가 없습니다.</div>
                        ) : (
                            <div className="space-y-1">
                                {clues.map((clue, idx) => (
                                    <div key={idx} className="evidence-item animate-in fade-in duration-500">
                                        {clue}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

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
