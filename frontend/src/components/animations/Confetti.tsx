import { useEffect, useState } from 'react';

interface ConfettiProps {
    active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute top-0 w-2 h-2 bg-yellow-400 rounded-full animate-fall"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`
                    }}
                />
            ))}
        </div>
    );
}
