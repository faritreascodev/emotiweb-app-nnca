"use client"

import { useEffect, useCallback, useRef } from 'react'

type SoundType = 'success' | 'error' | 'click' | 'cheer'

// Web Audio API sound generator (no external files needed)
function createOscillatorSound(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

function playSuccessSound(audioContext: AudioContext) {
  // Happy ascending notes
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => {
      createOscillatorSound(audioContext, freq, 0.2, 'sine', 0.2)
    }, i * 100)
  })
}

function playErrorSound(audioContext: AudioContext) {
  // Gentle low tone
  createOscillatorSound(audioContext, 220, 0.3, 'sine', 0.15)
}

function playClickSound(audioContext: AudioContext) {
  // Quick pop
  createOscillatorSound(audioContext, 880, 0.05, 'sine', 0.1)
}

function playCheerSound(audioContext: AudioContext) {
  // Celebratory fanfare
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => {
      createOscillatorSound(audioContext, freq, 0.3, 'sine', 0.25)
    }, i * 150)
  })
}

export function SoundManager() {
  const audioContextRef = useRef<AudioContext | null>(null)
  
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    return audioContextRef.current
  }, [])

  const playSound = useCallback((soundType: SoundType) => {
    try {
      const audioContext = initAudioContext()
      
      switch (soundType) {
        case 'success':
          playSuccessSound(audioContext)
          break
        case 'error':
          playErrorSound(audioContext)
          break
        case 'click':
          playClickSound(audioContext)
          break
        case 'cheer':
          playCheerSound(audioContext)
          break
      }
    } catch (error) {
      console.log('[v0] Audio not available:', error)
    }
  }, [initAudioContext])

  useEffect(() => {
    const handlePlaySound = (event: Event) => {
      const customEvent = event as CustomEvent<SoundType>
      playSound(customEvent.detail)
    }

    window.addEventListener('playSound', handlePlaySound)
    
    // Initialize audio context on first user interaction
    const initOnInteraction = () => {
      initAudioContext()
      document.removeEventListener('click', initOnInteraction)
      document.removeEventListener('touchstart', initOnInteraction)
    }
    
    document.addEventListener('click', initOnInteraction)
    document.addEventListener('touchstart', initOnInteraction)

    return () => {
      window.removeEventListener('playSound', handlePlaySound)
      document.removeEventListener('click', initOnInteraction)
      document.removeEventListener('touchstart', initOnInteraction)
    }
  }, [playSound, initAudioContext])

  return null // This component doesn't render anything
}
