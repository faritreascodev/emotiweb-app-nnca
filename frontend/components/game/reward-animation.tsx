"use client"

import { useEffect, useState } from 'react'
import { useGame } from '@/lib/game-context'

export function RewardAnimation() {
  const { showReward, rewardType, hideReward } = useGame()
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([])

  useEffect(() => {
    if (showReward) {
      // Generate random star positions
      const newStars = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
      setStars(newStars)
    }
  }, [showReward])

  if (!showReward) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={hideReward}
      onKeyDown={(e) => e.key === 'Escape' && hideReward()}
      role="button"
      tabIndex={0}
    >
      {/* Stars explosion */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-pop text-4xl"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        >
          ⭐
        </div>
      ))}
      
      {/* Main reward */}
      <div className="animate-pop flex flex-col items-center gap-6">
        {rewardType === 'star' && (
          <>
            <div className="text-9xl animate-wiggle">⭐</div>
            <div className="text-3xl md:text-4xl font-bold text-accent-foreground bg-accent px-8 py-4 rounded-2xl shadow-xl">
              Excelente!
            </div>
          </>
        )}
        
        {rewardType === 'sticker' && (
          <>
            <div className="text-9xl animate-bounce-soft">🏆</div>
            <div className="text-3xl md:text-4xl font-bold text-primary-foreground bg-primary px-8 py-4 rounded-2xl shadow-xl">
              Genial!
            </div>
          </>
        )}
        
        {rewardType === 'applause' && (
          <>
            <div className="flex gap-4 text-8xl">
              <span className="animate-wiggle" style={{ animationDelay: '0s' }}>👏</span>
              <span className="animate-wiggle" style={{ animationDelay: '0.1s' }}>🎉</span>
              <span className="animate-wiggle" style={{ animationDelay: '0.2s' }}>👏</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-secondary-foreground bg-secondary px-8 py-4 rounded-2xl shadow-xl">
              Muy bien!
            </div>
          </>
        )}
        
        <p className="text-xl text-card-foreground bg-card px-6 py-3 rounded-xl shadow-md">
          Toca para continuar
        </p>
      </div>
    </div>
  )
}

// Stars counter display
export function StarsDisplay({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 bg-accent/30 px-4 py-2 rounded-full">
      <span className="text-2xl animate-sparkle">⭐</span>
      <span className="text-xl font-bold text-foreground">{count}</span>
    </div>
  )
}
