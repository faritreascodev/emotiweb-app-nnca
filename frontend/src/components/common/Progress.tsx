interface ProgressProps {
    value: number;
    max?: number;
    color?: string;
    height?: string;
}

export function Progress({ value, max = 100, color = 'bg-blue-600', height = 'h-2' }: ProgressProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
            <div
                className={`${color} ${height} rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
