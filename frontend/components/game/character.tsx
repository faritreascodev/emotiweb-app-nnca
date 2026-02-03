"use client"

import { type Emotion, EMOTIONS } from '@/lib/game-context'

interface CharacterProps {
  emotion: Emotion
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  onClick?: () => void
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-16 h-16 text-3xl',
  md: 'w-24 h-24 text-5xl',
  lg: 'w-32 h-32 text-6xl',
  xl: 'w-40 h-40 text-7xl',
}

export function Character({ emotion, size = 'md', animate = true, onClick, showLabel = false }: CharacterProps) {
  const emotionData = EMOTIONS.find(e => e.id === emotion)
  if (!emotionData) return null

  const baseClasses = `
    flex items-center justify-center rounded-full shadow-lg
    transition-all duration-300 ease-in-out
    ${sizeClasses[size]}
    ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
    ${animate ? 'animate-bounce-soft' : ''}
  `

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        style={{ backgroundColor: emotionData.color }}
        aria-label={emotionData.nameEs}
      >
        <span role="img" aria-hidden="true">{emotionData.emoji}</span>
      </button>
      {showLabel && (
        <span className="text-lg font-bold text-foreground text-center">
          {emotionData.nameEs}
        </span>
      )}
    </div>
  )
}

// Mascota principal de la app - Un simpático monstruito
export function Mascot({ mood = 'happy', speaking = false }: { mood?: 'happy' | 'thinking' | 'celebrating', speaking?: boolean }) {
  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy': return '🐻'
      case 'thinking': return '🤔'
      case 'celebrating': return '🎉'
      default: return '🐻'
    }
  }

  return (
    <div className={`relative ${speaking ? 'animate-wiggle' : 'animate-float'}`}>
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary flex items-center justify-center text-6xl md:text-7xl shadow-xl border-4 border-secondary-foreground/20">
        <span role="img" aria-label="Mascota EmotiWeb">{getMascotEmoji()}</span>
      </div>
      {speaking && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pop">
          <span className="text-lg">💬</span>
        </div>
      )}
    </div>
  )
}
