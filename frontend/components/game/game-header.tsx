"use client"

import { useGame } from '@/lib/game-context'
import { StarsDisplay } from './reward-animation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface GameHeaderProps {
  title: string
  subtitle?: string
}

export function GameHeader({ title, subtitle }: GameHeaderProps) {
  const { progress, setCurrentScreen, playSound } = useGame()

  const handleBack = () => {
    playSound('click')
    setCurrentScreen('home')
  }

  return (
    <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm shadow-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="w-8 h-8" />
      </Button>
      
      <div className="flex-1 text-center px-4">
        <h1 className="text-xl md:text-2xl font-bold text-card-foreground truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <StarsDisplay count={progress.totalStars} />
    </header>
  )
}
