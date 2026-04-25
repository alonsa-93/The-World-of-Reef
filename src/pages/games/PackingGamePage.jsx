import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS_DATA = [
  { weather: 'שמשי חם ☀️', instruction: 'יוצאים לחוף ים! מה לארוז?', correct: ['👙', '🕶️', '🧴'], wrong: ['🧥', '☂️', '🧤'] },
  { weather: 'גשום 🌧️', instruction: 'יורד גשם! מה לארוז?', correct: ['☂️', '🥾', '🧥'], wrong: ['👙', '🕶️', '🩴'] },
  { weather: 'קר ❄️', instruction: 'קר מאוד! מה לארוז?', correct: ['🧥', '🧤', '🧣'], wrong: ['👙', '🕶️', '🩴'] },
  { weather: 'שמשי חם ☀️', instruction: 'טיול בג׳ונגל חם! מה לארוז?', correct: ['👒', '🧴', '🩴', '💧'], wrong: ['🧥', '❄️', '🧤'] },
  { weather: 'גשום 🌧️', instruction: 'טיול בגשם! מה צריך?', correct: ['☂️', '🥾', '🧥', '🩱'], wrong: ['👙', '🕶️', '🌴'] },
  { weather: 'קר ❄️', instruction: 'סקי בשלג! מה לארוז?', correct: ['🎿', '🧥', '🧤', '🧣'], wrong: ['👙', '🩴', '🌴'] },
  { weather: 'שמשי חם ☀️', instruction: 'חוף בתאילנד! בחרי 3 פריטים נכונים!', correct: ['👙', '🕶️', '🧴'], wrong: ['🧥', '❄️', '🧤', '☂️'] },
  { weather: 'גשום 🌧️', instruction: 'ים סוער! מה צריך?', correct: ['☂️', '🧥', '🥾'], wrong: ['👙', '🩴', '🕶️', '🌴'] },
  { weather: 'קר ❄️', instruction: 'הר גבוה! ארזי נכון!', correct: ['🧥', '🧤', '🧣', '🎿'], wrong: ['👙', '🩴', '🕶️', '🌴'] },
  { weather: 'שמשי חם ☀️', instruction: 'מה לא שוכחים לחוף ים?', correct: ['👙', '🕶️', '🧴', '💧', '🩴'], wrong: ['🧥', '❄️', '🧤', '☂️'] },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function PackingLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS_DATA[level - 1]
  const [allItems] = useState(() => shuffle([...data.correct, ...data.wrong]))
  const [packed, setPacked] = useState([])
  const [feedback, setFeedback] = useState({})

  useEffect(() => {
    setPacked([])
    setFeedback({})
    setTimeout(() => speak(`${data.instruction} ${data.weather}`), 500)
  }, [level])

  const handleItem = useCallback((item) => {
    if (packed.includes(item)) return
    playTap()
    const isCorrect = data.correct.includes(item)
    const newPacked = [...packed, item]
    setPacked(newPacked)
    setFeedback((prev) => ({ ...prev, [item]: isCorrect ? 'correct' : 'wrong' }))

    if (!isCorrect) {
      speak('לא צריך את זה!')
      onWrong()
      return
    }
    speak('!')
    if (data.correct.every((c) => newPacked.includes(c))) {
      speak('מזוודה ארוזה! כל הכבוד!')
      setTimeout(onCorrect, 800)
    }
  }, [packed, data, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-blue-50 to-cyan-50">
      <motion.button
        onPointerDown={() => speak(`${data.instruction} ${data.weather}`)}
        className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-kid flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <span>🔊</span>
        <span className="font-hebrew font-bold text-kid-md" dir="rtl">{data.weather}</span>
      </motion.button>

      <p className="font-hebrew text-kid-md text-gray-700 text-center mt-2" dir="rtl">{data.instruction}</p>

      {/* Suitcase */}
      <div className="relative w-48 h-32 bg-amber-200 rounded-2xl border-4 border-amber-400 flex flex-wrap gap-1 p-3 items-center justify-center">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🧳</span>
        {packed.filter((i) => data.correct.includes(i)).map((item, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl"
          >
            {item}
          </motion.span>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-3 justify-center max-w-xs">
        {allItems.map((item) => {
          const isPacked = packed.includes(item)
          const fb = feedback[item]
          return (
            <motion.button
              key={item}
              onPointerDown={() => !isPacked && handleItem(item)}
              className={`
                w-16 h-16 rounded-2xl text-4xl flex items-center justify-center shadow-kid select-none
                ${isPacked && fb === 'correct' ? 'bg-green-200 opacity-50' : ''}
                ${isPacked && fb === 'wrong' ? 'bg-red-200 opacity-50' : ''}
                ${!isPacked ? 'bg-white border-2 border-gray-200 cursor-pointer' : ''}
              `}
              whileTap={!isPacked ? { scale: 0.9 } : {}}
              animate={fb === 'wrong' && isPacked ? { x: [-5, 5, -5, 5, 0] } : {}}
            >
              {item}
            </motion.button>
          )
        })}
      </div>

      <div className="font-hebrew text-kid-sm text-gray-500 mt-2" dir="rtl">
        {packed.filter((i) => data.correct.includes(i)).length} / {data.correct.length} פריטים נכונים
      </div>
      <div className="h-4" />
    </div>
  )
}

export default function PackingGamePage() {
  return (
    <GameShell gameId="packing" gameName="🧳 מה לארוז?" totalLevels={10}>
      {(props) => <PackingLevel {...props} />}
    </GameShell>
  )
}
