import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { FaceMatchGame } from '../games/FaceMatchGame';
import { SituationGame } from '../games/SituationGame';
import { DragDropGame } from '../games/DragDropGame';
import { StoryGame } from '../games/StoryGame';
import { useNavigate } from 'react-router-dom';

export function GameScreen() {
    const { sessionId } = useGame();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadGameData();
    }, []);

    const loadGameData = async () => {
        try {
            const session = await apiService.getUserSessions();
            const currentSession = session.find((s: any) => s.id === sessionId);

            if (!currentSession) {
                throw new Error('Sesión no encontrada');
            }

            const data = await apiService.getGameQuestions(currentSession.juego_id);
            setGameData(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar el juego');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                    <div className="text-6xl animate-spin mb-4">🎮</div>
                    <p className="text-xl text-gray-600">Cargando juego...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😢</div>
                    <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={handleBack}>Volver al inicio</Button>
                </div>
            </div>
        );
    }

    const gameId = gameData?.juego?.id;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <header className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Button variant="outline" onClick={handleBack}>
                        ← Volver
                    </Button>
                    <h2 className="text-xl font-bold">{gameData?.juego?.titulo || 'Juego'}</h2>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="p-4">
                {gameId === 'face-match' && <FaceMatchGame />}
                {gameId === 'situation' && <SituationGame />}
                {gameId === 'drag-drop' && <DragDropGame />}
                {gameId === 'story' && <StoryGame />}
            </main>
        </div>
    );
}
