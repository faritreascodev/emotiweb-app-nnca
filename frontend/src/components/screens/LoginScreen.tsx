import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export function LoginScreen() {
    const { login } = useGame();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            // Navigation is handled by App.tsx redirection or here
            // But typically state change triggers App re-render
        } catch (err: any) {
            setError('Credenciales incorrectas o error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-20 left-20 text-yellow-400 opacity-20"
                >
                    <Sparkles size={100} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute bottom-40 right-20 text-pink-400 opacity-20"
                >
                    <Heart size={120} />
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-3xl w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 mb-4 shadow-lg shadow-orange-500/50">
                        <span className="text-4xl">🎭</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 text-glow">EmotiWeb</h1>
                    <p className="text-purple-200">Aprende jugando con tus emociones</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-200 ml-1">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all font-sans"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-200 ml-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all font-sans"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full shadow-xl shadow-indigo-500/40"
                        isLoading={loading}
                    >
                        ¡Entrar a Jugar!
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-purple-200">
                        ¿No tienes cuenta? <span className="text-yellow-400 font-bold cursor-pointer hover:underline">Pide ayuda a tu profesor</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
