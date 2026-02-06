import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
    const { user, logout } = useGame();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <span className="text-xl">🎭</span>
                    </div>
                    <span className="text-xl font-display font-bold text-white hidden sm:block">EmotiWeb</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-2xl">{user.avatar || '🐻'}</span>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-tight">{user.nombre}</span>
                            <span className="text-xs text-purple-200 capitalize">{user.tipo}</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-white hover:bg-white/20 hover:text-red-200"
                    >
                        <LogOut size={20} />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
