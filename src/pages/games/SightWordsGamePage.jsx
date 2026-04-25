import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const WORD_DATA = [
  { word: 'אבא', emoji: '👨', options: ['👨', '👩'] },
  { word: 'אמא', emoji: '👩', options: ['👨', '👩'] },
  { word: 'כלב', emoji: '🐕', options: ['🐕', '🐈'] },
  { word: 'חתול', emoji: '🐈', options: ['🐕', '🐈', '🐟'] },
  { word: 'פיל', emoji: '🐘', options: ['🐘', '🦁', '🐸'] },
  { word: 'שמש', emoji: '☀️', options: ['☀️', '🌙', '⭐'] },
  { word: 'ים', emoji: '🌊', options: ['🌊', '🏔️', '🌳'] },
  { word: 'תפוח', emoji: '🍎', options: ['🍎', '🍌', '🍇', '🍊'] },
  { word: 'כוכב', emoji: '⭐', options: ['☀️', '🌙', '⭐', '❄️'] },
  { word: 'לב', emoji: '❤️', options: ['❤️', '⭐', '🌸', '🎈'] },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function SightWordsLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = WORD_DATA[level - 1]
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setOptions(shuffle(data.options))
    setSelected(null)
    setFeedback(null)
    setTimeout(() => speak(data.word), 400)
  }, [level])

  const handleSelect = useCallback((emoji) => {
    if (feedback) return
    playTap()
    setSelected(emoji)
    if (emoji === data.emoji) {
      setFeedback('correct')
      speak(`כן! ${data.word}!`)
      setTimeout(onCorrect, 800)
    } else {
      setFeedback('wrong')
      speak('לא נכון, נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); onWrong() }, 900)
    }
  }, [data, feedback, onCorrect, onWrong, speak, playTap])

  const cols = data.options.length <= 2 ? 'grid-cols-2' : data.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-indigo-50 to-blue-50">
      {/* Word display + speak button */}
      <motion.button
        onPointerDown={() => speak(data.word)}
        className="mt-4 bg-indigo-500 text-white px-8 py-4 rounded-full shadow-kid flex items-center gap-3"
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🔊</span>
        <span className="font-hebrew font-bold text-kid-xl" dir="rtl">{data.word}</span>
      </motion.button>

      <p className="font-hebrew text-kid-sm text-gray-500 mt-2" dir="rtl">איזו תמונה מתאימה למילה?</p>

      {/* Options */}
      <div className={`grid ${cols} gap-4 w-full max-w-sm mt-4`}>
        {options.map((emoji) => {
          const isSelected = selected === emoji
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={emoji}
              onPointerDown={() => handleSelect(emoji)}
              className={`
                min-h-[100px] rounded-3xl text-6xl shadow-kid flex items-center justify-center select-none
                ${isCorrect ? 'bg-green-300' : isWrong ? 'bg-red-200' : 'bg-white border-2 border-indigo-200'}
              `}
              whileTap={{ scale: 0.92 }}
              animate={isCorrect ? { scale: [1, 1.2, 1] } : isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
            >
              {emoji}
            </motion.button>
          )
        })}
      </div>
      <div className="h-6" />
    </div>
  )
}

export default function SightWordsGamePage() {
  return (
    <GameShell gameId="sightwords" gameName="📝 מילים ותמונות" totalLevels={10}>
      {(props) => <SightWordsLevel {...props} />}
    </GameShell>
  )
}
