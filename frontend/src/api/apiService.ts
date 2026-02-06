const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const headers = new Headers(options.headers);

        if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
        if (this.token) headers.set('Authorization', `Bearer ${this.token}`);

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error en la petición');
        return data;
    }


    async login(email: string, password: string) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response.data;
    }

    async register(data: any) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    async getProfile() {
        const response = await this.request('/auth/profile');
        return response.data;
    }

    async getGames() {
        const response = await this.request('/games');
        return response.data;
    }

    async getGameQuestions(gameId: string) {
        const response = await this.request(`/games/${gameId}/questions`);
        return response.data;
    }

    async startSession(juegoId: string) {
        const response = await this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify({ juegoId }),
        });
        return response.data;
    }

    async finishSession(sessionId: number, rondasJugadas: number, rondasCorrectas: number) {
        const response = await this.request(`/sessions/${sessionId}/finish`, {
            method: 'POST',
            body: JSON.stringify({ rondasJugadas, rondasCorrectas }),
        });
        return response.data;
    }

    async getUserSessions() {
        const response = await this.request('/sessions/user');
        return response.data;
    }

    async getProgress() {
        const response = await this.request('/progress');
        return response.data;
    }

    async getAllStudents() {
        const response = await this.request('/parent/students');
        return response.data;
    }

    async getChildProgress(childId: number) {
        const response = await this.request(`/parent/child/${childId}`);
        return response.data;
    }
}

export const apiService = new ApiService();
