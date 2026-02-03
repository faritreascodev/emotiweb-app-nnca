"use client"

import { useGame } from '@/lib/game-context'
import { FaceMatchGame } from '@/components/games/face-match-game'
import { SituationGame } from '@/components/games/situation-game'
import { DragDropGame } from '@/components/games/drag-drop-game'
import { StoryGame } from '@/components/games/story-game'

export function GameScreen() {
  const { selectedGame } = useGame()

  switch (selectedGame) {
    case 'face-match':
      return <FaceMatchGame />
    case 'situation':
      return <SituationGame />
    case 'drag-drop':
      return <DragDropGame />
    case 'story':
      return <StoryGame />
    default:
      return <FaceMatchGame />
  }
}
