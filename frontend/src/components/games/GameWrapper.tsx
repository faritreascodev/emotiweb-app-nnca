import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { SituationGame } from './SituationGame';
import { FaceMatchGame } from './FaceMatchGame';
import { DragDropGame } from './DragDropGame';
import { Button } from '../common/Button';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function GameWrapper() {
    const { gameId } = useParams<{ gameId: string }>();
    const { startSession } = useGame();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    const init = useCallback(async () => {
        if (gameId) {
            try {
                setInitializing(true);
                await startSession(gameId);
                setInitializing(false);
            } catch (err) {
                console.error("Failed to start session:", err);
                setError("¡Oh no! No pudimos empezar este juego.");
                setInitializing(false);
            }
        }
    }, [gameId, startSession]);

    useEffect(() => {
        init();
    }, [init]);

    if (initializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Sparkles className="text-yellow-400" size={64} />
                </motion.div>
                <p className="mt-6 text-3xl font-black italic tracking-tight uppercase">¡Preparando tu aventura!</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border-b-[12px] border-red-500 max-w-md">
                    <div className="text-8xl mb-6">🥺</div>
                    <h2 className="text-4xl font-black text-indigo-950 mb-4 italic">¡LO SIENTO!</h2>
                    <p className="text-xl text-indigo-600 font-bold mb-8">{error}</p>
                    <Button onClick={() => navigate('/')} size="lg" className="w-full h-16 rounded-[25px] bg-indigo-600 text-xl font-black">
                        Volver a Juegos
                    </Button>
                </div>
            </div>
        );
    }

    const renderGame = () => {
        switch (gameId) {
            case 'situation':
                return <SituationGame />;
            case 'face-match':
                return <FaceMatchGame />;
            case 'drag-drop':
                return <DragDropGame />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center p-20 text-center">
                        <div className="text-9xl mb-10">🏗️</div>
                        <h2 className="text-5xl font-black text-white italic mb-6">¡MUY PRONTO!</h2>
                        <p className="text-2xl text-purple-200 font-bold mb-10">Estamos construyendo este juego para ti.</p>
                        <Button className="h-16 px-12 rounded-[30px] bg-white text-indigo-900 text-xl font-black" onClick={() => navigate('/')}>
                            Explorar otros Juegos
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="mb-8 flex items-center justify-between">
                <motion.button
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-indigo-900/40 hover:bg-indigo-900/60 text-white px-6 py-3 rounded-2xl font-black transition-all border border-white/10 shadow-lg"
                >
                    <ArrowLeft size={24} /> VOLVER
                </motion.button>

                <div className="flex items-center gap-2 text-yellow-400 font-black text-2xl drop-shadow-lg italic uppercase tracking-tight">
                    <Star fill="currentColor" size={32} /> Aventura Emocional
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-900/30 backdrop-blur-xl rounded-[60px] p-2 min-h-[650px] shadow-3xl relative overflow-hidden ring-4 ring-white/5 border-b-[20px] border-black/20"
            >
                <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full blur-xl"
                            animate={{
                                x: [Math.random() * 1000, Math.random() * 1000],
                                y: [Math.random() * 700, Math.random() * 700],
                                scale: [1, 1.5, 1],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 h-full">
                    {renderGame()}
                </div>
            </motion.div>
        </div>
    );
}
