import { Stars } from '../common/Stars';
import { Button } from '../common/Button';

interface HeaderProps {
    userName?: string;
    stars?: number;
    onLogout?: () => void;
    showParentButton?: boolean;
    onParentClick?: () => void;
}

export function Header({ userName, stars = 0, onLogout, showParentButton, onParentClick }: HeaderProps) {
    return (
        <header className="bg-white shadow-md p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-4xl">🌈</div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">EmotiWeb</h1>
                        {userName && <p className="text-sm text-gray-600">Hola, {userName}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {stars > 0 && <Stars count={stars} />}
                    {showParentButton && (
                        <button
                            onClick={onParentClick}
                            className="text-3xl hover:scale-110 transition-transform"
                        >
                            👨‍👩‍👧
                        </button>
                    )}
                    {onLogout && (
                        <Button variant="outline" size="sm" onClick={onLogout}>
                            Salir
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
