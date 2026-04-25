import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const CYCLE_STAGES = [
  { id: 'rain', emoji: '🌧️', nameHe: 'גשם יורד', desc: 'לחצי על הענן לגשם!' },
  { id: 'puddle', emoji: '💧', nameHe: 'שלולית', desc: 'יש שלולית! לחצי עליה!' },
  { id: 'sun', emoji: '☀️', nameHe: 'שמש מאדה', desc: 'השמש מייבשת! לחצי עליה!' },
  { id: 'cloud', emoji: '☁️', nameHe: 'ענן חדש!', desc: 'הענן חזר! המחזור הסתיים!' },
]

function WaterCycleLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const [currentStage, setCurrentStage] = useState(0)
  const [showEffect, setShowEffect] = useState(false)

  // On higher levels, show all stages simultaneously and require correct order
  const stagesNeeded = Math.min(2 + Math.floor(level / 3), 4)
  const stages = CYCLE_STAGES.slice(0, stagesNeeded)

  useEffect(() => {
    setCurrentStage(0)
    setShowEffect(false)
    setTimeout(() => speak(stages[0].desc), 500)
  }, [level])

  const handleStage = useCallback((idx) => {
    if (idx !== currentStage) {
      speak('לא הסדר הנכון! נסי שוב!')
      onWrong()
      return
    }
    playTap()
    setShowEffect(true)
    speak(stages[idx].nameHe)

    setTimeout(() => {
      setShowEffect(false)
      if (idx + 1 < stages.length) {
        setCurrentStage(idx + 1)
        speak(stages[idx + 1].desc)
      } else {
        speak('מחזור המים הושלם! כל הכבוד!')
        setTimeout(onCorrect, 800)
      }
    }, 1000)
  }, [currentStage, stages, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Instruction */}
      <motion.p
        key={currentStage}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-hebrew text-kid-md text-blue-700 text-center mt-4 px-4"
        dir="rtl"
      >
        {stages[currentStage]?.desc}
      </motion.p>

      {/* Stage cards */}
      <div className="flex flex-col gap-3 w-full max-w-sm mt-4">
        {stages.map((stage, i) => {
          const isActive = i === currentStage
          const isDone = i < currentStage
          return (
            <motion.button
              key={stage.id}
              onPointerDown={() => handleStage(i)}
              className={`
                min-h-[70px] rounded-3xl flex items-center gap-4 px-5 shadow-kid select-none cursor-pointer
                ${isDone ? 'bg-blue-100 opacity-60' : isActive ? 'bg-blue-400 text-white' : 'bg-white border-2 border-blue-200 opacity-40'}
              `}
              animate={isActive ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
              whileTap={isActive ? { scale: 0.95 } : {}}
            >
              <motion.span
                className="text-4xl"
                animate={isActive && showEffect ? { scale: [1, 1.5, 1], rotate: [0, 20, 0] } : {}}
              >
                {stage.emoji}
              </motion.span>
              <span className="font-hebrew font-bold text-kid-md" dir="rtl">{stage.nameHe}</span>
              {isDone && <span className="mr-auto text-green-600">✓</span>}
              {isActive && !isDone && <span className="mr-auto text-white text-2xl">👆</span>}
            </motion.button>
          )
        })}
      </div>

      {/* Water cycle diagram bottom */}
      <div className="flex items-center gap-2 mt-4 text-3xl">
        {CYCLE_STAGES.slice(0, stagesNeeded).map((s, i) => (
          <span key={i}>{s.emoji}{i < stagesNeeded - 1 ? '→' : '↺'}</span>
        ))}
      </div>
      <div className="h-4" />
    </div>
  )
}

export default function WaterCycleGamePage() {
  return (
    <GameShell gameId="watercycle" gameName="💧 מחזור המים" totalLevels={10}>
      {(props) => <WaterCycleLevel {...props} />}
    </GameShell>
  )
}
