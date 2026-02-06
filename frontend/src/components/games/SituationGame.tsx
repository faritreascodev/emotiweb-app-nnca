import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { useSound } from '../../hooks/useSound';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
    id: number;
    texto: string;
    imagen: string; // Emoji
    emocion_correcta: string;
}

const EMOTIONS = {
    joy: { name: 'Alegría', emoji: '😊', color: 'bg-yellow-400', text: 'text-yellow-900' },
    sadness: { name: 'Tristeza', emoji: '😢', color: 'bg-blue-400', text: 'text-blue-900' },
    anger: { name: 'Enojo', emoji: '😠', color: 'bg-red-400', text: 'text-red-900' },
    fear: { name: 'Miedo', emoji: '😨', color: 'bg-purple-400', text: 'text-purple-900' },
    surprise: { name: 'Sorpresa', emoji: '😲', color: 'bg-orange-400', text: 'text-orange-900' },
};

export function SituationGame() {
    const { currentGameId, finishSession } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'feedback' | 'finished'>('loading');
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const loadGame = async () => {
            if (!currentGameId) return;
            try {
                const data = await apiService.getGameQuestions(currentGameId);
                // Shuffle or just take them
                setQuestions(data);
                setGameState('playing');

                // Speak first question after short delay
                setTimeout(() => speak(data[0].texto), 1000);
            } catch (error) {
                console.error("Error loading questions", error);
            }
        };
        loadGame();
    }, [currentGameId]); // eslint-disable-line

    const handleAnswer = (emotionId: string) => {
        if (gameState !== 'playing') return;

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
                setCurrentIndex(prev => prev + 1);
                setGameState('playing');
                speak(questions[currentIndex + 1].texto);
            } else {
                handleFinish();
            }
        }, 2000);
    };

    const handleFinish = async () => {
        setGameState('finished');
        playEffect('win');
        await finishSession(questions.length, score + (isCorrect ? 1 : 0)); // Add last one if correct? No, score is updated already
        // Wait for user interaction to leave
    };

    if (gameState === 'loading') return <div className="text-center text-white p-10">Cargando Situaciones...</div>;

    if (gameState === 'finished') {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
                <div className="text-8xl mb-6 animate-bounce">🏆</div>
                <h2 className="text-4xl font-bold text-white mb-4">¡Juego Completado!</h2>
                <p className="text-2xl text-purple-200 mb-8">
                    Conseguiste {score} de {questions.length} estrellas
                </p>
                <div className="flex gap-2 mb-8">
                    {[...Array(questions.length)].map((_, i) => (
                        <StarIcon key={i} filled={i < score} />
                    ))}
                </div>
                <Button onClick={() => navigate('/')} size="lg">Volver al Inicio</Button>
            </motion.div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="h-full flex flex-col items-center justify-between p-6">
            {/* Progress */}
            <div className="w-full h-4 bg-white/10 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'feedback' ? (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex flex-col items-center justify-center flex-grow"
                    >
                        {isCorrect ? (
                            <>
                                <CheckCircle size={120} className="text-green-400 mb-4" />
                                <h2 className="text-4xl text-white font-bold">¡Correcto!</h2>
                            </>
                        ) : (
                            <>
                                <XCircle size={120} className="text-red-400 mb-4" />
                                <h2 className="text-4xl text-white font-bold">¡Inténtalo de nuevo!</h2>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex flex-col items-center w-full max-w-4xl"
                    >
                        <div className="text-8xl mb-6 filter drop-shadow-lg">{currentQ.imagen}</div>

                        <h2
                            className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-8 cursor-pointer hover:text-yellow-300 transition-colors"
                            onClick={() => speak(currentQ.texto)}
                        >
                            "{currentQ.texto}" <span className="text-lg opacity-50 ml-2">🔊</span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                            {Object.entries(EMOTIONS).map(([key, config]) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswer(key)}
                                    className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl
                    ${config.color} shadow-lg border-b-4 border-black/20
                    transition-all
                  `}
                                >
                                    <span className="text-4xl mb-2">{config.emoji}</span>
                                    <span className={`font-bold ${config.text}`}>{config.name}</span>
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
        <svg
            className={`w-8 h-8 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );
}
