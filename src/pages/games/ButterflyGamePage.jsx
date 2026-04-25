import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const STAGES = [
  { id: 'egg', emoji: '🥚', nameHe: 'ביצה', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'caterpillar', emoji: '🐛', nameHe: 'זחל', color: 'bg-green-100 border-green-300' },
  { id: 'cocoon', emoji: '🫘', nameHe: 'גולם', color: 'bg-amber-100 border-amber-300' },
  { id: 'butterfly', emoji: '🦋', nameHe: 'פרפר!', color: 'bg-purple-100 border-purple-300' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function ButterflyLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const stagesNeeded = Math.min(2 + Math.floor((level - 1) / 3), 4)
  const activeStages = STAGES.slice(0, stagesNeeded)
  const [shuffled] = useState(() => shuffle(activeStages))
  const [completed, setCompleted] = useState([])
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    setCompleted([])
    setCelebrating(false)
    setTimeout(() => speak('לחצי על שלבי חיי הפרפר בסדר הנכון!'), 500)
  }, [level])

  const nextStageId = activeStages[completed.length]?.id

  const handleTap = useCallback((stage) => {
    if (celebrating || completed.includes(stage.id)) return
    if (stage.id === nextStageId) {
      playTap()
      speak(stage.nameHe)
      const newCompleted = [...completed, stage.id]
      setCompleted(newCompleted)
      if (newCompleted.length === activeStages.length) {
        setCelebrating(true)
        speak('כל הכבוד! הפרפר יצא!')
        setTimeout(onCorrect, 1500)
      }
    } else {
      speak('לא נכון! בסדר הנכון!')
      onWrong()
    }
  }, [celebrating, completed, nextStageId, activeStages, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Correct order hint */}
      <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
        {activeStages.map((s, i) => (
          <span key={s.id} className="flex items-center gap-1">
            <span className={`text-3xl rounded-xl p-1 ${completed.includes(s.id) ? 'opacity-100 bg-green-100' : 'opacity-30'}`}>{s.emoji}</span>
            {i < activeStages.length - 1 && <span className="text-gray-400">→</span>}
          </span>
        ))}
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
            className="text-[100px] text-center my-4"
          >
            🦋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shuffled stage cards */}
      {!celebrating && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {shuffled.map((stage) => {
            const isDone = completed.includes(stage.id)
            return (
              <motion.button
                key={stage.id}
                onPointerDown={() => handleTap(stage)}
                className={`
                  min-h-[100px] rounded-3xl flex flex-col items-center justify-center gap-2 p-3 shadow-kid select-none
                  border-2 ${stage.color}
                  ${isDone ? 'opacity-40' : 'cursor-pointer'}
                `}
                whileTap={!isDone ? { scale: 0.92 } : {}}
                animate={isDone ? { scale: 0.9, opacity: 0.4 } : {}}
              >
                <span className="text-5xl">{stage.emoji}</span>
                <span className="font-hebrew font-bold text-kid-sm text-gray-700" dir="rtl">{stage.nameHe}</span>
                {isDone && <span className="text-green-600 text-lg">✓</span>}
              </motion.button>
            )
          })}
        </div>
      )}
      <div className="h-4" />
    </div>
  )
}

export default function ButterflyGamePage() {
  return (
    <GameShell gameId="butterfly" gameName="🦋 מחזור הפרפר" totalLevels={10}>
      {(props) => <ButterflyLevel {...props} />}
    </GameShell>
  )
}
