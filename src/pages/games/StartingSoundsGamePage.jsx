import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS = [
  { word: 'אריה', firstLetter: 'א', options: ['א', 'ב', 'ג'] },
  { word: 'בית', firstLetter: 'ב', options: ['א', 'ב', 'ג'] },
  { word: 'גמל', firstLetter: 'ג', options: ['ג', 'ד', 'ה'] },
  { word: 'דג', firstLetter: 'ד', options: ['ג', 'ד', 'ה'] },
  { word: 'ילד', firstLetter: 'י', options: ['י', 'כ', 'ל'] },
  { word: 'כדור', firstLetter: 'כ', options: ['י', 'כ', 'ל'] },
  { word: 'מים', firstLetter: 'מ', options: ['מ', 'נ', 'ס'] },
  { word: 'נחש', firstLetter: 'נ', options: ['מ', 'נ', 'ס'] },
  { word: 'פרח', firstLetter: 'פ', options: ['פ', 'צ', 'ק'] },
  { word: 'שמש', firstLetter: 'ש', options: ['ש', 'ת', 'ר'] },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function StartingSoundsLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS[level - 1]
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setOptions(shuffle(data.options))
    setSelected(null)
    setFeedback(null)
    setRevealed(false)
    setTimeout(() => speak(data.word), 400)
  }, [level])

  const handleSelect = useCallback((letter) => {
    if (feedback) return
    playTap()
    setSelected(letter)
    setRevealed(true)
    if (letter === data.firstLetter) {
      setFeedback('correct')
      speak(`נכון! ${data.word} מתחיל ב-${data.firstLetter}!`)
      setTimeout(onCorrect, 900)
    } else {
      setFeedback('wrong')
      speak('לא נכון, נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); setRevealed(false); onWrong() }, 900)
    }
  }, [data, feedback, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-teal-50 to-cyan-50">
      {/* Play word button */}
      <motion.button
        onPointerDown={() => speak(data.word)}
        className="mt-4 bg-teal-500 text-white px-8 py-5 rounded-full shadow-kid flex items-center gap-3"
        whileTap={{ scale: 0.95 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-3xl">🔊</span>
        <span className="font-hebrew font-bold text-kid-xl" dir="rtl">שמעי!</span>
      </motion.button>

      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-hebrew text-kid-lg text-gray-700 mt-2" dir="rtl"
        >
          {data.word}
        </motion.p>
      )}

      <p className="font-hebrew text-kid-md text-gray-600 text-center mt-2" dir="rtl">
        במה מתחילה המילה?
      </p>

      {/* Letter options */}
      <div className="flex gap-4 w-full max-w-xs justify-center mt-4">
        {options.map((letter) => {
          const isSelected = selected === letter
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={letter}
              onPointerDown={() => handleSelect(letter)}
              className={`
                flex-1 min-h-[90px] rounded-3xl text-[52px] font-bold shadow-kid select-none
                flex items-center justify-center
                ${isCorrect ? 'bg-green-400 text-white' : isWrong ? 'bg-red-300 text-white' : 'bg-white text-teal-700 border-2 border-teal-200'}
              `}
              whileTap={{ scale: 0.92 }}
              animate={isCorrect ? { scale: [1, 1.2, 1] } : isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              style={{ fontFamily: 'Heebo, sans-serif' }}
            >
              {letter}
            </motion.button>
          )
        })}
      </div>

      <div className="h-8" />
    </div>
  )
}

export default function StartingSoundsGamePage() {
  return (
    <GameShell gameId="startingsounds" gameName="🔊 במה מתחילה?" totalLevels={10}>
      {(props) => <StartingSoundsLevel {...props} />}
    </GameShell>
  )
}
