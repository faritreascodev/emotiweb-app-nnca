"use client"

import { useState } from 'react'
import { useGame, EMOTIONS, type Emotion } from '@/lib/game-context'
import { GameHeader } from '@/components/game/game-header'
import { Mascot } from '@/components/game/character'

interface StoryScene {
  id: number
  text: string
  image: string
  question: string
  options: { emotion: Emotion; text: string }[]
  correctEmotion: Emotion
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    text: 'Era un dia soleado. Luna, la conejita, fue al parque a jugar.',
    image: '🐰🌳☀️',
    question: 'Luna vio a sus amigos esperandola. Como se sintio Luna?',
    options: [
      { emotion: 'joy', text: 'Muy feliz de verlos' },
      { emotion: 'sadness', text: 'Triste porque no queria jugar' },
      { emotion: 'fear', text: 'Asustada de sus amigos' },
    ],
    correctEmotion: 'joy',
  },
  {
    id: 2,
    text: 'Luna estaba jugando cuando empezo a llover muy fuerte.',
    image: '🐰🌧️💨',
    question: 'Luna no podia seguir jugando. Como se sintio?',
    options: [
      { emotion: 'joy', text: 'Contenta por la lluvia' },
      { emotion: 'sadness', text: 'Triste porque no podia jugar' },
      { emotion: 'anger', text: 'Enojada con sus amigos' },
    ],
    correctEmotion: 'sadness',
  },
  {
    id: 3,
    text: 'De pronto, Luna escucho un trueno muy fuerte en el cielo.',
    image: '🐰⚡🌩️',
    question: 'El trueno fue muy ruidoso. Como se sintio Luna?',
    options: [
      { emotion: 'joy', text: 'Feliz por el ruido' },
      { emotion: 'fear', text: 'Asustada por el trueno' },
      { emotion: 'anger', text: 'Enojada con el cielo' },
    ],
    correctEmotion: 'fear',
  },
  {
    id: 4,
    text: 'La mama de Luna llego con un paraguas grande y colorido.',
    image: '🐰🌂❤️',
    question: 'Luna no esperaba que su mama llegara. Como se sintio?',
    options: [
      { emotion: 'sadness', text: 'Triste de ver a su mama' },
      { emotion: 'surprise', text: 'Sorprendida de verla' },
      { emotion: 'anger', text: 'Enojada con su mama' },
    ],
    correctEmotion: 'surprise',
  },
  {
    id: 5,
    text: 'En casa, Luna tomo chocolate caliente con su mama.',
    image: '🐰☕🏠',
    question: 'Luna estaba calientita y segura. Como se sintio al final?',
    options: [
      { emotion: 'joy', text: 'Muy feliz y tranquila' },
      { emotion: 'fear', text: 'Asustada en su casa' },
      { emotion: 'sadness', text: 'Triste por estar adentro' },
    ],
    correctEmotion: 'joy',
  },
]

export function StoryGame() {
  const { addStar, addCorrectAnswer, triggerReward, playSound } = useGame()
  const [currentScene, setCurrentScene] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [selectedOption, setSelectedOption] = useState<Emotion | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const scene = STORY_SCENES[currentScene]

  const handleSelect = (emotion: Emotion) => {
    if (feedback !== null) return
    
    setSelectedOption(emotion)
    
    if (emotion === scene.correctEmotion) {
      setFeedback('correct')
      playSound('success')
      addStar()
      addCorrectAnswer(emotion)
      
      setTimeout(() => {
        if (currentScene >= STORY_SCENES.length - 1) {
          triggerReward('applause')
          setIsComplete(true)
        } else {
          triggerReward('star')
          setCurrentScene(prev => prev + 1)
          setFeedback(null)
          setSelectedOption(null)
        }
      }, 1200)
    } else {
      setFeedback('incorrect')
      playSound('error')
      
      setTimeout(() => {
        setFeedback(null)
        setSelectedOption(null)
      }, 1000)
    }
  }

  const getEmotionEmoji = (emotion: Emotion) => {
    return EMOTIONS.find(e => e.id === emotion)?.emoji || ''
  }

  const getEmotionColor = (emotion: Emotion) => {
    return EMOTIONS.find(e => e.id === emotion)?.color || '#ccc'
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader title="Cuentos Magicos" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <Mascot mood="celebrating" />
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fin del cuento!
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Ayudaste a Luna a entender sus emociones!
            </p>
            <div className="text-6xl animate-bounce-soft">🐰💖</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader title="Cuentos Magicos" subtitle={`Pagina ${currentScene + 1} de ${STORY_SCENES.length}`} />
      
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 gap-4 overflow-auto">
        {/* Story Card */}
        <div className="bg-card rounded-3xl p-6 shadow-xl max-w-lg w-full">
          {/* Story illustration */}
          <div className="text-center mb-4">
            <div className="text-6xl md:text-7xl tracking-wider">{scene.image}</div>
          </div>
          
          {/* Story text */}
          <p className="text-lg md:text-xl text-card-foreground text-center leading-relaxed font-medium">
            {scene.text}
          </p>
        </div>

        {/* Question */}
        <div className="flex items-start gap-3 max-w-lg w-full">
          <div className="shrink-0">
            <Mascot mood="thinking" />
          </div>
          <div className="bg-secondary rounded-2xl px-4 py-3 shadow-md flex-1">
            <p className="text-base md:text-lg font-bold text-secondary-foreground">
              {scene.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full max-w-lg">
          {scene.options.map((option) => (
            <button
              key={option.emotion}
              type="button"
              onClick={() => handleSelect(option.emotion)}
              disabled={feedback !== null}
              className={`flex items-center gap-4 p-4 rounded-2xl shadow-md transition-all duration-200 text-left ${
                feedback === 'correct' && option.emotion === scene.correctEmotion
                  ? 'ring-4 ring-green-400 scale-105'
                  : feedback === 'incorrect' && selectedOption === option.emotion
                  ? 'ring-4 ring-red-400 opacity-70'
                  : feedback !== null
                  ? 'opacity-50'
                  : 'hover:scale-102 active:scale-98'
              }`}
              style={{ 
                backgroundColor: feedback === 'correct' && option.emotion === scene.correctEmotion 
                  ? '#86efac' 
                  : getEmotionColor(option.emotion) + '40'
              }}
            >
              <span 
                className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0"
                style={{ backgroundColor: getEmotionColor(option.emotion) }}
              >
                {getEmotionEmoji(option.emotion)}
              </span>
              <span className="text-base md:text-lg font-semibold text-foreground">
                {option.text}
              </span>
            </button>
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
            {feedback === 'correct' ? 'Muy bien!' : 'No es esa, intenta otra!'}
          </div>
        )}

        {/* Progress */}
        <div className="flex gap-2 pb-4">
          {STORY_SCENES.map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                i < currentScene
                  ? 'bg-primary'
                  : i === currentScene
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
