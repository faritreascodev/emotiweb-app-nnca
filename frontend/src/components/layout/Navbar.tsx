import { useGame } from '../../context/GameContext';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
    const { user, logout } = useGame();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
            <div className="max-w-7xl mx-auto bg-indigo-950/40 backdrop-blur-2xl rounded-[35px] px-8 py-4 flex items-center justify-between border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        className="w-12 h-12 rounded-[18px] bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl border-b-4 border-indigo-800"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎭</span>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-white italic tracking-tighter leading-none">EmotiWeb</span>
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Aprendizaje Mágico</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 bg-white/5 pl-2 pr-6 py-2 rounded-[25px] border border-white/5 shadow-inner">
                        <div className="text-3xl w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform group-hover:rotate-0">
                            {user.avatar || '🐻'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black text-white leading-tight uppercase tracking-tight">{user.nombre}</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.tipo === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                                    {user.tipo === 'admin' ? 'Coordinador' : user.tipo === 'padre' ? 'Guardián' : 'Aventurero'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {user.tipo === 'admin' && (
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate('/admin/users')}
                                className="p-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 rounded-2xl border border-purple-500/30 transition-all shadow-lg"
                                title="Panel de Admin"
                            >
                                <ShieldCheck size={24} />
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={logout}
                            className="p-3 bg-red-600/10 hover:bg-red-600/30 text-red-200 rounded-2xl border border-red-500/20 transition-all shadow-lg"
                            title="Salir"
                        >
                            <LogOut size={24} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
