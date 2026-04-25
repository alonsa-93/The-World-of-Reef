import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

function MeltIceLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const [melt, setMelt] = useState(0) // 0-100
  const [sunPos, setSunPos] = useState({ x: 20, y: 30 })
  const [done, setDone] = useState(false)
  const containerRef = useRef(null)
  const dragging = useRef(false)
  const requiredMelt = 60 + level * 3 // higher levels need more melting

  useEffect(() => {
    setMelt(0)
    setDone(false)
    setSunPos({ x: 20, y: 30 })
    setTimeout(() => speak('גרגרי את השמש מעל הקרח להמיס אותו!'), 500)
  }, [level])

  const handlePointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current || done) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSunPos({ x: Math.max(5, Math.min(85, x)), y: Math.max(5, Math.min(60, y)) })

    // Check proximity to ice (centered at 50%, 65%)
    const dx = x - 50
    const dy = y - 65
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 25) {
      setMelt((m) => {
        const newMelt = Math.min(m + 1.5, 100)
        if (newMelt >= requiredMelt && !done) {
          setDone(true)
          speak('הקרח נמס! מים!')
          setTimeout(onCorrect, 1000)
        }
        return newMelt
      })
    }
  }, [done, requiredMelt, onCorrect, speak])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    if (!done && melt < 20) {
      speak('הזזי את השמש קרוב יותר לקרח!')
      onWrong()
    }
  }, [done, melt, onWrong, speak])

  const iceScale = Math.max(0.1, 1 - melt / 120)
  const waterHeight = melt / 2

  return (
    <div className="flex flex-col items-center justify-between h-full bg-gradient-to-b from-sky-100 to-blue-50">
      <p className="font-hebrew text-kid-md text-blue-800 text-center mt-6 px-4" dir="rtl">
        גרגרי את השמש על הקרח!
      </p>

      {/* Scene */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 max-w-sm cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Sun (draggable) */}
        <motion.div
          className="absolute text-6xl select-none"
          style={{ left: `${sunPos.x}%`, top: `${sunPos.y}%`, transform: 'translate(-50%,-50%)' }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          ☀️
        </motion.div>

        {/* Ice cube */}
        <div className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <motion.div
            className="text-[80px] select-none"
            style={{ scale: iceScale, opacity: iceScale }}
            animate={done ? { scale: 0, opacity: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            🧊
          </motion.div>
          {/* Water puddle */}
          <motion.div
            className="bg-blue-300/60 rounded-full"
            style={{ width: `${waterHeight * 2}px`, height: `${waterHeight / 2}px` }}
          />
        </div>
      </div>

      {/* Melt progress */}
      <div className="w-full max-w-sm px-6 pb-4">
        <div className="flex justify-between font-hebrew text-kid-sm text-gray-600 mb-1">
          <span dir="rtl">קרח 🧊</span>
          <span dir="rtl">מים 💧</span>
        </div>
        <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${melt}%` }}
            transition={{ type: 'spring' }}
          />
        </div>
        <p className="font-hebrew text-center text-kid-sm text-gray-500 mt-1" dir="rtl">
          {Math.round(melt)}% נמס
        </p>
      </div>
    </div>
  )
}

export default function MeltIceGamePage() {
  return (
    <GameShell gameId="meltice" gameName="🧊 הקרח נמס" totalLevels={10}>
      {(props) => <MeltIceLevel {...props} />}
    </GameShell>
  )
}
