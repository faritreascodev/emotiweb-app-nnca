export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise';

export interface EmotionData {
    id: Emotion;
    nombre_es: string;
    emoji: string;
    color: string;
}

export interface User {
    id: number;
    nombre: string;
    email: string;
    tipo: 'estudiante' | 'padre' | 'educador';
    avatar: string;
}

export interface Game {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    color: string;
}

export interface Question {
    id: number;
    texto: string;
    imagen: string;
    emocion_correcta: Emotion;
    nivel_dificultad: number;
}

export interface GameProgress {
    totalStars: number;
    gamesPlayed: number;
    correctAnswers: number;
}
