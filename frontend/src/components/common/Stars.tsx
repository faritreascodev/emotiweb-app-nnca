interface StarsProps {
    count: number;
    size?: 'sm' | 'md' | 'lg';
}

export function Stars({ count, size = 'md' }: StarsProps) {
    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl'
    };

    return (
        <div className="flex items-center gap-2">
            <span className={sizeClasses[size]}>⭐</span>
            <span className="font-bold text-yellow-600">{count}</span>
        </div>
    );
}
