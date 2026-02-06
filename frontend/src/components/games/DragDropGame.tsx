import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export function DragDropGame() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-8xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold mb-4">Arrastra y Suelta</h2>
            <p className="text-xl text-gray-600 mb-8">Este juego estará disponible pronto!</p>
            <Button onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </div>
    );
}
