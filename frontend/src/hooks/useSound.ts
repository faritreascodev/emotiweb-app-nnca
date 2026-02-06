import { useCallback } from 'react';

export const useSound = () => {
    const speak = useCallback((text: string, rate: number = 0.9) => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Spanish by default
        utterance.rate = rate;
        utterance.pitch = 1.1; // Slightly higher pitch for kid-friendly voice

        // Find a nice voice if possible (Google Español or similar)
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.includes('es') && v.name.includes('Google')) ||
            voices.find(v => v.lang.includes('es'));
        if (esVoice) utterance.voice = esVoice;

        window.speechSynthesis.speak(utterance);
    }, []);

    const playEffect = useCallback((type: 'correct' | 'wrong' | 'click' | 'win') => {
        // Simple oscillator beeps for feedback if no files
        // But ideally we'd use AudioContext. For now, let's just stick to speech or silent 
        // to avoid browser autoplay policies blocking pure audio context without interaction.
        // We can simulate sounds with short speech like "¡Bien!" or "Ups".

        if (type === 'correct') speak('¡Muy bien!');
        if (type === 'wrong') speak('Inténtalo de nuevo.');
        if (type === 'win') speak('¡Ganaste!');
    }, [speak]);

    return { speak, playEffect };
};
