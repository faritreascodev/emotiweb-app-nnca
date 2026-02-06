import { useEffect, useState } from 'react';
import { apiService } from '../../api/apiService';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { ArrowLeft, User, Star, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ParentScreen() {
    const { user } = useGame();
    const navigate = useNavigate();
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only load if educator or parent
        if (user?.tipo === 'estudiante') {
            navigate('/');
            return;
        }

        const loadData = async () => {
            try {
                const data = await apiService.getAllStudents();
                setStudents(data);
            } catch (e) {
                console.error("Error loading students", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user, navigate]);

    const loadStudentProgress = async (studentId: number) => {
        try {
            const progress = await apiService.getChildProgress(studentId);
            // Merge with student list info if needed, or just set selected
            // Here assuming progress returns full stats
            setSelectedStudent({ ...students.find(s => s.id === studentId), stats: progress });
        } catch (e) {
            console.error("Error loading child progress", e);
        }
    };

    if (loading) return <div className="text-white text-center p-10">Cargando panel...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
                <Button variant="ghost" className="text-white mr-4" onClick={() => navigate('/')}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-3xl font-display font-bold text-white">Panel de Seguimiento</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar List */}
                <div className="glass-panel rounded-2xl p-6 h-fit">
                    <h2 className="text-xl text-white font-bold mb-4">Estudiantes</h2>
                    <div className="space-y-3">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => loadStudentProgress(student.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${selectedStudent?.id === student.id ? 'bg-white/20 border-yellow-400' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-xl">
                                    {student.avatar || '🎓'}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{student.nombre}</div>
                                    <div className="text-xs text-purple-200">{student.email}</div>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && <p className="text-white/50">No hay estudiantes asignados.</p>}
                    </div>
                </div>

                {/* Stats Content */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <div className="space-y-6 animate-fade-in">
                            {/* Header Card */}
                            <div className="glass-panel rounded-2xl p-8 flex items-center justify-between bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl shadow-xl">
                                        {selectedStudent.avatar || '👤'}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">{selectedStudent.nombre}</h2>
                                        <p className="text-purple-200">Reporte General</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-yellow-400">{selectedStudent.stats?.total_estrellas || 0}</div>
                                    <div className="text-sm text-white/60">Estrellas Totales</div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard icon={<Trophy />} label="Juegos Completados" value={selectedStudent.stats?.total_juegos_jugados || 0} color="from-green-400 to-emerald-600" />
                                <StatCard icon={<Star />} label="Respuestas Correctas" value={selectedStudent.stats?.total_respuestas_correctas || 0} color="from-yellow-400 to-orange-500" />
                                <StatCard icon={<Clock />} label="Sesiones" value={selectedStudent.stats?.total_sesiones || 0} color="from-blue-400 to-indigo-500" />
                            </div>

                            {/* Emotions Mastery (Mock visual as API might not give detail breakdown yet) */}
                            <div className="glass-panel rounded-2xl p-6">
                                <h3 className="text-xl text-white font-bold mb-4">Dominio Emocional</h3>
                                <div className="space-y-4">
                                    <ProgressBar label="Alegría" percent={85} color="bg-yellow-400" />
                                    <ProgressBar label="Tristeza" percent={60} color="bg-blue-400" />
                                    <ProgressBar label="Enojo" percent={45} color="bg-red-400" />
                                    <ProgressBar label="Miedo" percent={70} color="bg-purple-400" />
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full text-white/50">
                            <User size={64} className="mb-4 opacity-50" />
                            <p>Selecciona un estudiante para ver su progreso</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className={`rounded-2xl p-6 bg-gradient-to-br ${color} text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">{icon}</div>
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm opacity-90">{label}</div>
        </div>
    );
}

function ProgressBar({ label, percent, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm text-white mb-1">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
