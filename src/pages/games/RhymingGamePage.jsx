import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS = [
  { word: 'פיל', emoji: '🐘', options: [{ word: 'טיל', emoji: '🚀', correct: true }, { word: 'כלב', emoji: '🐕', correct: false }, { word: 'ספר', emoji: '📚', correct: false }] },
  { word: 'בית', emoji: '🏠', options: [{ word: 'זית', emoji: '🫒', correct: true }, { word: 'ים', emoji: '🌊', correct: false }, { word: 'עץ', emoji: '🌳', correct: false }] },
  { word: 'שמש', emoji: '☀️', options: [{ word: 'ממש', emoji: '✨', correct: true }, { word: 'ירח', emoji: '🌙', correct: false }, { word: 'כוכב', emoji: '⭐', correct: false }] },
  { word: 'דב', emoji: '🐻', options: [{ word: 'לב', emoji: '❤️', correct: true }, { word: 'ארנב', emoji: '🐰', correct: false }, { word: 'פרפר', emoji: '🦋', correct: false }] },
  { word: 'חתול', emoji: '🐈', options: [{ word: 'גדול', emoji: '📏', correct: true }, { word: 'כלב', emoji: '🐕', correct: false }, { word: 'ציפור', emoji: '🐦', correct: false }] },
  { word: 'כוס', emoji: '🥤', options: [{ word: 'אוֹז', emoji: '🦆', correct: true }, { word: 'מים', emoji: '💧', correct: false }, { word: 'לחם', emoji: '🍞', correct: false }] },
  { word: 'פרח', emoji: '🌸', options: [{ word: 'ירח', emoji: '🌙', correct: true }, { word: 'שמש', emoji: '☀️', correct: false }, { word: 'גשם', emoji: '🌧️', correct: false }] },
  { word: 'ים', emoji: '🌊', options: [{ word: 'יום', emoji: '📅', correct: false }, { word: 'אים', emoji: '😨', correct: false }, { word: 'חם', emoji: '🌡️', correct: true }] },
  { word: 'כדור', emoji: '⚽', options: [{ word: 'שדור', emoji: '📡', correct: true }, { word: 'כובע', emoji: '🎩', correct: false }, { word: 'נעל', emoji: '👟', correct: false }] },
  { word: 'דג', emoji: '🐟', options: [{ word: 'רג', emoji: '🦶', correct: false }, { word: 'שג', emoji: '🔒', correct: false }, { word: 'עג', emoji: '🍰', correct: true }] },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function RhymingLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS[level - 1]
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setOptions(shuffle(data.options))
    setSelected(null)
    setFeedback(null)
    setTimeout(() => speak(`מה מתחרז עם ${data.word}?`), 400)
  }, [level])

  const handleSelect = useCallback((option) => {
    if (feedback) return
    playTap()
    setSelected(option.word)
    if (option.correct) {
      setFeedback('correct')
      speak(`כן! ${data.word} ו${option.word} מתחרזים!`)
      setTimeout(onCorrect, 900)
    } else {
      setFeedback('wrong')
      speak('לא... נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); onWrong() }, 900)
    }
  }, [data, feedback, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-pink-50 to-rose-50">
      {/* Source word */}
      <motion.button
        onPointerDown={() => speak(`מה מתחרז עם ${data.word}?`)}
        className="mt-4 bg-pink-400 text-white px-6 py-4 rounded-full shadow-kid flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <span>🎵</span>
        <span className="font-hebrew font-bold text-kid-lg" dir="rtl">מה מתחרז עם...?</span>
      </motion.button>

      <motion.div
        key={level}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center gap-2 my-4"
      >
        <span className="text-8xl">{data.emoji}</span>
        <span className="font-hebrew font-bold text-kid-xl text-pink-700" dir="rtl">{data.word}</span>
      </motion.div>

      {/* Rhyme options */}
      <div className="flex gap-3 w-full max-w-sm justify-center">
        {options.map((option) => {
          const isSelected = selected === option.word
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={option.word}
              onPointerDown={() => handleSelect(option)}
              className={`
                flex-1 min-h-[100px] rounded-3xl shadow-kid select-none flex flex-col items-center justify-center gap-1 p-2
                ${isCorrect ? 'bg-green-300' : isWrong ? 'bg-red-200' : 'bg-white border-2 border-pink-200'}
              `}
              whileTap={{ scale: 0.92 }}
              animate={isCorrect ? { scale: [1, 1.15, 1] } : isWrong ? { x: [-5, 5, 0] } : {}}
            >
              <span className="text-4xl">{option.emoji}</span>
              <span className="font-hebrew font-bold text-kid-sm text-gray-700" dir="rtl">{option.word}</span>
            </motion.button>
          )
        })}
      </div>
      <div className="h-6" />
    </div>
  )
}

export default function RhymingGamePage() {
  return (
    <GameShell gameId="rhyming" gameName="🎵 מילים מתחרזות" totalLevels={10}>
      {(props) => <RhymingLevel {...props} />}
    </GameShell>
  )
}
