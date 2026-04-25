import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS = [
  { word: 'אבא', syllables: 2 },
  { word: 'אמא', syllables: 2 },
  { word: 'כלב', syllables: 2 },
  { word: 'ציפור', syllables: 2 },
  { word: 'תפוח', syllables: 2 },
  { word: 'אריה', syllables: 3 },
  { word: 'פרפר', syllables: 2 },
  { word: 'בננה', syllables: 3 },
  { word: 'כדורגל', syllables: 4 },
  { word: 'משפחה', syllables: 3 },
]

function getBalloonCount(syllables) {
  return Math.min(syllables + 2, 6)
}

function SyllableLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS[level - 1]
  const totalBalloons = getBalloonCount(data.syllables)
  const [popped, setPopped] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const BALLOON_COLORS = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400']

  useEffect(() => {
    setPopped([])
    setSubmitted(false)
    setTimeout(() => speak(data.word), 400)
  }, [level])

  const handlePop = useCallback((idx) => {
    if (submitted) return
    if (popped.includes(idx)) return
    playTap()
    setPopped((prev) => [...prev, idx])
  }, [popped, submitted, playTap])

  const handleSubmit = useCallback(() => {
    if (submitted) return
    setSubmitted(true)
    if (popped.length === data.syllables) {
      speak(`כן! ${data.word} - ${data.syllables} הברות!`)
      setTimeout(onCorrect, 800)
    } else {
      speak(popped.length < data.syllables ? 'צריך עוד! נסי שוב!' : 'יותר מדי! נסי שוב!')
      setTimeout(() => { setPopped([]); setSubmitted(false); onWrong() }, 1200)
    }
  }, [popped, data, submitted, onCorrect, onWrong, speak])

  const handleReset = () => { setPopped([]); setSubmitted(false) }

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Word + repeat */}
      <motion.button
        onPointerDown={() => speak(data.word)}
        className="mt-4 bg-orange-400 text-white px-8 py-4 rounded-full shadow-kid flex items-center gap-3"
        whileTap={{ scale: 0.95 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-3xl">🔊</span>
        <span className="font-hebrew font-bold text-kid-xl" dir="rtl">{data.word}</span>
      </motion.button>

      <p className="font-hebrew text-kid-md text-gray-600 mt-2 text-center" dir="rtl">
        פצצי בלון לכל הברה!<br />
        <span className="text-kid-sm text-gray-400">({popped.length} פוצצו)</span>
      </p>

      {/* Balloons */}
      <div className="flex flex-wrap gap-4 justify-center max-w-xs my-4">
        <AnimatePresence>
          {Array.from({ length: totalBalloons }).map((_, i) => {
            const isPopped = popped.includes(i)
            return (
              <motion.button
                key={i}
                onPointerDown={() => handlePop(i)}
                className={`w-20 h-24 rounded-full shadow-kid select-none flex items-center justify-center text-3xl
                  ${isPopped ? 'bg-gray-200 opacity-40' : BALLOON_COLORS[i % BALLOON_COLORS.length]}
                `}
                animate={isPopped ? { scale: [1.3, 0.1], opacity: [1, 0.3] } : { y: [0, -6, 0] }}
                transition={isPopped ? { duration: 0.3 } : { duration: 1.5 + i * 0.2, repeat: Infinity }}
                whileTap={!isPopped ? { scale: 1.2 } : {}}
              >
                {isPopped ? '💥' : '🎈'}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Submit + reset */}
      <div className="flex gap-3 w-full max-w-xs">
        <motion.button
          onPointerDown={handleReset}
          className="flex-1 py-4 rounded-full bg-gray-200 font-hebrew font-bold text-kid-md text-gray-600"
          whileTap={{ scale: 0.95 }}
        >
          אפס 🔄
        </motion.button>
        <motion.button
          onPointerDown={handleSubmit}
          className="flex-2 py-4 px-6 rounded-full bg-orange-500 text-white font-hebrew font-bold text-kid-md shadow-kid"
          whileTap={{ scale: 0.95 }}
          disabled={popped.length === 0}
        >
          בדקי! ✓
        </motion.button>
      </div>
      <div className="h-2" />
    </div>
  )
}

export default function SyllableGamePage() {
  return (
    <GameShell gameId="syllables" gameName="🎈 מחיאות כף" totalLevels={10}>
      {(props) => <SyllableLevel {...props} />}
    </GameShell>
  )
}
