import { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { useSound } from '../../hooks/useSound';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Volume2, ArrowRight } from 'lucide-react';

interface Question {
    id: number;
    texto: string;
    imagen: string;
    emocion_correcta: string;
}

const EMOTIONS = {
    joy: { name: 'Alegría', emoji: '😊', color: 'bg-[#FFD93D]', border: 'border-[#E6B300]' },
    sadness: { name: 'Tristeza', emoji: '😢', color: 'bg-[#6B9FFF]', border: 'border-[#4A7AC2]' },
    anger: { name: 'Enojo', emoji: '😠', color: 'bg-[#FF6B6B]', border: 'border-[#D94E4E]' },
    fear: { name: 'Miedo', emoji: '😨', color: 'bg-[#A78BFA]', border: 'border-[#7C3AED]' },
    surprise: { name: 'Sorpresa', emoji: '😲', color: 'bg-[#FF9F43]', border: 'border-[#D97706]' },
};

export function StoryGame() {
    const { finishSession, sessionId } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'narrative' | 'questioning' | 'finished'>('loading');
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadGame = useCallback(async () => {
        try {
            const data = await apiService.getGameQuestions('story');
            if (data && data.length > 0) {
                setQuestions(data);
                setGameState('narrative');
                setTimeout(() => speak(data[0].texto), 800);
            } else {
                setGameState('finished');
            }
        } catch (error) {
            console.error("Error loading story", error);
            navigate('/');
        }
    }, [speak, navigate]);

    useEffect(() => {
        loadGame();
    }, [loadGame]);

    const handleAnswer = async (emotionId: string) => {
        if (gameState !== 'questioning') return;

        setSelectedId(emotionId);
        const currentQ = questions[currentIndex];
        const correct = emotionId === currentQ.emocion_correcta;

        try {
            if (sessionId) {
                await apiService.recordAnswer(sessionId, {
                    situacionId: currentQ.id,
                    emocionSeleccionada: emotionId,
                    emocionCorrecta: currentQ.emocion_correcta,
                    numeroRonda: currentIndex + 1,
                    tiempoRespuesta: 0
                });
            }
        } catch (e) {
            console.error(e);
        }

        setIsCorrect(correct);
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
                setGameState('narrative');
                setSelectedId(null);
                speak(questions[next].texto);
            } else {
                handleFinish();
            }
        }, 1500);
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
                    <BookOpen size={64} className="text-white" />
                </motion.div>
                <p className="mt-4 text-2xl font-display font-bold">Abriendo el libro mágico...</p>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 p-12 rounded-[60px] shadow-2xl text-center border-8 border-purple-400 max-w-lg"
                >
                    <div className="text-9xl mb-6">📖</div>
                    <h2 className="text-5xl font-display font-black text-indigo-900 mb-4">¡FIN DEL CUENTO!</h2>
                    <p className="text-2xl text-indigo-600 mb-8 font-bold">
                        Completaste la historia y ganaste {score} estrellas
                    </p>
                    <Button onClick={() => navigate('/')} size="lg" className="w-full text-xl h-16 rounded-3xl bg-purple-600 hover:bg-purple-700 shadow-xl border-b-6 border-purple-900">
                        ¡Elegir otro cuento!
                    </Button>
                </motion.div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto min-h-[600px] p-6">
            {/* Header: Progress */}
            <div className="w-full flex justify-between items-center mb-10 px-6">
                <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-md">
                    <Star className="text-yellow-400 fill-yellow-400" size={28} />
                    <span className="text-3xl font-black text-white">{score}</span>
                </div>
                <div className="flex gap-3">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-4 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-16 bg-white' : i < currentIndex ? 'w-4 bg-green-400' : 'w-4 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Book UI */}
            <div className="w-full bg-orange-50 rounded-[40px] shadow-2xl overflow-hidden border-[16px] border-white relative min-h-[450px] flex flex-col md:flex-row">
                {/* Left Page: Illustration */}
                <div className="md:w-1/2 p-10 bg-indigo-50 border-r-2 border-dashed border-indigo-200 flex items-center justify-center relative">
                    <motion.div
                        key={currentQ.imagen}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-[12rem] drop-shadow-2xl"
                    >
                        {currentQ.imagen}
                    </motion.div>
                </div>

                {/* Right Page: Text and Interaction */}
                <div className="md:w-1/2 p-12 flex flex-col justify-center items-center text-center bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="relative">
                                <p className="text-3xl font-display font-medium text-indigo-950 leading-relaxed italic">
                                    "{currentQ.texto}"
                                </p>
                            </div>

                            {gameState === 'narrative' ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setGameState('questioning')}
                                    className="px-10 py-6 bg-indigo-600 text-white rounded-[30px] font-black text-2xl flex items-center gap-4 shadow-xl hover:bg-orange-500 transition-colors mx-auto border-b-6 border-indigo-900 uppercase"
                                >
                                    ¿Cómo se siente? <ArrowRight size={28} />
                                </motion.button>
                            ) : (
                                <div className="space-y-6">
                                    <p className="text-lg font-black text-indigo-400 uppercase tracking-widest">¿Qué emoción ves en esta parte?</p>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(EMOTIONS).map(([key, config]) => (
                                            <motion.button
                                                key={key}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleAnswer(key)}
                                                className={`
                                                    flex flex-col items-center justify-center p-4 rounded-3xl
                                                    ${config.color} border-b-4 ${config.border} shadow-lg
                                                    ${selectedId === key ? 'ring-4 ring-indigo-600' : ''}
                                                    ${selectedId && key === currentQ.emocion_correcta ? 'ring-4 ring-green-500' : ''}
                                                `}
                                            >
                                                <span className="text-4xl">{config.emoji}</span>
                                                <span className="text-xs font-black text-indigo-950 uppercase">{config.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => speak(currentQ.texto)}
                                className="p-4 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all mx-auto block"
                            >
                                <Volume2 size={32} />
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
