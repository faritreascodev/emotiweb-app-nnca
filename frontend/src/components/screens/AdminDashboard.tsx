import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { Users, Settings, BarChart3, ArrowLeft, Trash2, Edit, Search, UserPlus, Star, CheckCircle, X, Plus, Gamepad2, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminDashboard() {
    const { user } = useGame();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'games' | 'stats'>('users');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [gamesList, setGamesList] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showUserModal, setShowUserModal] = useState(false);
    const [showGameModal, setShowGameModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedGame, setSelectedGame] = useState<any>(null);

    useEffect(() => {
        if (user?.tipo !== 'admin') {
            navigate('/');
            return;
        }
        refreshData();
    }, [user, navigate, activeTab]);

    const refreshData = () => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'games') fetchGames();
        if (activeTab === 'stats') fetchStats();
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllUsers();
            setUsersList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await apiService.adminGetGames();
            setGamesList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAdminDashboard();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await apiService.adminDeleteUser(id);
                fetchUsers();
            } catch (e) {
                alert("Error al eliminar");
            }
        }
    };

    const handleDeleteGame = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este juego?")) {
            try {
                await apiService.adminDeleteGame(id);
                fetchGames();
            } catch (e) {
                alert("Error al eliminar juego");
            }
        }
    };

    const handleToggleStatus = async (id: number, current: boolean) => {
        try {
            await apiService.toggleUserStatus(id, !current);
            fetchUsers();
        } catch (e) {
            alert("Error al actualizar");
        }
    };

    const handleSaveUser = async (formData: any) => {
        try {
            if (selectedUser) {
                await apiService.adminUpdateUser(selectedUser.id, formData);
            } else {
                await apiService.adminCreateUser(formData);
            }
            setShowUserModal(false);
            fetchUsers();
        } catch (e) {
            alert("Error al guardar usuario");
        }
    };

    const handleSaveGame = async (formData: any) => {
        try {
            if (selectedGame) {
                await apiService.adminUpdateGame(selectedGame.id, formData);
            } else {
                await apiService.adminCreateGame(formData);
            }
            setShowGameModal(false);
            fetchGames();
        } catch (e) {
            alert("Error al guardar juego");
        }
    };

    if (loading && usersList.length === 0 && !stats && gamesList.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Settings size={64} className="text-yellow-400" />
            </motion.div>
            <p className="mt-4 text-xl font-bold">Sincronizando Sistema...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 pt-10">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/')} className="text-white bg-white/10 rounded-2xl p-4 hover:bg-white/20 transition-all shadow-lg border border-white/5">
                        <ArrowLeft size={32} />
                    </button>
                    <div>
                        <h1 className="text-5xl font-black text-white italic drop-shadow-lg">ADMIN CONTROL</h1>
                        <p className="text-indigo-200 text-xl font-medium tracking-tight">Gestiona el universo de aprendizaje</p>
                    </div>
                </div>

                <div className="flex bg-indigo-950/50 p-2 rounded-[35px] border border-white/10 backdrop-blur-md shadow-2xl">
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20} />} label="Usuarios" />
                    <TabButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<Gamepad2 size={20} />} label="MUNDOS" />
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
                                        placeholder="Buscar por nombre o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-indigo-50 border-2 border-indigo-100 rounded-[30px] py-4 pl-16 pr-8 text-indigo-950 font-bold focus:border-indigo-500 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                <Button
                                    onClick={() => { setSelectedUser(null); setShowUserModal(true); }}
                                    className="h-16 px-10 rounded-[30px] text-lg font-black bg-green-500 hover:bg-green-600 shadow-xl border-b-4 border-green-700 w-full md:w-auto transform hover:scale-105 transition-transform"
                                >
                                    <UserPlus className="mr-2" /> RECLUTAR NUEVO
                                </Button>
                            </div>

                            <div className="overflow-hidden rounded-[40px] border border-indigo-100 shadow-sm bg-indigo-50/30">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="bg-indigo-900/5 text-indigo-900 border-b-2 border-indigo-100">
                                            <th className="p-6 font-black uppercase text-xs tracking-widest">Identidad</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest text-center">Rango</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest text-center">Aventuras</th>
                                            <th className="p-6 font-black uppercase text-xs tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-indigo-950">
                                        {usersList.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))).map((targetUser) => (
                                            <tr key={targetUser.id} className="border-b border-indigo-100 hover:bg-white transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-4xl w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-indigo-50 group-hover:scale-110 transition-transform">{targetUser.avatar}</div>
                                                        <div>
                                                            <div className="font-black text-lg text-indigo-950">{targetUser.nombre}</div>
                                                            <div className="text-sm font-medium text-indigo-400">{targetUser.email || 'Hijo vinculado'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest ${targetUser.tipo === 'admin' ? 'bg-purple-100 text-purple-700' : targetUser.tipo === 'padre' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
                                                        {targetUser.tipo}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-2 font-black text-indigo-600">
                                                        <Star size={16} fill="currentColor" className="text-yellow-400" />
                                                        {targetUser.estadisticas?.total_estrellas || 0}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() => { setSelectedUser(targetUser); setShowUserModal(true); }}
                                                            className="p-3 bg-white hover:bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-50 shadow-sm transition-all"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(targetUser.id, targetUser.activo)}
                                                            className={`p-3 rounded-2xl border shadow-sm transition-all ${targetUser.activo ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                                                            title={targetUser.activo ? "Desactivar" : "Activar"}
                                                        >
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(targetUser.id)}
                                                            className="p-3 bg-white hover:bg-red-50 text-red-500 rounded-2xl border border-red-50 shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
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
                        <div className="bg-white/95 rounded-[50px] p-10 shadow-2xl border-b-[16px] border-yellow-400">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-indigo-950 italic flex items-center gap-4 uppercase">
                                    <Gamepad2 className="text-yellow-500" size={40} /> Mundos Emocionales
                                </h2>
                                <Button
                                    onClick={() => { setSelectedGame(null); setShowGameModal(true); }}
                                    className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black"
                                >
                                    <Plus className="mr-2" /> CREAR MUNDO
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {gamesList.map((game) => (
                                    <div key={game.id} className="p-8 bg-indigo-50/50 rounded-[40px] border-2 border-indigo-100 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="text-6xl w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">{game.icono}</div>
                                            <div>
                                                <div className="font-black text-2xl text-indigo-950 uppercase">{game.titulo}</div>
                                                <div className="text-[10px] font-black text-white px-2 py-0.5 rounded-full bg-indigo-400 w-fit mb-2">{game.id}</div>
                                                <div className="text-sm font-bold text-indigo-400 max-w-xs line-clamp-2">{game.descripcion}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center ${game.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {game.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelectedGame(game); setShowGameModal(true); }}
                                                    className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGame(game.id)}
                                                    className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-red-50 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'stats' && (
                    <motion.div key="stats" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <div className="bg-indigo-900/60 rounded-[50px] p-12 shadow-2xl backdrop-blur-xl border border-white/10 border-b-[16px] border-indigo-950 text-white">
                            <h2 className="text-4xl font-black text-white mb-10 italic flex items-center gap-4 uppercase">
                                <BarChart3 className="text-yellow-400" size={40} /> Saldo de Aventuras
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                <SummaryBadge label="Total Habitantes" value={stats?.estadisticas ? (stats?.estadisticas?.total_estudiantes + stats?.estadisticas?.total_padres) : 0} color="text-yellow-400" />
                                <SummaryBadge label="Misiones Épicas" value={stats?.estadisticas?.total_sesiones_completadas || 0} color="text-green-400" />
                                <SummaryBadge label="Estrellas de Oro" value={stats?.estadisticas?.total_estrellas_sistema || 0} color="text-sky-400" />
                                <SummaryBadge label="Trofeos de Honor" value={stats?.estadisticas?.total_logros_obtenidos || 0} color="text-pink-400" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="bg-indigo-950/40 p-10 rounded-[45px] border border-white/5 backdrop-blur-sm">
                                    <h3 className="text-white font-black text-2xl mb-8 uppercase italic flex items-center gap-3">
                                        <Gamepad2 className="text-indigo-400" /> Mundos Favoritos
                                    </h3>
                                    <div className="space-y-6">
                                        {stats?.juegos_populares?.map((j: any) => (
                                            <div key={j.titulo} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-4xl">{j.icono}</span>
                                                    <div>
                                                        <div className="text-indigo-100 font-black text-lg">{j.titulo}</div>
                                                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{Math.round(j.precision_promedio || 0)}% Precisión Global</div>
                                                    </div>
                                                </div>
                                                <div className="text-yellow-400 font-black text-2xl">{j.veces_jugado}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-950/40 p-10 rounded-[45px] border border-white/5 backdrop-blur-sm">
                                    <h3 className="text-white font-black text-2xl mb-8 uppercase italic flex items-center gap-3">
                                        <Layers className="text-indigo-400" /> Dominio de Emociones
                                    </h3>
                                    <div className="space-y-8">
                                        {stats?.emociones_dificultad?.map((e: any) => (
                                            <div key={e.nombre_es} className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center text-sm font-black text-indigo-100 uppercase tracking-wider">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-2xl">{e.emoji}</span> {e.nombre_es}
                                                    </span>
                                                    <span className="text-yellow-400">{Math.round(e.precision_rate || e.precision || 0)}% Precisión</span>
                                                </div>
                                                <div className="h-4 bg-indigo-900/80 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.round(e.precision_rate || e.precision || 0)}%` }}
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* User Modal */}
            <PopupModal
                show={showUserModal}
                onClose={() => setShowUserModal(false)}
                title={selectedUser ? "Sincronizar Ciudadano" : "Reclutar Nuevo Ciudadano"}
            >
                <UserForm
                    initialData={selectedUser}
                    onSave={handleSaveUser}
                    onCancel={() => setShowUserModal(false)}
                />
            </PopupModal>

            {/* Game Modal */}
            <PopupModal
                show={showGameModal}
                onClose={() => setShowGameModal(false)}
                title={selectedGame ? "Reformar Mundo" : "Descubrir Nuevo Mundo"}
            >
                <GameForm
                    initialData={selectedGame}
                    onSave={handleSaveGame}
                    onCancel={() => setShowGameModal(false)}
                />
            </PopupModal>
        </div>
    );
}

// Components
function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-5 rounded-[28px] font-black flex items-center gap-3 transition-all ${active ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
        >
            {icon} <span className="uppercase tracking-widest text-xs">{label}</span>
        </button>
    );
}

function SummaryBadge({ label, value, color }: any) {
    return (
        <div className="bg-indigo-950/50 p-8 rounded-[40px] border border-white/5 shadow-inner text-center hover:bg-white/5 transition-colors group">
            <div className={`text-6xl font-black ${color} mb-2 uppercase drop-shadow-md group-hover:scale-110 transition-transform`}>{value}</div>
            <div className="text-xs font-black text-indigo-300 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function PopupModal({ show, onClose, title, children }: any) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-indigo-950/60 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[50px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                <div className="bg-indigo-900 p-8 text-white flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h2>
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all cursor-pointer"><X size={24} /></button>
                </div>
                <div className="p-10">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

function UserForm({ initialData, onSave, onCancel }: any) {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        email: initialData?.email || '',
        password: '',
        tipo: initialData?.tipo || 'estudiante',
        fechaNacimiento: initialData?.fechaNacimiento?.split('T')[0] || '',
        avatar: initialData?.avatar || '🐻',
        activo: initialData?.activo ?? true
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Nombre Real</label>
                    <input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Correo Espectral</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950" required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Rango en la Alianza</label>
                    <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as any })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950 appearance-none">
                        <option value="estudiante">Estudiante</option>
                        <option value="padre">Padre</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Avatar Seleccionado</label>
                    <input type="text" value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-center text-4xl" maxLength={2} />
                </div>
            </div>

            {!initialData && (
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Código de Seguridad</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950" required />
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 p-5 rounded-2xl font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-50 transition-all">Abortar</button>
                <button type="submit" className="flex-1 p-5 bg-indigo-600 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl border-b-6 border-indigo-800 hover:bg-indigo-500 transform hover:-translate-y-1 transition-all">Consolidar</button>
            </div>
        </form>
    );
}

function GameForm({ initialData, onSave, onCancel }: any) {
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        titulo: initialData?.titulo || '',
        descripcion: initialData?.descripcion || '',
        icono: initialData?.icono || '🎮',
        color: initialData?.color || '#6366f1',
        tipo: initialData?.tipo || 'situation',
        rondas_por_partida: initialData?.rondas_por_partida || 5,
        orden: initialData?.orden || 0,
        activo: initialData?.activo ?? true
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Codename del Mundo</label>
                    <input type="text" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950" required disabled={!!initialData} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Título del Mapa</label>
                    <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950" required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-indigo-300 uppercase ml-4">Relato del Mundo</label>
                <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950 min-h-[100px]" required />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Icono</label>
                    <input type="text" value={formData.icono} onChange={e => setFormData({ ...formData, icono: e.target.value })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-center text-3xl" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Color Base</label>
                    <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full h-[64px] bg-indigo-50 rounded-2xl border-none cursor-pointer" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-300 uppercase ml-4">Mecánica</label>
                    <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as any })} className="w-full p-5 bg-indigo-50 rounded-2xl border-none font-bold text-indigo-950 appearance-none text-xs">
                        <option value="face-match">Face Match</option>
                        <option value="situation">Situación</option>
                        <option value="drag-drop">Drag & Drop</option>
                        <option value="story">Cuento</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 p-5 rounded-2xl font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-50 transition-all">Descartar</button>
                <button type="submit" className="flex-1 p-5 bg-yellow-500 rounded-2xl font-black text-indigo-900 uppercase tracking-widest shadow-xl border-b-6 border-yellow-700 hover:bg-yellow-400 transform hover:-translate-y-1 transition-all">Materializar</button>
            </div>
        </form>
    );
}
