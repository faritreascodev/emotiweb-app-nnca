import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { Play, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Game {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string; // Emoji
    color: string;
    tipo: string;
}

export function HomeScreen() {
    const { user } = useGame();
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await apiService.getGames();
                setGames(data);
            } catch (error) {
                console.error("Error fetching games", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) return <div className="text-white text-center py-20">Cargando aventuras...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 text-glow">
                    ¡Hola, {user?.nombre}!
                </h1>
                <p className="text-xl text-purple-200">¿Qué te gustaría jugar hoy?</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {games.map((game) => (
                    <motion.div
                        key={game.id}
                        variants={item}
                        whileHover={{ y: -10 }}
                        className="group relative cursor-pointer"
                        onClick={() => navigate(`/game/${game.id}`)}
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(circle at center, ${game.color}50 0%, transparent 70%)` }}
                        />

                        <div className="relative glass-panel rounded-3xl p-8 h-full border border-white/10 overflow-hidden group-hover:border-white/30 transition-colors">
                            <div
                                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"
                                style={{ background: `linear-gradient(to bottom right, ${game.color}, transparent)` }}
                            />

                            <div className="flex flex-col h-full">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">
                                    {game.icono}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{game.titulo}</h3>
                                <p className="text-purple-200 text-sm mb-6 flex-grow">{game.descripcion}</p>

                                <Button className="w-full mt-auto group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow">
                                    <Play size={20} className="mr-2 fill-current" />
                                    Jugar Ahora
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {user?.tipo === 'padre' || user?.tipo === 'educador' ? (
                <div className="flex justify-center mt-12">
                    <Button variant="secondary" onClick={() => navigate('/parent')}>
                        <Trophy className="mr-2" /> IO AL Panel de Progreso
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
