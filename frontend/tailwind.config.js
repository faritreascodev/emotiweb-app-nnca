/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                emotion: {
                    joy: '#FFD93D',
                    sadness: '#6B9FFF',
                    anger: '#FF6B6B',
                    fear: '#A78BFA',
                    surprise: '#FF9F43',
                },
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',
                    200: 'rgba(255, 255, 255, 0.2)',
                    300: 'rgba(255, 255, 255, 0.3)',
                    400: 'rgba(255, 255, 255, 0.4)',
                }
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-10px)" },
                    "75%": { transform: "translateX(10px)" },
                },
                fall: {
                    "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
                    "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
                },
                ping: {
                    "0%": { transform: "scale(1)", opacity: "1" },
                    "75%, 100%": { transform: "scale(2)", opacity: "0" },
                }
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out',
                'fall': 'fall 3s linear forwards',
                'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Fredoka', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
