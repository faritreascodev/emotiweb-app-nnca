import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-lg p-6 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
