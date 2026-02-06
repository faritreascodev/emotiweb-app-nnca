import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../api/apiService';

export interface User {
    id: number;
    nombre: string;
    email: string;
    tipo: 'estudiante' | 'padre' | 'educador';
    avatar: string;
}

interface GameContextType {
    user: User | null;
    isAuthenticated: boolean;
    sessionId: number | null;
    currentGameId: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    startSession: (gameId: string) => Promise<void>;
    finishSession: (rounds: number, correct: number) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiService.setToken(token);
            loadProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const loadProfile = async () => {
        try {
            const userData = await apiService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Error loading profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const data = await apiService.login(email, password);
        setUser(data.user);
    };

    const logout = () => {
        apiService.clearToken();
        setUser(null);
        setSessionId(null);
        setCurrentGameId(null);
    };

    const startSession = async (gameId: string) => {
        try {
            const session = await apiService.startSession(gameId);
            setSessionId(session.id);
            setCurrentGameId(gameId);
        } catch (error) {
            console.error("Failed to start session", error);
            throw error;
        }
    };

    const finishSession = async (rounds: number, correct: number) => {
        if (sessionId) {
            try {
                await apiService.finishSession(sessionId, rounds, correct);
            } catch (error) {
                console.error("Failed to finish session", error);
            } finally {
                setSessionId(null);
                setCurrentGameId(null);
            }
        }
    };

    return (
        <GameContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                sessionId,
                currentGameId,
                loading,
                login,
                logout,
                startSession,
                finishSession,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
