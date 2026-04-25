import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS = [
  { letter: 'א', options: ['א', 'ב', 'ג', 'ד'] },
  { letter: 'ב', options: ['א', 'ב', 'ג', 'ד'] },
  { letter: 'ג', options: ['ג', 'ד', 'ה', 'ו'] },
  { letter: 'ד', options: ['ג', 'ד', 'ה', 'ו'] },
  { letter: 'ה', options: ['ה', 'ו', 'ז', 'ח'] },
  { letter: 'ו', options: ['ה', 'ו', 'ז', 'ח'] },
  { letter: 'כ', options: ['כ', 'מ', 'נ', 'ס'] },
  { letter: 'ל', options: ['כ', 'ל', 'מ', 'נ'] },
  { letter: 'מ', options: ['כ', 'ל', 'מ', 'נ'] },
  { letter: 'ש', options: ['ש', 'ת', 'ר', 'ק'] },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function FindLetterLevel({ level, config, onCorrect, onWrong, attemptCount }) {
  const { speak, playTap } = useAudio()
  const levelData = LEVELS[level - 1]
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'

  useEffect(() => {
    setOptions(shuffle(levelData.options))
    setSelected(null)
    setFeedback(null)
    setTimeout(() => speak(`איפה האות ${levelData.letter}?`), 400)
  }, [level])

  const handleRepeat = () => {
    speak(`איפה האות ${levelData.letter}?`)
  }

  const handleSelect = useCallback((letter) => {
    if (feedback) return
    playTap()
    setSelected(letter)
    if (letter === levelData.letter) {
      setFeedback('correct')
      speak(`כן! האות ${levelData.letter}!`)
      setTimeout(onCorrect, 800)
    } else {
      setFeedback('wrong')
      speak('לא... נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); onWrong() }, 900)
    }
  }, [levelData, feedback, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-purple-50 to-indigo-50">
      {/* Question + repeat button */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <motion.button
          onPointerDown={handleRepeat}
          className="bg-purple-400 text-white px-6 py-3 rounded-full font-hebrew font-bold text-kid-md shadow-kid flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          🔊 <span dir="rtl">איפה האות {levelData.letter}?</span>
        </motion.button>
        <p className="font-hebrew text-kid-sm text-gray-500" dir="rtl">לחצי על האות הנכונה!</p>
      </div>

      {/* Target letter display */}
      <motion.div
        key={level}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="text-[120px] font-bold text-purple-600 leading-none select-none"
        style={{ fontFamily: 'Heebo, sans-serif' }}
      >
        {levelData.letter}
      </motion.div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {options.map((letter) => {
          const isSelected = selected === letter
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={letter}
              onPointerDown={() => handleSelect(letter)}
              className={`
                min-h-[90px] rounded-3xl text-[56px] font-bold shadow-kid select-none
                flex items-center justify-center
                ${isCorrect ? 'bg-green-400 text-white' : isWrong ? 'bg-red-300 text-white' : 'bg-white text-purple-700 border-2 border-purple-200'}
              `}
              whileTap={{ scale: 0.93 }}
              animate={isCorrect ? { scale: [1, 1.15, 1] } : isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: 'Heebo, sans-serif' }}
            >
              {letter}
            </motion.button>
          )
        })}
      </div>

      <div className="h-4" />
    </div>
  )
}

export default function FindLetterGamePage() {
  return (
    <GameShell gameId="findletter" gameName="🔤 מצאי את האות" totalLevels={10}>
      {(props) => <FindLetterLevel {...props} />}
    </GameShell>
  )
}
