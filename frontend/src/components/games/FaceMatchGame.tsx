import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../hooks/useSound';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const EMOTIONS_DATA = [
    { id: 'joy', name: 'Alegría', emoji: '😊', color: 'bg-yellow-400' },
    { id: 'sadness', name: 'Tristeza', emoji: '😢', color: 'bg-blue-400' },
    { id: 'anger', name: 'Enojo', emoji: '😠', color: 'bg-red-400' },
    { id: 'fear', name: 'Miedo', emoji: '😨', color: 'bg-purple-400' },
    { id: 'surprise', name: 'Sorpresa', emoji: '😲', color: 'bg-orange-400' },
];

export function FaceMatchGame() {
    const { finishSession } = useGame();
    const { speak, playEffect } = useSound();
    const navigate = useNavigate();

    const [rounds, setRounds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'feedback' | 'finished'>('loading');
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        // Generate random rounds
        const newRounds = Array.from({ length: 5 }).map(() => {
            const target = EMOTIONS_DATA[Math.floor(Math.random() * EMOTIONS_DATA.length)];
            // Get 2 distractors
            const distractors = EMOTIONS_DATA.filter(e => e.id !== target.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);

            const options = [target, ...distractors].sort(() => 0.5 - Math.random());

            return { target, options };
        });

        setRounds(newRounds);
        setGameState('playing');

        setTimeout(() => {
            speak(`Encuentra la cara de ${newRounds[0].target.name}`);
        }, 1000);
    }, []); // eslint-disable-line

    const handleAnswer = (selectedId: string) => {
        if (gameState !== 'playing') return;

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
                setCurrentIndex(prev => prev + 1);
                setGameState('playing');
                speak(`Encuentra la cara de ${rounds[currentIndex + 1].target.name}`);
            } else {
                handleFinish();
            }
        }, 1500);
    };

    const handleFinish = async () => {
        setGameState('finished');
        playEffect('win');
        await finishSession(rounds.length, score + (isCorrect ? 1 : 0));
    };

    if (gameState === 'loading') return <div className="text-white text-center">Preparando juego...</div>;

    if (gameState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <h2 className="text-4xl font-bold text-white mb-4">¡Excelente Trabajo!</h2>
                <div className="text-6xl mb-4">🌟 {score} / {rounds.length}</div>
                <Button onClick={() => navigate('/')}>Volver al Menú</Button>
            </div>
        );
    }

    const currentRound = rounds[currentIndex];

    return (
        <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="absolute top-4 right-4 text-white font-bold text-xl">
                {currentIndex + 1} / {rounds.length}
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'feedback' ? (
                    <motion.div
                        key="feedback"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                    >
                        {isCorrect ? (
                            <CheckCircle size={150} className="text-green-400" />
                        ) : (
                            <XCircle size={150} className="text-red-400" />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-12">
                            ¿Cuál es la cara de <span className="text-yellow-400 text-4xl block mt-2">{currentRound.target.name}?</span>
                        </h2>

                        <div className="flex justify-center gap-8">
                            {currentRound.options.map((option: any) => (
                                <motion.button
                                    key={option.id}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAnswer(option.id)}
                                    className="text-8xl p-6 bg-white/10 rounded-full hover:bg-white/20 transition-all border-4 border-transparent hover:border-yellow-400"
                                >
                                    {option.emoji}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
