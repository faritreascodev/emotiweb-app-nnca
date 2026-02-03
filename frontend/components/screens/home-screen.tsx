"use client"

import { useGame } from '@/lib/game-context'
import { Mascot } from '@/components/game/character'
import { StarsDisplay } from '@/components/game/reward-animation'
import { Button } from '@/components/ui/button'

const GAMES = [
  {
    id: 'face-match',
    title: 'Caras y Emociones',
    description: 'Encuentra la cara correcta',
    icon: '😊',
    color: '#FFD93D',
  },
  {
    id: 'situation',
    title: 'Como me siento?',
    description: 'Elige la emocion',
    icon: '🎭',
    color: '#4ECDC4',
  },
  {
    id: 'drag-drop',
    title: 'Arrastra y Suelta',
    description: 'Une las emociones',
    icon: '🎯',
    color: '#FF6B6B',
  },
  {
    id: 'story',
    title: 'Cuentos Magicos',
    description: 'Historias interactivas',
    icon: '📖',
    color: '#A78BFA',
  },
]

export function HomeScreen() {
  const { progress, selectGame, setCurrentScreen, playSound } = useGame()

  const handleGameSelect = (gameId: string) => {
    playSound('click')
    selectGame(gameId)
  }

  const handleParentAccess = () => {
    playSound('click')
    setCurrentScreen('parent')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl shadow-md">
            <span role="img" aria-label="EmotiWeb Logo">🌈</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">EmotiWeb</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <StarsDisplay count={progress.totalStars} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleParentAccess}
            className="w-12 h-12 rounded-full bg-muted"
            aria-label="Acceso para padres"
          >
            <span className="text-xl">👨‍👩‍👧</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Mascot Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <Mascot mood="happy" speaking />
          <div className="bg-card rounded-2xl px-6 py-4 shadow-lg max-w-xs text-center">
            <p className="text-xl md:text-2xl font-bold text-card-foreground">
              Hola! Vamos a aprender sobre emociones!
            </p>
          </div>
        </div>

        {/* Game Selection Grid */}
        <div className="w-full max-w-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground mb-6">
            Elige un juego
          </h2>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game.id)}
                className="touch-target flex flex-col items-center p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-ring"
                style={{ backgroundColor: game.color }}
                type="button"
              >
                <span className="text-5xl md:text-6xl mb-2" role="img" aria-hidden="true">
                  {game.icon}
                </span>
                <span className="text-lg md:text-xl font-bold text-card-foreground text-center">
                  {game.title}
                </span>
                <span className="text-sm text-card-foreground/80 text-center mt-1 hidden md:block">
                  {game.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Aprendiendo emociones de forma divertida
        </p>
      </footer>
    </div>
  )
}
