import { useEffect, useState } from 'react';

interface RewardAnimationProps {
    show: boolean;
    type: 'star' | 'trophy' | 'celebration';
    onComplete?: () => void;
}

export function RewardAnimation({ show, type, onComplete }: RewardAnimationProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onComplete?.();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!visible) return null;

    const icons = {
        star: '⭐',
        trophy: '🏆',
        celebration: '🎉'
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="animate-ping text-9xl">
                {icons[type]}
            </div>
        </div>
    );
}
