"use client"

import { useState, useEffect, useCallback } from 'react'
import { useGame, EMOTIONS, type Emotion } from '@/lib/game-context'
import { GameHeader } from '@/components/game/game-header'
import { Character, Mascot } from '@/components/game/character'

interface Situation {
  text: string
  correctEmotion: Emotion
  image: string
}

const SITUATIONS: Situation[] = [
  { text: 'Tu amigo te regala un juguete nuevo', correctEmotion: 'joy', image: '🎁' },
  { text: 'Se rompio tu juguete favorito', correctEmotion: 'sadness', image: '🧸' },
  { text: 'Alguien tomo tu comida sin permiso', correctEmotion: 'anger', image: '🍪' },
  { text: 'Escuchas un ruido muy fuerte en la noche', correctEmotion: 'fear', image: '🌙' },
  { text: 'Ves un arcoiris en el cielo de repente', correctEmotion: 'surprise', image: '🌈' },
  { text: 'Tu mama te da un abrazo grande', correctEmotion: 'joy', image: '🤗' },
  { text: 'Tu mascota esta perdida', correctEmotion: 'sadness', image: '🐕' },
  { text: 'Tu hermano rompio tu dibujo', correctEmotion: 'anger', image: '🎨' },
  { text: 'Ves una sombra extraña', correctEmotion: 'fear', image: '👻' },
  { text: 'Llega alguien que no esperabas a visitarte', correctEmotion: 'surprise', image: '🚪' },
]

const ROUNDS_PER_GAME = 5

export function SituationGame() {
  const { addStar, addCorrectAnswer, triggerReward, playSound } = useGame()
  const [currentRound, setCurrentRound] = useState(1)
  const [currentSituation, setCurrentSituation] = useState<Situation>(SITUATIONS[0])
  const [usedSituations, setUsedSituations] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const generateRound = useCallback(() => {
    const available = SITUATIONS.map((_, i) => i).filter(i => !usedSituations.includes(i))
    if (available.length === 0) {
      setUsedSituations([])
      setCurrentSituation(SITUATIONS[0])
      return
    }
    
    const randomIndex = available[Math.floor(Math.random() * available.length)]
    setCurrentSituation(SITUATIONS[randomIndex])
    setUsedSituations(prev => [...prev, randomIndex])
    setFeedback(null)
  }, [usedSituations])

  useEffect(() => {
    generateRound()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelect = (selected: Emotion) => {
    if (feedback !== null) return

    if (selected === currentSituation.correctEmotion) {
      setFeedback('correct')
      playSound('success')
      addStar()
      addCorrectAnswer(currentSituation.correctEmotion)
      
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

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader title="Como me siento?" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <Mascot mood="celebrating" />
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Excelente!
            </h2>
            <p className="text-xl text-muted-foreground">
              Aprendiste a reconocer emociones en situaciones!
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader title="Como me siento?" subtitle={`Ronda ${currentRound} de ${ROUNDS_PER_GAME}`} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-6">
        {/* Situation Card */}
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl max-w-md w-full text-center">
          <div className="text-7xl md:text-8xl mb-4">{currentSituation.image}</div>
          <p className="text-lg md:text-xl font-bold text-card-foreground leading-relaxed">
            {currentSituation.text}
          </p>
        </div>

        {/* Question */}
        <div className="flex items-center gap-3">
          <Mascot mood="thinking" />
          <div className="bg-secondary rounded-2xl px-4 py-3 shadow-md">
            <p className="text-lg font-bold text-secondary-foreground">
              Como te sentirias?
            </p>
          </div>
        </div>

        {/* Emotion Options */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {EMOTIONS.map((emotion) => (
            <div
              key={emotion.id}
              className={`transition-all duration-300 ${
                feedback === 'correct' && emotion.id === currentSituation.correctEmotion
                  ? 'scale-110 ring-4 ring-green-400 rounded-full'
                  : feedback === 'incorrect' && emotion.id !== currentSituation.correctEmotion
                  ? 'opacity-40'
                  : ''
              }`}
            >
              <Character
                emotion={emotion.id}
                size="md"
                animate={feedback === null}
                onClick={() => handleSelect(emotion.id)}
                showLabel
              />
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div 
            className={`px-6 py-3 rounded-xl text-xl font-bold animate-pop ${
              feedback === 'correct' 
                ? 'bg-green-400 text-green-900' 
                : 'bg-red-400 text-red-900'
            }`}
          >
            {feedback === 'correct' ? 'Correcto!' : 'Piensa otra vez!'}
          </div>
        )}

        {/* Progress */}
        <div className="flex gap-2">
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
