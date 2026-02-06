import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { Trophy, Play, Settings, Users, BarChart3, Sparkles } from 'lucide-react';

export function HomeScreen() {
    const { user } = useGame();
    const [games, setGames] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await apiService.getGames();
                setGames(data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };
        fetchGames();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0, scale: 0.9 },
        show: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } as any }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            {/* Kid-friendly Welcome */}
            <header className="mb-16 text-center relative pt-8">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="inline-block p-4 bg-yellow-400 rounded-[35px] shadow-2xl mb-6 border-b-8 border-yellow-600"
                >
                    <span className="text-6xl">{user?.avatar || '🐻'}</span>
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 drop-shadow-lg italic">
                    ¡HOLA, {user?.nombre.toUpperCase()}!
                </h1>
                <p className="text-2xl text-purple-200 font-bold flex items-center justify-center gap-3">
                    <Sparkles className="text-yellow-400" />
                    ¿A qué aventura quieres ir hoy?
                </p>

                {/* Floating Bubbles */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 left-[10%] text-5xl">🎈</motion.div>
                    <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-[15%] text-4xl">⭐</motion.div>
                </div>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
                {games.map((game) => (
                    <motion.div
                        key={game.id}
                        variants={item}
                        whileHover={{ y: -15, scale: 1.05 }}
                        className="relative group h-full"
                    >
                        <div
                            className="h-full rounded-[50px] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden border-b-[12px] transition-all"
                            style={{
                                backgroundColor: 'white',
                                borderColor: game.color || '#DDD'
                            }}
                        >
                            <div
                                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
                                style={{ backgroundColor: game.color }}
                            />

                            <div
                                className="w-28 h-28 rounded-[40px] flex items-center justify-center text-6xl shadow-xl mb-6 border-b-4 border-black/10 transition-transform group-hover:rotate-12"
                                style={{ backgroundColor: game.color ? `${game.color}33` : '#F3F4F6' }}
                            >
                                <span className="group-hover:scale-125 transition-transform">{game.icono}</span>
                            </div>

                            <h3 className="text-3xl font-black text-indigo-950 mb-4 leading-tight">{game.titulo}</h3>
                            <p className="text-indigo-600 font-medium mb-8 flex-grow">{game.descripcion}</p>

                            <button
                                onClick={() => navigate(`/game/${game.id}`)}
                                className="w-full py-5 px-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 shadow-xl transition-all transform-gpu hover:shadow-2xl active:scale-95 text-white"
                                style={{ backgroundColor: game.color || '#4F46E5', borderBottom: `6px solid ${game.color}cc` }}
                            >
                                <Play fill="currentColor" size={24} /> ¡JUGAR!
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Role-Specific Dashboards */}
            <div className="mt-24">
                {user?.tipo === 'admin' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-indigo-950/60 p-10 rounded-[60px] border-4 border-indigo-400/30 backdrop-blur-xl"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-4 justify-center md:justify-start">
                                    <Settings className="text-yellow-400" size={40} />
                                    Panel de Administración
                                </h2>
                                <p className="text-indigo-200 text-xl">Gestiona el sistema, usuarios y configuración de juegos.</p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button size="lg" variant="secondary" onClick={() => navigate('/admin/users')} className="rounded-[25px] h-14 px-8 font-black">
                                    <Users className="mr-2" /> Gestionar Usuarios
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/admin/settings')} className="rounded-[25px] h-14 px-8 font-black border-2 border-indigo-400/50 text-indigo-100">
                                    <BarChart3 className="mr-2" /> Configurar Juegos
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {user?.tipo === 'padre' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-[60px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-6 bg-pink-100 rounded-[35px]">
                                <Trophy className="text-pink-600" size={48} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-indigo-900 mb-2 italic">SEGUIMIENTO FAMILIAR</h2>
                                <p className="text-indigo-500 text-xl font-medium">Mira cuánto han aprendido tus hijos hoy.</p>
                            </div>
                        </div>
                        <Button size="lg" onClick={() => navigate('/parent')} className="rounded-[30px] h-16 px-10 text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl w-full md:w-auto">
                            IR AL PANEL <Play className="ml-2" size={20} fill="currentColor" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
