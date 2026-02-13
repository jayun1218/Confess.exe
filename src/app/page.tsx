'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, InteractionState, GameResponse } from '@/types';
import { Shield, Brain, Zap, Heart, AlertTriangle, Send } from 'lucide-react';

export default function Home() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentState, setCurrentState] = useState<InteractionState>({
        stress: 20,
        contradiction: 0,
        deception: 30,
        willpower: 100
    });
    const [selectedType, setSelectedType] = useState<ChatMessage['type']>('default');

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

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
                    questionType: selectedType
                }),
            });

            const data: GameResponse = await response.json();

            if (data.answer) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
                setCurrentState(data.state);

                if (data.isConfessed) {
                    setMessages(prev => [...prev, { role: 'system', content: "SYSTEM: 대상이 자백했습니다. 임무 완료." }]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container">
            {/* 상단 상태 바 */}
            <div className="status-bar glow-text">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2"><Zap size={14} /> STRESS: {currentState.stress}%</span>
                    <span className="flex items-center gap-2"><AlertTriangle size={14} /> CONTRADICTION: {currentState.contradiction}%</span>
                    <span className="flex items-center gap-2"><Shield size={14} /> WILLPOWER: {currentState.willpower}%</span>
                </div>
                <div>CONFESS.EXE v1.0.4 - ACTIVE_SESSION</div>
            </div>

            <div className="main-layout flex-1 pt-4 overflow-hidden">
                {/* 메인 심문 구역 */}
                <div className="flex flex-col h-full overflow-hidden">
                    {/* 채팅 로그 구역 */}
                    <div className="flex-1 overflow-y-auto mb-4 p-4 border border-[#333] bg-black/50 relative" ref={scrollRef}>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        {messages.length === 0 && (
                            <div className="text-center mt-20 opacity-50">심문을 시작하십시오. 대상은 살인 용의자 강도훈입니다.</div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 border ${m.role === 'user' ? 'border-[#00ff41] text-[#00ff41]' : 'border-[#666] text-white bg-[#111]'
                                    } ${m.role === 'system' ? 'border-red-500 text-red-500 w-full text-center' : ''}`}>
                                    <div className="text-[10px] uppercase opacity-50 mb-1">{m.role === 'user' ? 'Investigator' : 'Suspect'}</div>
                                    <div className="whitespace-pre-wrap">{m.content}</div>
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
                        <div className="info-title"><Brain size={16} /> CASE SCENARIO</div>
                        <div className="scenario-text">
                            <p className="mb-2"><strong>사건명:</strong> 서초동 저택 살인 사건</p>
                            <p className="mb-2"><strong>용의자:</strong> 강도훈 (42세, IT 사업가)</p>
                            <p className="mb-4 text-sm">피해자는 강도훈의 오랜 비즈니스 파트너였으며, 자신의 자택 서재에서 살해된 채 발견되었습니다. 강도훈은 범행 현장 근처에서 목격되었으나 알리바이를 주장하며 모든 혐의를 부인하고 있습니다.</p>
                            <p className="text-xs text-[#666]">현장에는 외부 침입 흔적이 없으나, 당신은 그가 알지 못하는 '비밀 통로'가 있을 것으로 의심하고 있습니다.</p>
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
