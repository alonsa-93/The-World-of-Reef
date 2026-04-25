import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const PATTERNS = [
  { sequence: ['🔴', '🔵', '🔴', '🔵', '?'], answer: '🔴', options: ['🔴', '🔵', '🟡'] },
  { sequence: ['🔵', '🔴', '🔵', '🔴', '?'], answer: '🔵', options: ['🔴', '🔵', '🟡'] },
  { sequence: ['🟡', '🟡', '🔴', '🟡', '🟡', '?'], answer: '🔴', options: ['🔴', '🔵', '🟡'] },
  { sequence: ['⭐', '🌙', '⭐', '🌙', '?'], answer: '⭐', options: ['⭐', '🌙', '☀️'] },
  { sequence: ['🍎', '🍌', '🍇', '🍎', '🍌', '?'], answer: '🍇', options: ['🍎', '🍌', '🍇'] },
  { sequence: ['🔺', '🟦', '🔺', '🟦', '🔺', '?'], answer: '🟦', options: ['🔺', '🟦', '🔵'] },
  { sequence: ['🐘', '🐸', '🐘', '?', '🐘', '🐸'], answer: '🐸', options: ['🐘', '🐸', '🦁'], missingIndex: 3 },
  { sequence: ['🌸', '🌼', '🌺', '🌸', '?', '🌺'], answer: '🌼', options: ['🌸', '🌼', '🌺'], missingIndex: 4 },
  { sequence: ['🔴', '🔵', '🟡', '🔴', '🔵', '?'], answer: '🟡', options: ['🔴', '🔵', '🟡'] },
  { sequence: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '?', '3️⃣'], answer: '2️⃣', options: ['1️⃣', '2️⃣', '3️⃣'], missingIndex: 4 },
]

function PatternLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = PATTERNS[level - 1]
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setSelected(null)
    setFeedback(null)
    setTimeout(() => speak('מה הולך אחרי? מצאי את הסדרה!'), 400)
  }, [level])

  const handleSelect = useCallback((option) => {
    if (feedback) return
    playTap()
    setSelected(option)
    if (option === data.answer) {
      setFeedback('correct')
      speak('כן! מצאת את הסדרה!')
      setTimeout(onCorrect, 700)
    } else {
      setFeedback('wrong')
      speak('לא נכון, נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); onWrong() }, 800)
    }
  }, [data, feedback, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-green-50 to-teal-50">
      <p className="font-hebrew text-kid-lg text-green-800 text-center mt-4" dir="rtl">
        מה הולך אחרי?
      </p>

      {/* Pattern display */}
      <div className="flex flex-wrap gap-3 justify-center max-w-sm bg-white rounded-3xl p-4 shadow-kid">
        {data.sequence.map((item, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring' }}
            className={`
              w-16 h-16 flex items-center justify-center text-4xl rounded-2xl
              ${item === '?' ? 'bg-yellow-200 border-2 border-dashed border-yellow-500 text-2xl' : 'bg-gray-50'}
            `}
          >
            {item === '?' ? '?' : item}
          </motion.div>
        ))}
      </div>

      <p className="font-hebrew text-kid-md text-gray-600 mt-2" dir="rtl">מה הגיע תורו?</p>

      {/* Answer options */}
      <div className="flex gap-4 justify-center">
        {data.options.map((option) => {
          const isSelected = selected === option
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={option}
              onPointerDown={() => handleSelect(option)}
              className={`
                w-24 h-24 rounded-3xl text-5xl flex items-center justify-center shadow-kid select-none
                ${isCorrect ? 'bg-green-300' : isWrong ? 'bg-red-200' : 'bg-white border-2 border-green-200'}
              `}
              whileTap={{ scale: 0.9 }}
              animate={isCorrect ? { scale: [1, 1.2, 1] } : isWrong ? { x: [-5, 5, 0] } : {}}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
      <div className="h-6" />
    </div>
  )
}

export default function PatternGamePage() {
  return (
    <GameShell gameId="patterns" gameName="🔵 תבניות קסומות" totalLevels={10}>
      {(props) => <PatternLevel {...props} />}
    </GameShell>
  )
}
