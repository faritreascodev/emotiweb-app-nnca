import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { apiService } from '../../api/apiService';

interface EmotionItem {
    id: string;
    name: string;
    emoji: string;
    color: string;
}

export function DragDropGame() {
    const { finishSession } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [emotions, setEmotions] = useState<EmotionItem[]>([]);
    const [targets, setTargets] = useState<EmotionItem[]>([]);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, boolean>>({});
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished'>('loading');

    const loadData = useCallback(async () => {
        try {
            const data = await apiService.getGameQuestions('drag-drop');
            const items = data.map((d: any) => ({
                id: d.emocion_correcta,
                name: d.texto,
                emoji: d.imagen,
                color: '#FFD93D'
            }));
            setEmotions([...items].sort(() => 0.5 - Math.random()));
            setTargets([...items].sort(() => 0.5 - Math.random()));
            setGameState('playing');
            speak("¡Une cada carita con su nombre!");
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    }, [speak, navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSelectEmoji = (id: string) => {
        if (matches[id]) return;
        setSelectedEmoji(id);
        playEffect('click');
    };

    const handleSelectTarget = (id: string) => {
        if (!selectedEmoji) return;

        if (selectedEmoji === id) {
            playEffect('correct');
            setMatches(prev => ({ ...prev, [id]: true }));
            setSelectedEmoji(null);

            if (Object.keys(matches).length + 1 === targets.length) {
                setTimeout(handleFinish, 1000);
            }
        } else {
            playEffect('wrong');
            setSelectedEmoji(null);
        }
    };

    const handleFinish = async () => {
        setGameState('finished');
        playEffect('win');
        await finishSession(targets.length, targets.length);
    };

    if (gameState === 'loading') return (
        <div className="h-[500px] flex flex-col items-center justify-center text-white">
            <Loader2 className="animate-spin text-yellow-400" size={64} />
            <p className="mt-4 text-2xl font-black italic tracking-tight">¡PREPARANDO EL ROMPECABEZAS!</p>
        </div>
    );

    if (gameState === 'finished') return (
        <div className="min-h-[500px] flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-white p-12 rounded-[60px] shadow-2xl border-b-[16px] border-yellow-500 text-center"
            >
                <div className="text-9xl mb-6">🏆</div>
                <h2 className="text-6xl font-black text-indigo-900 mb-2 italic uppercase">¡FANTÁSTICO!</h2>
                <p className="text-2xl text-indigo-600 font-bold mb-8">Puntaje Perfecto: {targets.length}/{targets.length}</p>
                <Button onClick={() => navigate('/')} size="lg" className="w-full h-16 rounded-3xl text-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl">
                    Siguiente Aventura
                </Button>
            </motion.div>
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full min-h-[550px] p-6 lg:p-10">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-black text-white drop-shadow-lg italic mb-2 tracking-tight">
                    ¡UNE LAS PAREJAS! 🧩
                </h2>
                <p className="text-purple-200 text-xl font-bold flex items-center justify-center gap-3">
                    Toca una carita y luego su nombre <SparkleIcon size={24} />
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-5xl">
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-black text-yellow-400 uppercase italic mb-2 text-center md:text-left tracking-widest bg-yellow-400/10 py-2 px-6 rounded-full w-fit mx-auto md:mx-0">
                        Caritas
                    </h3>
                    {emotions.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={!matches[item.id] ? { scale: 1.05, x: 10 } : {}}
                            whileTap={!matches[item.id] ? { scale: 0.95 } : {}}
                            onClick={() => handleSelectEmoji(item.id)}
                            className={`
                                p-6 rounded-[40px] flex items-center gap-6 shadow-xl border-b-8 transition-all relative
                                ${matches[item.id] ? 'bg-green-400 border-green-600 opacity-50' : selectedEmoji === item.id ? 'bg-yellow-400 border-yellow-600 scale-105 ring-8 ring-white/30' : 'bg-white border-gray-200 hover:bg-yellow-50'}
                            `}
                        >
                            <span className="text-7xl drop-shadow-md">{item.emoji}</span>
                            {matches[item.id] && <CheckCircle className="text-white ml-auto" size={40} />}
                        </motion.button>
                    ))}
                </div>

                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-black text-blue-400 uppercase italic mb-2 text-center md:text-left tracking-widest bg-blue-400/10 py-2 px-6 rounded-full w-fit mx-auto md:mx-0">
                        Nombres
                    </h3>
                    {targets.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={!matches[item.id] ? { scale: 1.05, x: -10 } : {}}
                            whileTap={!matches[item.id] ? { scale: 0.95 } : {}}
                            onClick={() => handleSelectTarget(item.id)}
                            className={`
                                p-8 rounded-[40px] text-center shadow-xl border-b-8 transition-all h-[120px] flex items-center justify-center
                                ${matches[item.id] ? 'bg-green-400 border-green-600 opacity-50' : 'bg-white border-gray-200 hover:bg-blue-50'}
                            `}
                        >
                            <span className={`text-3xl font-black ${matches[item.id] ? 'text-white italic uppercase' : 'text-indigo-950 uppercase'}`}>
                                {item.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedEmoji && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 bg-yellow-400 text-indigo-900 px-10 py-4 rounded-full font-black text-2xl shadow-2xl border-b-8 border-yellow-600 z-50 flex items-center gap-4"
                    >
                        <Sparkles /> ¿Dónde va esta carita?
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SparkleIcon({ size }: { size: number }) {
    return (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Sparkles className="text-yellow-400" size={size} />
        </motion.div>
    );
}
