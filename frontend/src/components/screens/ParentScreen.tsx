import { useEffect, useState, useCallback } from 'react';
import { apiService } from '../../api/apiService';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Clock, Trophy, Calendar, Mail, ChevronRight, BarChart3, Heart, Users, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ParentScreen() {
    const { user } = useGame();
    const navigate = useNavigate();
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const data = await apiService.getAllStudents();
            setStudents(data);
        } catch (e) {
            console.error("Error loading students", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.tipo === 'estudiante') {
            navigate('/');
            return;
        }
        loadData();
    }, [user, navigate, loadData]);

    const loadStudentProgress = async (studentId: number) => {
        setStatsLoading(true);
        try {
            const data = await apiService.getChildProgress(studentId);
            setSelectedStudent(data);
        } catch (e) {
            console.error("Error loading child progress", e);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
                <Heart size={64} className="text-pink-500 fill-pink-500" />
            </motion.div>
            <p className="mt-4 text-xl font-bold italic tracking-tighter">Cargando Seguimiento...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4">
                <div className="flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/')}
                        className="p-4 bg-white/10 rounded-2xl mr-6 text-white hover:bg-white/20 transition-all shadow-lg border border-white/5"
                    >
                        <ArrowLeft size={28} />
                    </motion.button>
                    <div>
                        <h1 className="text-5xl font-black text-white italic drop-shadow-lg uppercase tracking-tight">
                            Seguimiento
                        </h1>
                        <p className="text-xl text-purple-200 font-medium">Supervisa el crecimiento emocional de los pequeños</p>
                    </div>
                </div>

                <div className="bg-indigo-950/50 p-4 rounded-[30px] border border-white/10 flex items-center gap-4 shadow-2xl backdrop-blur-md">
                    <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg border-b-4 border-indigo-700">
                        <BarChart3 className="text-white" />
                    </div>
                    <div className="pr-4">
                        <div className="text-xs text-indigo-300 font-black uppercase tracking-wider">Estudiantes</div>
                        <div className="text-2xl font-black text-white">{students.length}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/95 rounded-[45px] p-8 shadow-2xl border-b-[12px] border-gray-200">
                        <h2 className="text-2xl font-black text-indigo-950 mb-6 flex items-center gap-3 italic uppercase">
                            <Users className="text-indigo-600" /> Mis Estudiantes
                        </h2>
                        <div className="space-y-4">
                            {students.map((student) => (
                                <motion.div
                                    key={student.id}
                                    whileHover={{ x: 10 }}
                                    onClick={() => loadStudentProgress(student.id)}
                                    className={`
                                        p-5 rounded-[30px] cursor-pointer transition-all flex items-center justify-between group
                                        ${selectedStudent?.estudiante?.id === student.id
                                            ? 'bg-indigo-600 text-white shadow-xl scale-[1.02] border-b-6 border-indigo-800'
                                            : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border-b-4 border-indigo-100'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`text-3xl w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${selectedStudent?.estudiante?.id === student.id ? 'bg-white/20' : 'bg-white'}`}>
                                            {student.avatar || '🎒'}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg leading-tight uppercase tracking-tight">{student.nombre}</div>
                                            <div className={`text-xs font-bold ${selectedStudent?.estudiante?.id === student.id ? 'text-indigo-200' : 'text-indigo-400'}`}>
                                                {student.email}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={selectedStudent?.estudiante?.id === student.id ? 'text-white' : 'text-indigo-300'} />
                                </motion.div>
                            ))}
                            {students.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-indigo-300 italic font-bold">No hay estudiantes registrados aún.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {statsLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-white"
                            >
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <Loader2 className="text-yellow-400 mb-4" size={56} />
                                </motion.div>
                                <p className="text-2xl font-black italic">Generando reporte emocional...</p>
                            </motion.div>
                        ) : selectedStudent ? (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div className="bg-indigo-600 rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden border-b-[12px] border-indigo-800">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-8">
                                            <div className="text-7xl w-28 h-28 bg-white/20 rounded-[35px] flex items-center justify-center backdrop-blur-md shadow-2xl border-4 border-white/30">
                                                {selectedStudent.estudiante.avatar}
                                            </div>
                                            <div>
                                                <h2 className="text-5xl font-black italic mb-2 tracking-tighter uppercase">
                                                    {selectedStudent.estudiante.nombre}
                                                </h2>
                                                <div className="flex flex-wrap gap-4">
                                                    <span className="bg-white/20 px-4 py-2 rounded-2xl text-sm font-black flex items-center gap-2 uppercase">
                                                        <Calendar size={16} /> {selectedStudent.estudiante.fecha_nacimiento ? `${new Date().getFullYear() - new Date(selectedStudent.estudiante.fecha_nacimiento).getFullYear()}` : '?'} Años
                                                    </span>
                                                    <span className="bg-white/20 px-4 py-2 rounded-2xl text-sm font-black flex items-center gap-2 uppercase">
                                                        <Mail size={16} /> {selectedStudent.estudiante.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-yellow-400 p-8 rounded-[40px] text-indigo-900 text-center shadow-xl border-b-8 border-yellow-600 min-w-[150px]">
                                            <div className="text-6xl font-black mb-1 drop-shadow-sm">
                                                {selectedStudent.estadisticas?.total_estrellas || 0}
                                            </div>
                                            <div className="text-xs font-black uppercase tracking-widest opacity-80">Estrellas</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard
                                        icon={<Trophy size={32} />}
                                        label="Logros"
                                        value={selectedStudent.estadisticas?.total_juegos_jugados || 0}
                                        color="bg-green-400 border-green-600"
                                    />
                                    <StatCard
                                        icon={<CheckCircle size={32} />}
                                        label="Correctas"
                                        value={selectedStudent.estadisticas?.total_respuestas_correctas || 0}
                                        color="bg-orange-400 border-orange-600"
                                    />
                                    <StatCard
                                        icon={<Clock size={32} />}
                                        label="Sesiones"
                                        value={selectedStudent.estadisticas?.sesiones_completadas || 0}
                                        color="bg-sky-400 border-sky-600"
                                    />
                                </div>

                                <div className="bg-white/95 rounded-[50px] p-10 shadow-2xl border-b-[10px] border-gray-200">
                                    <h3 className="text-3xl font-black text-indigo-950 mb-8 flex items-center gap-4 italic uppercase">
                                        <Heart className="text-pink-500 fill-pink-500" /> Radar Emocional
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {selectedStudent.emociones.map((em: any) => (
                                            <div key={em.id} className="bg-indigo-50/50 p-6 rounded-[30px] border-2 border-indigo-100 flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-4xl drop-shadow-sm">{em.emoji}</span>
                                                        <span className="text-xl font-black text-indigo-950 uppercase italic">{em.nombre_es}</span>
                                                    </div>
                                                    <div className="text-indigo-600 font-black text-2xl italic">
                                                        {Math.round(em.nivel_dominio * 100)}%
                                                    </div>
                                                </div>
                                                <div className="h-5 bg-white rounded-full overflow-hidden shadow-inner border border-indigo-100 p-1">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${em.nivel_dominio * 100}%` }}
                                                        className="h-full rounded-full shadow-lg"
                                                        style={{ backgroundColor: em.color || '#6366f1' }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                    <span>{em.veces_correcta} Aciertos</span>
                                                    {em.nivel_dominio >= 0.7 && <span className="text-green-500 italic">¡Dominado! ✨</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[50px] p-10 shadow-2xl border-b-[10px] border-gray-100">
                                    <h3 className="text-2xl font-black text-indigo-950 mb-6 italic uppercase">Actividad Reciente</h3>
                                    <div className="space-y-4">
                                        {selectedStudent.sesiones_recientes.map((session: any) => (
                                            <div key={session.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-[30px] border border-gray-100 hover:bg-indigo-50/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-b-4 border-indigo-200">🎮</div>
                                                    <div>
                                                        <div className="font-black text-indigo-950 uppercase tracking-tight">{session.juego_titulo}</div>
                                                        <div className="text-xs font-bold text-indigo-400 uppercase">{new Date(session.fecha_inicio).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-sm font-black text-green-600 uppercase italic">
                                                        {session.rondas_correctas}/{session.rondas_jugadas}
                                                    </div>
                                                    <div className="bg-yellow-400 px-4 py-2 rounded-2xl text-xs font-black text-indigo-900 border-b-4 border-yellow-600">
                                                        +{session.estrellas_ganadas} ⭐
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center text-white/30 bg-white/5 rounded-[60px] border-4 border-dashed border-white/10">
                                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                    <Users size={120} className="mb-8 opacity-20" />
                                </motion.div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Vista del Reporte</h3>
                                <p className="text-xl max-w-sm mt-6 font-medium leading-relaxed">Haz clic en un estudiante para ver su maravilloso progreso emocional.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className={`rounded-[40px] p-8 ${color} text-white shadow-xl border-b-[8px] flex flex-col items-center text-center transition-transform hover:scale-105`}>
            <div className="p-4 bg-white/20 rounded-[25px] mb-4 backdrop-blur-sm shadow-inner border border-white/10">{icon}</div>
            <div className="text-5xl font-black mb-1 drop-shadow-md">{value}</div>
            <div className="text-xs font-black uppercase tracking-widest opacity-90">{label}</div>
        </div>
    );
}
