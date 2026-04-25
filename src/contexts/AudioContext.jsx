import { createContext, useContext, useState, useCallback } from 'react'
import { audioService } from '../services/audio'

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = useCallback(() => {
    const muted = audioService.toggleMute()
    setIsMuted(muted)
  }, [])

  const speak = useCallback((text, opts) => audioService.speak(text, opts), [])
  const playSound = useCallback((name, opts) => audioService.playSound(name, opts), [])
  const playElsa = useCallback((sound) => audioService.playElsa(sound), [])
  const playStitch = useCallback((sound) => audioService.playStitch(sound), [])
  const playTap = useCallback(() => audioService.playTap(), [])
  const playSuccess = useCallback(() => audioService.playSuccess(), [])
  const playError = useCallback(() => audioService.playError(), [])
  const playStar = useCallback(() => audioService.playStar(), [])
  const playCelebration = useCallback(() => audioService.playCelebration(), [])

  return (
    <AudioCtx.Provider value={{
      isMuted, toggleMute,
      speak, playSound,
      playElsa, playStitch,
      playTap, playSuccess, playError, playStar, playCelebration,
    }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => useContext(AudioCtx)
