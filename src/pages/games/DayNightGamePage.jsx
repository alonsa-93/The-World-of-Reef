import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

// Levels alternate between "make day" and "make night"
const LEVEL_GOALS = [
  { goal: 'day', instruction: 'הזזי את השמש ימינה כדי להפוך ליום!' },
  { goal: 'night', instruction: 'הזזי את הירח שמאלה כדי להפוך ללילה!' },
  { goal: 'day', instruction: 'יום! גרגרי את השמש!' },
  { goal: 'night', instruction: 'לילה! הזיזי את הירח!' },
  { goal: 'day', instruction: 'הפכי ליום!' },
  { goal: 'night', instruction: 'לילה בבקשה!' },
  { goal: 'day', instruction: 'עכשיו בסדר הפוך — הפכי ליום!' },
  { goal: 'night', instruction: 'לילה שוב!' },
  { goal: 'day', instruction: 'מהר! הפכי ליום!' },
  { goal: 'night', instruction: 'לילה אחרון!' },
]

function DayNightLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const levelGoal = LEVEL_GOALS[level - 1]
  const [position, setPosition] = useState(0.5) // 0 = night left, 1 = day right
  const [submitted, setSubmitted] = useState(false)
  const sliderRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    setPosition(0.5)
    setSubmitted(false)
    setTimeout(() => speak(levelGoal.instruction), 500)
  }, [level])

  // Sky color interpolation
  const isDayGoal = levelGoal.goal === 'day'
  const skyColor = `hsl(${200 + position * 20}, ${40 + position * 40}%, ${30 + position * 45}%)`

  const handlePointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current || !sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    setPosition(Math.max(0, Math.min(1, x)))
  }, [])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    if (submitted) return
    const isDay = position > 0.65
    const isNight = position < 0.35
    if ((isDayGoal && isDay) || (!isDayGoal && isNight)) {
      setSubmitted(true)
      playTap()
      speak(isDayGoal ? 'יופי! יום!' : 'יופי! לילה!')
      setTimeout(onCorrect, 800)
    } else {
      speak(isDayGoal ? 'עוד קצת ימינה!' : 'עוד קצת שמאלה!')
      onWrong()
    }
  }, [position, isDayGoal, submitted, onCorrect, onWrong, speak, playTap])

  return (
    <div
      className="flex flex-col items-center justify-between h-full p-4 transition-colors duration-500"
      style={{ background: `linear-gradient(to bottom, ${skyColor}, #1a1a3e)` }}
    >
      <motion.p
        key={level}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-hebrew font-bold text-kid-lg text-white text-center mt-4 drop-shadow"
        dir="rtl"
      >
        {levelGoal.instruction}
      </motion.p>

      {/* Sky scene */}
      <div className="relative w-full h-48 flex items-center justify-between px-8">
        <motion.span className="text-6xl select-none" style={{ opacity: 1 - position }}>🌙</motion.span>
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-white/60 text-lg">{'⭐'.repeat(3)}</span>
          ))}
        </div>
        <motion.span className="text-6xl select-none" style={{ opacity: position }}>☀️</motion.span>
      </div>

      {/* Slider */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        <div className="flex justify-between w-full text-white font-hebrew text-kid-sm">
          <span>🌙 לילה</span>
          <span>יום ☀️</span>
        </div>
        <div
          ref={sliderRef}
          className="relative w-full h-14 bg-white/20 rounded-full cursor-pointer overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div
            className="absolute inset-y-0 left-0 bg-yellow-300/40 rounded-full transition-none"
            style={{ width: `${position * 100}%` }}
          />
          <motion.div
            className="absolute top-1 bottom-1 w-12 h-12 bg-white rounded-full shadow-kid flex items-center justify-center text-2xl select-none"
            style={{ left: `calc(${position * 100}% - 24px)` }}
          >
            {isDayGoal ? '☀️' : '🌙'}
          </motion.div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}

export default function DayNightGamePage() {
  return (
    <GameShell gameId="daynight" gameName="🌞 יום ולילה" totalLevels={10}>
      {(props) => <DayNightLevel {...props} />}
    </GameShell>
  )
}
