"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise'

export interface EmotionData {
  id: Emotion
  name: string
  nameEs: string
  color: string
  emoji: string
  sound: string
}

export const EMOTIONS: EmotionData[] = [
  { id: 'joy', name: 'Joy', nameEs: 'Alegria', color: '#FFD93D', emoji: '😊', sound: '/sounds/joy.mp3' },
  { id: 'sadness', name: 'Sadness', nameEs: 'Tristeza', color: '#6B9FFF', emoji: '😢', sound: '/sounds/sadness.mp3' },
  { id: 'anger', name: 'Anger', nameEs: 'Enojo', color: '#FF6B6B', emoji: '😠', sound: '/sounds/anger.mp3' },
  { id: 'fear', name: 'Fear', nameEs: 'Miedo', color: '#A78BFA', emoji: '😨', sound: '/sounds/fear.mp3' },
  { id: 'surprise', name: 'Surprise', nameEs: 'Sorpresa', color: '#FF9F43', emoji: '😲', sound: '/sounds/surprise.mp3' },
]

export interface GameProgress {
  totalStars: number
  gamesPlayed: number
  correctAnswers: number
  emotionsLearned: Emotion[]
  achievements: string[]
  lastPlayed: Date | null
}

interface GameContextType {
  progress: GameProgress
  currentScreen: 'home' | 'game' | 'parent' | 'rewards'
  selectedGame: string | null
  showReward: boolean
  rewardType: 'star' | 'sticker' | 'applause' | null
  
  setCurrentScreen: (screen: 'home' | 'game' | 'parent' | 'rewards') => void
  selectGame: (gameId: string) => void
  addStar: () => void
  addCorrectAnswer: (emotion: Emotion) => void
  triggerReward: (type: 'star' | 'sticker' | 'applause') => void
  hideReward: () => void
  resetProgress: () => void
  playSound: (soundType: 'success' | 'error' | 'click' | 'cheer') => void
}

const defaultProgress: GameProgress = {
  totalStars: 0,
  gamesPlayed: 0,
  correctAnswers: 0,
  emotionsLearned: [],
  achievements: [],
  lastPlayed: null,
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game' | 'parent' | 'rewards'>('home')
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [rewardType, setRewardType] = useState<'star' | 'sticker' | 'applause' | null>(null)

  const selectGame = useCallback((gameId: string) => {
    setSelectedGame(gameId)
    setCurrentScreen('game')
  }, [])

  const addStar = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      totalStars: prev.totalStars + 1,
      lastPlayed: new Date(),
    }))
  }, [])

  const addCorrectAnswer = useCallback((emotion: Emotion) => {
    setProgress(prev => {
      const newEmotionsLearned = prev.emotionsLearned.includes(emotion)
        ? prev.emotionsLearned
        : [...prev.emotionsLearned, emotion]
      
      return {
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        emotionsLearned: newEmotionsLearned,
        gamesPlayed: prev.gamesPlayed + 1,
        lastPlayed: new Date(),
      }
    })
  }, [])

  const triggerReward = useCallback((type: 'star' | 'sticker' | 'applause') => {
    setRewardType(type)
    setShowReward(true)
    
    // Auto-hide after animation
    setTimeout(() => {
      setShowReward(false)
      setRewardType(null)
    }, 2500)
  }, [])

  const hideReward = useCallback(() => {
    setShowReward(false)
    setRewardType(null)
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
  }, [])

  const playSound = useCallback((soundType: 'success' | 'error' | 'click' | 'cheer') => {
    // Sound effects are handled by the SoundManager component
    const event = new CustomEvent('playSound', { detail: soundType })
    window.dispatchEvent(event)
  }, [])

  return (
    <GameContext.Provider
      value={{
        progress,
        currentScreen,
        selectedGame,
        showReward,
        rewardType,
        setCurrentScreen,
        selectGame,
        addStar,
        addCorrectAnswer,
        triggerReward,
        hideReward,
        resetProgress,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
