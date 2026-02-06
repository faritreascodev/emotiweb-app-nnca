import { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { useSound } from '../../hooks/useSound';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Star, Volume2 } from 'lucide-react';

interface Question {
    id: number;
    texto: string;
    imagen: string;
    emocion_correcta: string;
}

const EMOTIONS = {
    joy: { name: 'Alegría', emoji: '😊', color: 'bg-[#FFD93D]', hover: 'hover:bg-[#FFC93C]', border: 'border-[#E6B300]' },
    sadness: { name: 'Tristeza', emoji: '😢', color: 'bg-[#6B9FFF]', hover: 'hover:bg-[#5A8EE6]', border: 'border-[#4A7AC2]' },
    anger: { name: 'Enojo', emoji: '😠', color: 'bg-[#FF6B6B]', hover: 'hover:bg-[#EE5A5A]', border: 'border-[#D94E4E]' },
    fear: { name: 'Miedo', emoji: '😨', color: 'bg-[#A78BFA]', hover: 'hover:bg-[#9067F9]', border: 'border-[#7C3AED]' },
    surprise: { name: 'Sorpresa', emoji: '😲', color: 'bg-[#FF9F43]', hover: 'hover:bg-[#EF8E33]', border: 'border-[#D97706]' },
};

export function SituationGame() {
    const { finishSession } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'feedback' | 'finished'>('loading');
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadGame = useCallback(async () => {
        try {
            const data = await apiService.getGameQuestions('situation');
            if (data && data.length > 0) {
                setQuestions(data);
                setGameState('playing');
                setTimeout(() => speak(data[0].texto), 800);
            } else {
                setGameState('finished');
            }
        } catch (error) {
            console.error("Error loading questions", error);
            navigate('/');
        }
    }, [speak, navigate]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    const handleAnswer = (emotionId: string) => {
        if (gameState !== 'playing') return;

        setSelectedId(emotionId);
        const currentQ = questions[currentIndex];
        const correct = emotionId === currentQ.emocion_correcta;

        setIsCorrect(correct);
        setGameState('feedback');

        if (correct) {
            setScore(s => s + 1);
            playEffect('correct');
        } else {
            playEffect('wrong');
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                const next = currentIndex + 1;
                setCurrentIndex(next);
                setGameState('playing');
                setSelectedId(null);
                speak(questions[next].texto);
            } else {
                handleFinish();
            }
        }, 1800);
    };

    const handleFinish = async () => {
        setGameState('finished');
        playEffect('win');
        await finishSession(questions.length, score + (isCorrect ? 1 : 0));
    };

    if (gameState === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-white">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Star size={64} className="text-yellow-400 fill-yellow-400" />
                </motion.div>
                <p className="mt-4 text-2xl font-display">¡Buscando aventuras!</p>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 p-12 rounded-[50px] shadow-2xl text-center border-8 border-yellow-400 max-w-lg"
                >
                    <div className="text-9xl mb-6">🏆</div>
                    <h2 className="text-5xl font-display font-black text-indigo-900 mb-4">¡GENIAL!</h2>
                    <p className="text-2xl text-indigo-600 mb-8 font-bold">
                        Ganaste {score} Estrellas
                    </p>
                    <div className="flex justify-center gap-2 mb-10">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: i < score ? 1.2 : 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <StarIcon key={i} filled={i < score} />
                            </motion.div>
                        ))}
                    </div>
                    <Button onClick={() => navigate('/')} size="lg" className="w-full text-xl h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 shadow-xl">
                        ¡Ir a más Juegos!
                    </Button>
                </motion.div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="flex flex-col items-center w-full min-h-[550px] p-4 relative overflow-hidden">
            <div className="w-full flex justify-between items-center mb-8 px-4">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-2xl shadow-lg border-b-4 border-yellow-600">
                        <Star className="text-white fill-white" size={24} />
                    </div>
                    <span className="text-2xl font-black text-white drop-shadow-md">{score}</span>
                </div>

                <div className="flex gap-2">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-4 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-10 bg-yellow-400' : i < currentIndex ? 'w-4 bg-green-400' : 'w-4 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'feedback' ? (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.2, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="flex flex-col items-center justify-center flex-grow"
                    >
                        {isCorrect ? (
                            <div className="bg-green-400 p-10 rounded-[60px] border-b-8 border-green-600 shadow-2xl">
                                <CheckCircle size={150} className="text-white mb-4" />
                                <h2 className="text-6xl text-white font-black drop-shadow-md italic uppercase">¡Súper!</h2>
                            </div>
                        ) : (
                            <div className="bg-red-400 p-10 rounded-[60px] border-b-8 border-red-600 shadow-2xl">
                                <XCircle size={150} className="text-white mb-4" />
                                <h2 className="text-4xl text-white font-black drop-shadow-md italic uppercase">¡Casi casi!</h2>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex flex-col items-center w-full max-w-4xl flex-grow justify-center"
                    >
                        <div className="bg-white p-2 rounded-[50px] shadow-2xl mb-10 w-full relative">
                            <div className="bg-indigo-50 p-8 rounded-[45px] border-4 border-dashed border-indigo-200 flex flex-col items-center">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-9xl mb-6 drop-shadow-xl"
                                >
                                    {currentQ.imagen}
                                </motion.div>

                                <div className="space-y-4 text-center">
                                    <h2 className="text-3xl md:text-5xl font-black text-indigo-900 leading-tight">
                                        {currentQ.texto}
                                    </h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => speak(currentQ.texto)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-3xl flex items-center gap-3 font-bold mx-auto shadow-lg"
                                    >
                                        <Volume2 size={32} /> Escuchar de nuevo
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full px-2">
                            {Object.entries(EMOTIONS).map(([key, config]) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.1, y: -10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAnswer(key)}
                                    className={`
                                        flex flex-col items-center justify-center p-6 rounded-[35px]
                                        ${config.color} ${config.hover} border-b-8 ${config.border}
                                        shadow-xl transition-all h-full min-h-[160px]
                                        ${selectedId === key ? 'ring-8 ring-white' : ''}
                                    `}
                                >
                                    <span className="text-6xl mb-3 filter drop-shadow-lg">{config.emoji}</span>
                                    <span className={`font-black text-xl text-indigo-950`}>{config.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StarIcon({ filled }: { filled: boolean }) {
    return (
        <Star
            size={48}
            className={`${filled ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' : 'text-indigo-100 fill-indigo-100'}`}
        />
    );
}
