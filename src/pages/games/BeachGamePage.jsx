import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS = [
  { target: '🐘', count: 2, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠'], instruction: 'מצאי 2 פילים!' },
  { target: '🐒', count: 2, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠'], instruction: 'מצאי 2 קופים!' },
  { target: '🐘', count: 3, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺'], instruction: 'מצאי 3 פילים!' },
  { target: '🐒', count: 3, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺'], instruction: 'מצאי 3 קופים!' },
  { target: '🦜', count: 3, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝'], instruction: 'מצאי 3 תוכים!' },
  { target: '🐘', count: 4, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝'], instruction: 'מצאי 4 פילים!' },
  { target: '🐒', count: 4, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝', '🐡', '🦞'], instruction: 'מצאי 4 קופים!' },
  { target: '🦜', count: 4, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝', '🐡', '🦞'], instruction: 'מצאי 4 תוכים!' },
  { target: '🐘', count: 5, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝', '🐡', '🦞'], instruction: '5 פילים מסתתרים!' },
  { target: '🐒', count: 5, decoyEmojis: ['🌴', '🌊', '🐚', '🌿', '🦀', '🐠', '🐟', '🌺', '🦋', '🐝', '🐡', '🦞', '🦈', '🐋'], instruction: '5 קופים מהירות!' },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function BeachLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS[level - 1]

  const [grid] = useState(() => {
    const targets = Array.from({ length: data.count }, (_, i) => ({
      id: `target-${i}`, emoji: data.target, isTarget: true,
    }))
    const decoys = data.decoyEmojis.map((e, i) => ({
      id: `decoy-${i}`, emoji: e, isTarget: false,
    }))
    return shuffle([...targets, ...decoys])
  })

  const [found, setFound] = useState([])
  const [shaking, setShaking] = useState(null)

  useEffect(() => {
    setFound([])
    setShaking(null)
    setTimeout(() => speak(data.instruction), 500)
  }, [level])

  const handleTap = useCallback((item) => {
    if (found.includes(item.id)) return
    playTap()
    if (item.isTarget) {
      const newFound = [...found, item.id]
      setFound(newFound)
      speak('מצאת!')
      if (newFound.length === data.count) {
        speak(`כל הכבוד! מצאת את כל ה${data.count}!`)
        setTimeout(onCorrect, 800)
      }
    } else {
      setShaking(item.id)
      setTimeout(() => setShaking(null), 500)
      onWrong()
    }
  }, [found, data, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-300 to-blue-500">
      {/* Header */}
      <motion.button
        onPointerDown={() => speak(data.instruction)}
        className="m-4 bg-white/80 backdrop-blur text-blue-800 px-5 py-3 rounded-full shadow-kid flex items-center gap-2 self-center"
        whileTap={{ scale: 0.95 }}
      >
        <span>🔍</span>
        <span className="font-hebrew font-bold text-kid-md" dir="rtl">{data.instruction}</span>
        <span className="bg-blue-600 text-white text-kid-sm px-2 py-0.5 rounded-full font-hebrew">
          {found.length}/{data.count}
        </span>
      </motion.button>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-4 gap-2 p-3 content-start overflow-y-auto">
        {grid.map((item) => {
          const isFound = found.includes(item.id)
          const isShaking = shaking === item.id
          return (
            <motion.button
              key={item.id}
              onPointerDown={() => !isFound && handleTap(item)}
              className={`
                aspect-square rounded-2xl text-3xl flex items-center justify-center select-none cursor-pointer
                ${isFound ? 'bg-green-400/60 ring-2 ring-green-300' : 'bg-white/20 active:bg-white/40'}
              `}
              animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={isShaking ? { duration: 0.4 } : {}}
              whileTap={!isFound ? { scale: 0.85 } : {}}
            >
              {isFound ? '✅' : item.emoji}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function BeachGamePage() {
  return (
    <GameShell gameId="beach" gameName="🏖️ החוף הקסום" totalLevels={10}>
      {(props) => <BeachLevel {...props} />}
    </GameShell>
  )
}
