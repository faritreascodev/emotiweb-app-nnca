import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, User, Calendar, Mail, Lock } from 'lucide-react';

const AVATARS = ['🐻', '🦁', '🐯', '🐼', '🐨', '🦊', '🦒', '🦓'];

export function RegisterScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'estudiante' as 'estudiante' | 'padre' | 'admin',
        fechaNacimiento: '',
        avatar: '🐻'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiService.register(formData);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">

            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-10 text-yellow-400 opacity-20"
                >
                    <StarIcon size={120} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="glass-panel p-8 rounded-[40px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden"
            >
                <div className="text-center mb-8 relative">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-yellow-300 to-orange-500 mb-4 shadow-xl shadow-orange-500/20"
                    >
                        <Rocket className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">¡Únete a la Aventura!</h1>
                    <p className="text-purple-200">Crea tu cuenta y empieza a aprender</p>

                    {/* Step indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {[1, 2].map((s) => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-yellow-400' : 'w-2 bg-white/20'}`} />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step-1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2 ml-1">
                                            <User size={16} /> Tu Nombre
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all"
                                            placeholder="¿Cómo te llamas?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2 ml-1">
                                            <Mail size={16} /> Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all"
                                            placeholder="nombre@ejemplo.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2 ml-1">
                                            <Lock size={16} /> Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all"
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-purple-200 flex items-center gap-2 ml-1">
                                            <Calendar size={16} /> Fecha de Nacimiento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.fechaNacimiento}
                                            onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <Button type="button" onClick={() => setStep(2)} className="w-full h-14 text-lg">Continuar</Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step-2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-purple-200 block text-center">Selecciona tu Rol</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['estudiante', 'padre', 'admin'] as const).map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, tipo: role })}
                                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 capitalize ${formData.tipo === role ? 'bg-yellow-400 border-yellow-300 text-indigo-900 shadow-lg' : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'}`}
                                            >
                                                <div className="text-2xl">
                                                    {role === 'estudiante' ? '🎒' : role === 'padre' ? '👨‍👩‍👧' : '🎖️'}
                                                </div>
                                                <span className="text-xs font-bold">{role}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-purple-200 block text-center">Elige tu Avatar</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                        {AVATARS.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, avatar: emoji })}
                                                className={`text-3xl p-2 rounded-xl transition-all ${formData.avatar === emoji ? 'bg-white/20 scale-125 ring-2 ring-yellow-400' : 'hover:bg-white/10'}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 h-14">Atrás</Button>
                                    <Button type="submit" isLoading={loading} className="flex-[2] h-14 text-lg">Crear Cuenta</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-purple-200">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-yellow-400 font-bold hover:underline">Inicia sesión aquí</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function StarIcon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .587l3.668 7.431 8.332 1.21-6.001 5.85 1.416 8.265L12 18.896l-7.415 3.903 1.416-8.265-6.001-5.85 8.332-1.21z" />
        </svg>
    );
}
