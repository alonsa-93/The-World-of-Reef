import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ElsaOverlay, StitchOverlay } from '../characters/CharacterOverlay'
import { useAudio } from '../../contexts/AudioContext'
import { useProgress } from '../../hooks/useProgress'
import { useInactivity } from '../../hooks/useInactivity'
import { analytics } from '../../services/analytics'
import StarDisplay from '../ui/StarDisplay'
import AppHeader from '../layout/AppHeader'

export default function GameShell({ gameId, gameName, totalLevels = 10, levelConfig, children }) {
  const navigate = useNavigate()
  const { speak, playSuccess, playError, playStar, playCelebration } = useAudio()
  const { completeLevel, getLevelStars } = useProgress(gameId)

  const [currentLevel, setCurrentLevel] = useState(1)
  const [attemptCount, setAttemptCount] = useState(0)
  const [character, setCharacter] = useState(null) // { type: 'elsa'|'stitch', mood }
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const [noMistakes, setNoMistakes] = useState(true)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    analytics.gameStarted(gameId, currentLevel)
    startTimeRef.current = Date.now()
    const config = levelConfig?.[currentLevel - 1]
    if (config?.voiceHe) speak(config.voiceHe)
  }, [currentLevel])

  // Inactivity hint
  useInactivity(useCallback(() => {
    const config = levelConfig?.[currentLevel - 1]
    if (config?.voiceHe) speak(config.voiceHe)
    setCharacter({ type: 'elsa', mood: 'hint' })
  }, [currentLevel, levelConfig, speak]))

  const handleCorrect = useCallback(() => {
    playSuccess()
    const duration = Date.now() - startTimeRef.current
    const isFast = duration < 15000
    const stars = noMistakes ? (isFast ? 3 : 2) : 1

    setEarnedStars(stars)
    completeLevel(currentLevel, noMistakes, isFast)
    analytics.gameCompleted(gameId, currentLevel, stars, duration)

    setTimeout(() => playStar(), 300)
    setTimeout(() => {
      setCharacter({ type: 'stitch', mood: 'success' })
      setShowLevelComplete(true)
    }, 600)
  }, [noMistakes, currentLevel, completeLevel, playSuccess, playStar])

  const handleWrong = useCallback(() => {
    const newCount = attemptCount + 1
    setAttemptCount(newCount)
    setNoMistakes(false)
    playError()
    analytics.wrongAttempt(gameId, currentLevel, newCount)

    const config = levelConfig?.[currentLevel - 1]

    if (newCount >= (config?.autoCompleteAfterAttempts || 5)) {
      // Auto-complete
      analytics.hintShown(gameId, currentLevel, 'auto-complete')
      setCharacter({ type: 'elsa', mood: 'hint' })
      setTimeout(handleCorrect, 2000)
    } else if (newCount >= (config?.hintAfterAttempts || 3)) {
      analytics.hintShown(gameId, currentLevel, 'elsa-hint')
      setCharacter({ type: 'elsa', mood: 'hint' })
    } else {
      setCharacter({ type: 'elsa', mood: 'mistake' })
    }
  }, [attemptCount, currentLevel, levelConfig, playError, handleCorrect])

  const goNextLevel = useCallback(() => {
    setShowLevelComplete(false)
    setCharacter(null)
    if (currentLevel < totalLevels) {
      setCurrentLevel((l) => l + 1)
      setAttemptCount(0)
      setNoMistakes(true)
      startTimeRef.current = Date.now()
    } else {
      playCelebration()
      navigate(-1)
    }
  }, [currentLevel, totalLevels, navigate, playCelebration])

  const config = levelConfig?.[currentLevel - 1]

  return (
    <div className="flex flex-col h-full bg-reef-bg no-select">
      <AppHeader title={gameName} showBack />

      {/* Level indicator */}
      <div className="flex justify-center gap-1.5 py-3 px-4">
        {Array.from({ length: totalLevels }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 < currentLevel ? 'bg-reef-grass' :
              i + 1 === currentLevel ? 'bg-reef-ocean' :
              'bg-gray-200'
            }`}
            style={{ width: i + 1 === currentLevel ? 24 : 8 }}
          />
        ))}
      </div>

      {/* Game content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            className="absolute inset-0"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children({
              level: currentLevel,
              config,
              onCorrect: handleCorrect,
              onWrong: handleWrong,
              attemptCount,
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Level complete overlay */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-4xl p-8 mx-6 text-center shadow-kid-lg"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <p className="font-hebrew font-bold text-kid-xl text-gray-800 mb-4" dir="rtl">
                {currentLevel < totalLevels ? `שלב ${currentLevel} הושלם!` : 'סיימת את כל השלבים!'}
              </p>
              <StarDisplay stars={earnedStars} maxStars={3} size="lg" animate />
              <motion.button
                className="mt-6 bg-reef-ocean text-white font-hebrew font-bold text-kid-lg px-10 py-4 rounded-full shadow-kid"
                whileTap={{ scale: 0.95 }}
                onClick={goNextLevel}
              >
                {currentLevel < totalLevels ? '!הבא ➡' : '!סיום 🎊'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character overlays */}
      <AnimatePresence>
        {character && (
          character.type === 'elsa'
            ? <ElsaOverlay key="elsa" type={character.mood} onClose={() => setCharacter(null)} />
            : <StitchOverlay key="stitch" type={character.mood} onClose={() => setCharacter(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
