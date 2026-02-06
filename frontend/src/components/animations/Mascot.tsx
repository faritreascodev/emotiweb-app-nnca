interface MascotProps {
    mood?: 'happy' | 'sad' | 'thinking' | 'excited';
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
}

export function Mascot({ mood = 'happy', size = 'md', animate = true }: MascotProps) {
    const moodEmojis = {
        happy: '🐻',
        sad: '😢',
        thinking: '🤔',
        excited: '🎉'
    };

    const sizeClasses = {
        sm: 'text-6xl',
        md: 'text-8xl',
        lg: 'text-9xl'
    };

    return (
        <div className={`${sizeClasses[size]} ${animate ? 'animate-bounce' : ''}`}>
            {moodEmojis[mood]}
        </div>
    );
}
