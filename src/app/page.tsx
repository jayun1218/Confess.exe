'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, InteractionState, GameResponse, Scenario } from '@/types';
import { scenarios } from '@/data/scenarios';
import { Shield, Brain, Zap, Heart, AlertTriangle, Send, User, Briefcase, FileText } from 'lucide-react';

export default function Home() {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentState, setCurrentState] = useState<InteractionState>({
        stress: 0,
        contradiction: 0,
        deception: 0,
        willpower: 100
    });
    const [selectedType, setSelectedType] = useState<ChatMessage['type']>('default');

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectScenario = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setCurrentState(scenario.initialStatus);
        setMessages([]);
    };

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
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
                setCurrentState(data.state);

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

    if (!selectedScenario) {
        return (
            <main className="container flex items-center justify-center min-h-screen">
                <div className="w-full max-w-6xl px-4">
                    <h1 className="text-4xl text-center mb-16 glow-text tracking-[0.3em]">SELECT_SCENARIO</h1>
                    <div className="scenario-container hide-scrollbar">
                        {scenarios.map((s) => (
                            <div
                                key={s.id}
                                className="scenario-card p-10 cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                                onClick={() => handleSelectScenario(s)}
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
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container">
            {/* 상단 상태 바 */}
            <div className="status-bar glow-text">
                <div className="flex gap-12">
                    <span className="flex items-center gap-2"><Zap size={14} /> STRESS: {currentState.stress}%</span>
                    <span className="flex items-center gap-2"><AlertTriangle size={14} /> CONTRADICTION: {currentState.contradiction}%</span>
                    <span className="flex items-center gap-2"><Shield size={14} /> WILLPOWER: {currentState.willpower}%</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setSelectedScenario(null)}
                        className="text-[10px] py-0 px-2 border-[#555] text-[#888] hover:border-[#00ff41] hover:text-[#00ff41]"
                    >
                        ABORT_SESSION
                    </button>
                    <span>CONFESS.EXE v1.0.4 - ACTIVE_SESSION ({selectedScenario.name})</span>
                </div>
            </div>

            <div className="main-layout flex-1 pt-4 overflow-hidden">
                {/* 메인 심문 구역 */}
                <div className="flex flex-col h-full overflow-hidden">
                    {/* 채팅 로그 구역 */}
                    <div className="flex-1 overflow-y-auto mb-4 p-4 border border-[#333] bg-black/50 relative" ref={scrollRef}>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        {messages.length === 0 && (
                            <div className="text-center mt-20 opacity-50">심문을 시작하십시오. 대상은 {selectedScenario.job} {selectedScenario.name}입니다.</div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 border ${m.role === 'user' ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#666] text-white bg-[#111]'
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

                    {/* 질문 타입 선택 및 입력창 */}
                    <div className="bg-[#111] p-4 border border-[#333]">
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
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
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
                            <li>STRESS가 높을수록 답변이 거칠어집니다.</li>
                            <li>CONTRADICTION은 결정적 증거가 됩니다.</li>
                        </ul>
                    </section>
                </aside>
            </div>
        </main>
    );
}
