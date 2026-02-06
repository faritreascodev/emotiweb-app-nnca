import { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Star, Loader2, Volume2 } from 'lucide-react';
import { apiService } from '../../api/apiService';

export function FaceMatchGame() {
    const { finishSession } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [rounds, setRounds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'feedback' | 'finished'>('loading');
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadGameData = useCallback(async () => {
        try {
            const emotions = await apiService.getGameQuestions('face-match');
            if (!emotions || emotions.length < 3) throw new Error("No hay suficientes emociones.");

            const newRounds = emotions.map((target: any) => {
                const others = emotions.filter((e: any) => e.emocion_correcta !== target.emocion_correcta);
                const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 2);
                const options = [target, ...distractors].sort(() => 0.5 - Math.random());

                return {
                    target: {
                        id: target.emocion_correcta,
                        name: target.texto,
                        emoji: target.imagen
                    },
                    options: options.map((opt: any) => ({
                        id: opt.emocion_correcta,
                        emoji: opt.imagen
                    }))
                };
            });

            setRounds(newRounds);
            setGameState('playing');
            setTimeout(() => speak(`¿Cuál es la carita de ${newRounds[0].target.name}?`), 800);
        } catch (error) {
            console.error("Error loading game:", error);
            navigate('/');
        }
    }, [speak, navigate]);

    useEffect(() => {
        loadGameData();
    }, [loadGameData]);

    const handleAnswer = (selectedId: string) => {
        if (gameState !== 'playing') return;

        setSelectedId(selectedId);
        const currentRound = rounds[currentIndex];
        const correct = selectedId === currentRound.target.id;

        setIsCorrect(correct);
        setGameState('feedback');

        if (correct) {
            setScore(s => s + 1);
            playEffect('correct');
        } else {
            playEffect('wrong');
        }

        setTimeout(() => {
            if (currentIndex < rounds.length - 1) {
                const next = currentIndex + 1;
                setCurrentIndex(next);
                setGameState('playing');
                setSelectedId(null);
                speak(`¿Cuál es la carita de ${rounds[next].target.name}?`);
            } else {
                handleFinish();
            }
        }, 1800);
    };

    const handleFinish = async () => {
        setGameState('finished');
        playEffect('win');
        await finishSession(rounds.length, score + (isCorrect ? 1 : 0));
    };

    if (gameState === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-white">
                <Loader2 className="animate-spin mb-4" size={64} />
                <p className="text-2xl font-display">¡Preparando caritas!</p>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 rounded-[60px] shadow-2xl text-center border-8 border-yellow-400 max-w-lg"
                >
                    <div className="text-9xl mb-6">🎯</div>
                    <h2 className="text-5xl font-display font-black text-indigo-900 mb-4">¡LO LOGRASTE!</h2>
                    <div className="text-7xl mb-6 font-black text-yellow-500">🌟 {score}</div>
                    <p className="text-xl text-indigo-600 mb-8 font-bold">¡Eres experto/a en emociones!</p>
                    <Button onClick={() => navigate('/')} size="lg" className="w-full text-xl h-16 rounded-3xl bg-indigo-600 shadow-xl">
                        Seguir Explorando
                    </Button>
                </motion.div>
            </div>
        );
    }

    const currentRound = rounds[currentIndex];

    return (
        <div className="flex flex-col items-center w-full min-h-[550px] p-4 relative">
            {/* Kid Header */}
            <div className="w-full flex justify-between items-center mb-8 px-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-400 p-2 rounded-2xl shadow-lg border-b-4 border-orange-600">
                        <Star className="text-white fill-white" size={24} />
                    </div>
                    <span className="text-2xl font-black text-white">{score} / {rounds.length}</span>
                </div>

                <div className="flex bg-white/10 p-2 rounded-3xl gap-4">
                    {rounds.map((_, i) => (
                        <div
                            key={i}
                            className={`h-4 w-4 rounded-full ${i === currentIndex ? 'bg-yellow-400 animate-pulse' : i < currentIndex ? 'bg-green-400' : 'bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'feedback' ? (
                    <motion.div
                        key="feedback"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="flex-grow flex flex-col items-center justify-center"
                    >
                        {isCorrect ? (
                            <div className="bg-yellow-400 p-12 rounded-[70px] border-b-8 border-yellow-600 shadow-2xl">
                                <CheckCircle size={160} className="text-white mb-4" />
                                <h2 className="text-6xl text-white font-black italic uppercase drop-shadow-md">¡SÍ!</h2>
                            </div>
                        ) : (
                            <div className="bg-purple-400 p-12 rounded-[70px] border-b-8 border-purple-600 shadow-2xl">
                                <XCircle size={160} className="text-white mb-4" />
                                <h2 className="text-4xl text-white font-black italic uppercase drop-shadow-md">¡Casi!</h2>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-4xl text-center flex flex-col items-center"
                    >
                        <div className="bg-indigo-600/30 p-8 rounded-[50px] border-4 border-white/20 mb-12 backdrop-blur-md">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                ¿Cuál es <span className="text-yellow-400 drop-shadow-lg underline decoration-white/30 decoration-8">{currentRound.target.name}</span>?
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => speak(`¿Cuál es la carita de ${currentRound.target.name}?`)}
                                className="mt-6 mx-auto bg-white/20 px-6 py-3 rounded-2xl flex items-center gap-2 text-white font-bold hover:bg-white/30"
                            >
                                <Volume2 size={24} /> Oír de nuevo
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap justify-center gap-10">
                            {currentRound.options.map((option: any, idx: number) => (
                                <motion.button
                                    key={`${option.id}-${idx}`}
                                    whileHover={{ scale: 1.2, rotate: idx % 2 === 0 ? 8 : -8, y: -20 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => handleAnswer(option.id)}
                                    className={`
                                        text-[120px] p-12 rounded-[60px] transition-all shadow-2xl
                                        ${selectedId === option.id ? 'bg-yellow-400 border-white border-8 scale-125' : 'bg-white hover:bg-yellow-50'}
                                        border-b-[16px] border-gray-200 hover:border-yellow-200
                                    `}
                                >
                                    <span className="drop-shadow-xl block transform-gpu">{option.emoji}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
