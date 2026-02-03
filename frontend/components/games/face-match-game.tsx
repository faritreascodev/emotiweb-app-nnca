"use client"

import { useState, useEffect, useCallback } from 'react'
import { useGame, EMOTIONS, type Emotion } from '@/lib/game-context'
import { GameHeader } from '@/components/game/game-header'
import { Character, Mascot } from '@/components/game/character'

const ROUNDS_PER_GAME = 5

export function FaceMatchGame() {
  const { addStar, addCorrectAnswer, triggerReward, playSound } = useGame()
  const [currentRound, setCurrentRound] = useState(1)
  const [targetEmotion, setTargetEmotion] = useState<Emotion>('joy')
  const [options, setOptions] = useState<Emotion[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const generateRound = useCallback(() => {
    // Pick random target emotion
    const allEmotions = EMOTIONS.map(e => e.id)
    const target = allEmotions[Math.floor(Math.random() * allEmotions.length)]
    
    // Generate 3 options including the correct one
    const wrongOptions = allEmotions.filter(e => e !== target)
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5)
    const selectedWrong = shuffledWrong.slice(0, 2)
    
    const allOptions = [target, ...selectedWrong].sort(() => Math.random() - 0.5)
    
    setTargetEmotion(target)
    setOptions(allOptions as Emotion[])
    setFeedback(null)
  }, [])

  useEffect(() => {
    generateRound()
  }, [generateRound])

  const handleSelect = (selected: Emotion) => {
    if (feedback !== null) return // Prevent double selection

    if (selected === targetEmotion) {
      setFeedback('correct')
      playSound('success')
      addStar()
      addCorrectAnswer(targetEmotion)
      
      setTimeout(() => {
        if (currentRound >= ROUNDS_PER_GAME) {
          triggerReward('applause')
          setIsComplete(true)
        } else {
          triggerReward('star')
          setCurrentRound(prev => prev + 1)
          generateRound()
        }
      }, 800)
    } else {
      setFeedback('incorrect')
      playSound('error')
      
      setTimeout(() => {
        setFeedback(null)
      }, 1000)
    }
  }

  const getEmotionName = (emotion: Emotion) => {
    return EMOTIONS.find(e => e.id === emotion)?.nameEs || ''
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader title="Caras y Emociones" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <Mascot mood="celebrating" />
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Felicidades!
            </h2>
            <p className="text-xl text-muted-foreground">
              Completaste el juego de caras y emociones!
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader title="Caras y Emociones" subtitle={`Ronda ${currentRound} de ${ROUNDS_PER_GAME}`} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-6">
        {/* Mascot with instruction */}
        <div className="flex flex-col items-center gap-4">
          <Mascot mood="thinking" speaking />
          <div className="bg-card rounded-2xl px-6 py-4 shadow-lg max-w-sm text-center">
            <p className="text-lg md:text-xl font-bold text-card-foreground">
              Encuentra la cara de{' '}
              <span 
                className="px-3 py-1 rounded-full text-card-foreground"
                style={{ backgroundColor: EMOTIONS.find(e => e.id === targetEmotion)?.color }}
              >
                {getEmotionName(targetEmotion)}
              </span>
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {options.map((emotion, index) => (
            <div
              key={`${emotion}-${index}`}
              className={`transition-all duration-300 ${
                feedback === 'correct' && emotion === targetEmotion
                  ? 'scale-110 ring-4 ring-green-400 rounded-full'
                  : feedback === 'incorrect' && emotion !== targetEmotion
                  ? 'opacity-50'
                  : ''
              }`}
            >
              <Character
                emotion={emotion}
                size="lg"
                animate={feedback === null}
                onClick={() => handleSelect(emotion)}
                showLabel
              />
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div 
            className={`mt-4 px-6 py-3 rounded-xl text-xl font-bold animate-pop ${
              feedback === 'correct' 
                ? 'bg-green-400 text-green-900' 
                : 'bg-red-400 text-red-900'
            }`}
          >
            {feedback === 'correct' ? 'Muy bien!' : 'Intentalo de nuevo!'}
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex gap-2 mt-4">
          {Array.from({ length: ROUNDS_PER_GAME }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                i < currentRound - 1
                  ? 'bg-primary'
                  : i === currentRound - 1
                  ? 'bg-accent animate-pulse'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
