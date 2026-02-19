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
        return response.data.preguntas;
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

    async getMyChildren() {
        const response = await this.request('/parent/my-children');
        return response.data;
    }

    async registerChild(data: any) {
        const response = await this.request('/parent/register-child', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    async linkChild(hijoId: number) {
        const response = await this.request('/parent/link-child', {
            method: 'POST',
            body: JSON.stringify({ hijoId }),
        });
        return response.data;
    }

    async unlinkChild(hijoId: number) {
        const response = await this.request(`/parent/unlink-child/${hijoId}`, {
            method: 'DELETE',
        });
        return response.data;
    }

    async recordAnswer(sessionId: number, answerData: {
        situacionId?: number | null;
        emocionSeleccionada: string;
        emocionCorrecta: string;
        tiempoRespuesta?: number;
        numeroRonda: number;
    }) {
        const response = await this.request(`/sessions/${sessionId}/answer`, {
            method: 'POST',
            body: JSON.stringify(answerData),
        });
        return response.data;
    }

    async getAchievements() {
        const response = await this.request('/progress/achievements');
        return response.data;
    }

    async getAdminDashboard() {
        const response = await this.request('/admin/dashboard');
        return response.data;
    }

    async getAllUsers() {
        const response = await this.request('/admin/users');
        return response.data;
    }

    async toggleUserStatus(userId: number, activo: boolean) {
        const response = await this.request(`/admin/users/${userId}/toggle`, {
            method: 'PUT',
            body: JSON.stringify({ activo }),
        });
        return response.data;
    }

    async getSystemHealth() {
        const response = await this.request('/admin/health');
        return response.data;
    }

    async adminCreateUser(data: any) {
        const response = await this.request('/admin/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    async adminDeleteUser(userId: number) {
        const response = await this.request(`/admin/users/${userId}`, {
            method: 'DELETE',
        });
        return response.data;
    }

    async adminGetGames() {
        const response = await this.request('/admin/games');
        return response.data;
    }

    async adminUpdateGame(gameId: string, data: any) {
        const response = await this.request(`/admin/games/${gameId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    }
}

export const apiService = new ApiService();
