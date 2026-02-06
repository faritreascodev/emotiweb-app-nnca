import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { Users, Settings, BarChart3, ArrowLeft, Trash2, Edit, Plus, Search, UserPlus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminDashboard() {
    const { user } = useGame();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'games' | 'stats'>('users');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.tipo !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllStudents();
            setUsersList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && usersList.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Settings size={64} className="text-yellow-400" />
            </motion.div>
            <p className="mt-4 text-xl font-bold">Cargando Sistema...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/')} className="text-white bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-all shadow-lg border border-white/5">
                        <ArrowLeft size={32} />
                    </button>
                    <div>
                        <h1 className="text-5xl font-black text-white italic drop-shadow-lg">ADMIN CONTROL</h1>
                        <p className="text-indigo-200 text-xl font-medium">Gestiona el universo EmotiWeb</p>
                    </div>
                </div>

                <div className="flex bg-indigo-950/50 p-2 rounded-[35px] border border-white/10 backdrop-blur-md">
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20} />} label="Usuarios" />
                    <TabButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<Settings size={20} />} label="Juegos" />
                    <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 size={20} />} label="Sistema" />
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'users' && (
                    <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className="bg-white/95 rounded-[50px] p-10 shadow-2xl border-b-[12px] border-gray-200">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                                <div className="relative flex-grow w-full max-w-md">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-300" />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuarios..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-[30px] py-4 pl-16 pr-8 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                <Button className="h-16 px-10 rounded-[30px] text-lg font-black bg-green-500 hover:bg-green-600 shadow-xl border-b-4 border-green-700 w-full md:w-auto">
                                    <UserPlus className="mr-2" /> RECLUTAR NUEVO
                                </Button>
                            </div>

                            <div className="overflow-x-auto rounded-[40px] border border-indigo-100 shadow-sm bg-indigo-50/30">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-indigo-900/5 text-indigo-900 border-b-2 border-indigo-100">
                                            <th className="p-6 font-black uppercase text-xs tracking-widest">Identidad</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest">Cargo</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest">Aventuras</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-indigo-950">
                                        {usersList.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((targetUser) => (
                                            <tr key={targetUser.id} className="border-b border-indigo-100 hover:bg-white transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-4xl w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-indigo-50">{targetUser.avatar}</div>
                                                        <div>
                                                            <div className="font-black text-lg">{targetUser.nombre}</div>
                                                            <div className="text-sm font-medium text-indigo-400">{targetUser.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${targetUser.tipo === 'admin' ? 'bg-purple-100 text-purple-700' : targetUser.tipo === 'padre' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
                                                        {targetUser.tipo}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2 font-black text-indigo-600">
                                                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                                                        {targetUser.estadisticas?.total_estrellas || 0}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-3">
                                                        <button className="p-3 bg-white hover:bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-sm transition-all"><Edit size={20} /></button>
                                                        <button className="p-3 bg-white hover:bg-red-50 text-red-500 rounded-2xl border border-red-50 shadow-sm transition-all"><Trash2 size={20} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'games' && (
                    <motion.div key="games" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <div className="bg-white/95 rounded-[50px] p-12 shadow-2xl text-center border-b-[16px] border-yellow-400">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
                                <Settings size={120} className="mx-auto text-yellow-400 mb-8" />
                            </motion.div>
                            <h2 className="text-5xl font-black text-indigo-950 mb-4 italic">FORJA DE JUEGOS</h2>
                            <p className="text-2xl text-indigo-600 font-bold mb-10 max-w-2xl mx-auto">
                                Aquí podrás crear nuevas dinámicas, situaciones y configurar las reglas de cada mundo emocional.
                            </p>
                            <Button size="lg" className="h-16 px-12 rounded-[30px] bg-indigo-600 text-xl font-black shadow-2xl border-b-6 border-indigo-800">
                                <Plus className="mr-3" /> AÑADIR NUEVA SITUACIÓN
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'stats' && (
                    <motion.div key="stats" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <div className="bg-indigo-900/60 rounded-[50px] p-12 shadow-2xl backdrop-blur-xl border border-white/10 border-b-[16px] border-indigo-950">
                            <h2 className="text-4xl font-black text-white mb-10 italic flex items-center gap-4">
                                <BarChart3 className="text-yellow-400" size={40} /> ESTADO DEL SISTEMA
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <SummaryBadge label="Total Usuarios" value={usersList.length} color="text-yellow-400" />
                                <SummaryBadge label="Semanas Activo" value="1.2" color="text-green-400" />
                                <SummaryBadge label="Niveles Creados" value="14" color="text-sky-400" />
                                <SummaryBadge label="Reportes" value="23" color="text-pink-400" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-4 rounded-[30px] font-black flex items-center gap-3 transition-all ${active ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
        >
            {icon} {label}
        </button>
    );
}

function SummaryBadge({ label, value, color }: any) {
    return (
        <div className="bg-indigo-950/50 p-8 rounded-[40px] border border-white/5 shadow-inner text-center">
            <div className={`text-5xl font-black ${color} mb-2 uppercase`}>{value}</div>
            <div className="text-xs font-black text-indigo-300 uppercase tracking-widest">{label}</div>
        </div>
    );
}
