import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { SituationGame } from './SituationGame';
import { FaceMatchGame } from './FaceMatchGame';
import { Button } from '../common/Button';
import { ArrowLeft } from 'lucide-react';

export function GameWrapper() {
    const { gameId } = useParams<{ gameId: string }>();
    const { startSession } = useGame();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (gameId) {
            startSession(gameId).catch(err => {
                console.error("Failed to start session:", err);
                setError("No se pudo iniciar la sesión del juego.");
            });
        }
    }, [gameId]); // Removed startSession dependency to avoid loops if reference unstable, though useContext is usually stable.

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-3xl font-display text-white mb-4">¡Ups! Algo salió mal</h2>
                <p className="text-purple-200 mb-8">{error}</p>
                <Button onClick={() => navigate('/')} variant="secondary">Volver al Inicio</Button>
            </div>
        );
    }

    // Render the specific game based on ID
    const renderGame = () => {
        switch (gameId) {
            case 'situation': // 'Cómo me siento?'
                return <SituationGame />;
            case 'face-match': // 'Caras y Emociones'
                return <FaceMatchGame />;
            default:
                return (
                    <div className="text-center text-white py-20">
                        <h2 className="text-4xl mb-4">🚧 En Construcción</h2>
                        <p>El juego "{gameId}" estará disponible pronto.</p>
                        <Button className="mt-8" onClick={() => navigate('/')} variant="outline">Volver</Button>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-white/70 hover:text-white">
                    <ArrowLeft className="mr-2" size={20} />
                    Volver a Juegos
                </Button>
            </div>

            <div className="glass-panel rounded-3xl p-1 min-h-[600px] overflow-hidden relative">
                {renderGame()}
            </div>
        </div>
    );
}
