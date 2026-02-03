"use client"

import { GameProvider, useGame } from '@/lib/game-context'
import { HomeScreen } from '@/components/screens/home-screen'
import { GameScreen } from '@/components/screens/game-screen'
import { ParentDashboard } from '@/components/screens/parent-dashboard'
import { RewardAnimation } from '@/components/game/reward-animation'
import { SoundManager } from '@/components/game/sound-manager'

function AppContent() {
  const { currentScreen } = useGame()

  return (
    <>
      <SoundManager />
      <RewardAnimation />
      
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'parent' && <ParentDashboard />}
    </>
  )
}

export function EmotiWebApp() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
