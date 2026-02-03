"use client"

import { useState, useEffect, useCallback } from 'react'
import { useGame, EMOTIONS, type Emotion } from '@/lib/game-context'
import { GameHeader } from '@/components/game/game-header'
import { Mascot } from '@/components/game/character'

interface MatchItem {
  id: string
  emotion: Emotion
  emoji: string
  color: string
  matched: boolean
}

interface Target {
  id: string
  emotion: Emotion
  label: string
  matched: boolean
}

const ROUNDS_PER_GAME = 3

export function DragDropGame() {
  const { addStar, addCorrectAnswer, triggerReward, playSound } = useGame()
  const [currentRound, setCurrentRound] = useState(1)
  const [items, setItems] = useState<MatchItem[]>([])
  const [targets, setTargets] = useState<Target[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)

  const generateRound = useCallback(() => {
    // Select 3 random emotions for this round
    const shuffled = [...EMOTIONS].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 3)
    
    const newItems: MatchItem[] = selected.map((e, i) => ({
      id: `item-${i}`,
      emotion: e.id,
      emoji: e.emoji,
      color: e.color,
      matched: false,
    })).sort(() => Math.random() - 0.5)
    
    const newTargets: Target[] = selected.map((e, i) => ({
      id: `target-${i}`,
      emotion: e.id,
      label: e.nameEs,
      matched: false,
    })).sort(() => Math.random() - 0.5)
    
    setItems(newItems)
    setTargets(newTargets)
    setSelectedItem(null)
    setMatchedCount(0)
  }, [])

  useEffect(() => {
    generateRound()
  }, [generateRound])

  const handleItemClick = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item?.matched) return
    
    playSound('click')
    setSelectedItem(itemId)
  }

  const handleTargetClick = (targetId: string) => {
    if (!selectedItem) return
    
    const target = targets.find(t => t.id === targetId)
    const item = items.find(i => i.id === selectedItem)
    
    if (!target || !item || target.matched) return
    
    if (item.emotion === target.emotion) {
      // Correct match!
      playSound('success')
      
      setItems(prev => prev.map(i => 
        i.id === selectedItem ? { ...i, matched: true } : i
      ))
      setTargets(prev => prev.map(t => 
        t.id === targetId ? { ...t, matched: true } : t
      ))
      
      addStar()
      addCorrectAnswer(item.emotion)
      
      const newMatchedCount = matchedCount + 1
      setMatchedCount(newMatchedCount)
      setSelectedItem(null)
      
      // Check if round complete
      if (newMatchedCount >= 3) {
        setTimeout(() => {
          if (currentRound >= ROUNDS_PER_GAME) {
            triggerReward('applause')
            setIsComplete(true)
          } else {
            triggerReward('sticker')
            setCurrentRound(prev => prev + 1)
            generateRound()
          }
        }, 600)
      }
    } else {
      // Wrong match
      playSound('error')
      setSelectedItem(null)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader title="Arrastra y Suelta" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <Mascot mood="celebrating" />
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Increible!
            </h2>
            <p className="text-xl text-muted-foreground">
              Uniste todas las emociones correctamente!
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader title="Arrastra y Suelta" subtitle={`Ronda ${currentRound} de ${ROUNDS_PER_GAME}`} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-6">
        {/* Instructions */}
        <div className="flex items-center gap-3">
          <Mascot mood="thinking" />
          <div className="bg-card rounded-2xl px-4 py-3 shadow-lg">
            <p className="text-lg font-bold text-card-foreground">
              Toca una cara y luego su nombre!
            </p>
          </div>
        </div>

        {/* Items (Faces) */}
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              disabled={item.matched}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-lg transition-all duration-200 ${
                item.matched
                  ? 'opacity-40 scale-90'
                  : selectedItem === item.id
                  ? 'ring-4 ring-primary scale-110 animate-wiggle'
                  : 'hover:scale-105 active:scale-95'
              }`}
              style={{ backgroundColor: item.color }}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        {/* Connector line visual */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-8 h-0.5 bg-border" />
          <span className="text-2xl">↓</span>
          <div className="w-8 h-0.5 bg-border" />
        </div>

        {/* Targets (Labels) */}
        <div className="flex flex-wrap justify-center gap-4">
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => handleTargetClick(target.id)}
              disabled={target.matched || !selectedItem}
              className={`px-6 py-4 rounded-2xl text-lg md:text-xl font-bold shadow-lg transition-all duration-200 ${
                target.matched
                  ? 'bg-green-400 text-green-900 scale-90'
                  : selectedItem
                  ? 'bg-secondary text-secondary-foreground hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {target.label}
            </button>
          ))}
        </div>

        {/* Match counter */}
        <div className="flex gap-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xl transition-all ${
                i < matchedCount
                  ? 'bg-green-400 animate-pop'
                  : 'bg-muted'
              }`}
            >
              {i < matchedCount ? '✓' : '○'}
            </div>
          ))}
        </div>

        {/* Round progress */}
        <div className="flex gap-2 mt-2">
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
