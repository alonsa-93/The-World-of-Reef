import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import GameShell from '../components/games/GameShell'
import volcanoConfig from '../config/volcano.config.json'

function VolcanoLevel({ level, config, onCorrect, onWrong, attemptCount }) {
  const [heat, setHeat] = useState(0)
  const [pressure, setPressure] = useState(0)
  const [erupted, setErupted] = useState(false)
  const [isSwipingHeat, setIsSwipingHeat] = useState(false)
  const touchStartY = useRef(null)

  const heatRequired = config?.heatRequired || 80
  const pressureRequired = config?.pressureRequired || 0
  const mechanic = config?.mechanic || 'swipe-up'
  const distractors = config?.distractors || 0

  const heatPercent = Math.min(heat, 100)
  const pressurePercent = Math.min(pressure, 100)

  const isReady = heatPercent >= heatRequired && pressurePercent >= pressureRequired

  const handleEruptPress = useCallback(() => {
    if (isReady && !erupted) {
      setErupted(true)
      setTimeout(() => {
        onCorrect()
        setTimeout(() => { setHeat(0); setPressure(0); setErupted(false) }, 1500)
      }, 800)
    } else if (!isReady) {
      onWrong()
    }
  }, [isReady, erupted, onCorrect, onWrong])

  // Swipe-up to heat
  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    touchStartY.current = e.clientY
    setIsSwipingHeat(true)
  }

  const handlePointerMove = (e) => {
    if (touchStartY.current === null || !e.buttons) return
    const dy = touchStartY.current - e.clientY
    if (dy > 2) {
      setHeat((h) => Math.min(h + dy * 0.4, 100))
      touchStartY.current = e.clientY
    }
  }

  const handlePointerUp = () => {
    touchStartY.current = null
    setIsSwipingHeat(false)
  }

  // Lava color based on heat
  const lavaColor = heat < 30 ? '#888' : heat < 60 ? '#FF8C00' : heat < 90 ? '#FF4500' : '#FF0000'

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-sky-100 to-amber-50">
      {/* Sky */}
      <div className="flex-1 flex items-center justify-center w-full">
        {/* Volcano mountain */}
        <div className="relative flex flex-col items-center">
          {/* Eruption */}
          {erupted && (
            <motion.div
              className="absolute -top-20 left-1/2 -translate-x-1/2 text-6xl"
              initial={{ y: 0, opacity: 1, scale: 0.5 }}
              animate={{ y: -80, opacity: 0, scale: 1.5 }}
              transition={{ duration: 1 }}
            >
              🌋
            </motion.div>
          )}

          {/* Heat indicator cloud above */}
          <motion.div
            className="mb-2 text-4xl"
            animate={{ opacity: heat > 50 ? 1 : 0.3, scale: heat > 80 ? 1.2 : 1 }}
          >
            {heat < 30 ? '⛅' : heat < 60 ? '🌡️' : heat < 90 ? '🔥' : '💥'}
          </motion.div>

          {/* Volcano shape — swipe up here */}
          <motion.div
            className="relative cursor-pointer select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            whileTap={{ scale: 0.98 }}
            animate={{ y: heat > 80 ? [-2, 2, -2] : 0 }}
            transition={{ repeat: heat > 80 ? Infinity : 0, duration: 0.3 }}
          >
            {/* Mountain body */}
            <svg width="200" height="180" viewBox="0 0 200 180">
              <polygon
                points="100,10 20,170 180,170"
                fill={`hsl(${20 + heat * 0.5}, 70%, ${50 - heat * 0.2}%)`}
              />
              {/* Lava inside */}
              <polygon
                points={`100,${10 + (100 - heat) * 1.2} 60,170 140,170`}
                fill={lavaColor}
                opacity={heat / 100}
              />
              {/* Crater */}
              <ellipse cx="100" cy="18" rx="18" ry="8" fill="#333" />
              <ellipse cx="100" cy="18" rx="12" ry="5" fill={heat > 50 ? lavaColor : '#555'} />
            </svg>
            <p className="text-center font-hebrew text-kid-sm text-gray-500 mt-1" dir="rtl">
              {isSwipingHeat ? '🔥 מחמם...' : '☝️ החלק למעלה לחמם!'}
            </p>
          </motion.div>

          {/* Heat bar */}
          <div className="w-48 h-4 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: lavaColor }}
              animate={{ width: `${heatPercent}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
          <p className="font-hebrew text-kid-sm text-gray-600 mt-1" dir="rtl">חום: {Math.round(heatPercent)}%</p>
        </div>
      </div>

      {/* Pressure button (shown in later mechanics) */}
      {(mechanic === 'swipe-heat-pressure' || mechanic === 'timing' || mechanic === 'full') && (
        <motion.button
          className="touch-target w-24 h-24 rounded-full bg-red-500 text-white text-4xl shadow-kid-lg mb-2 flex items-center justify-center no-select"
          whileTap={{ scale: 0.9 }}
          onPointerDown={() => setPressure((p) => Math.min(p + 25, 100))}
          animate={pressure > 80 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          💨
        </motion.button>
      )}
      {(mechanic === 'swipe-heat-pressure' || mechanic === 'timing' || mechanic === 'full') && (
        <div className="w-48 h-4 bg-gray-200 rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-blue-400 rounded-full"
            animate={{ width: `${pressurePercent}%` }}
            transition={{ type: 'spring' }}
          />
        </div>
      )}

      {/* Erupt button */}
      <motion.button
        className={`
          touch-target w-full max-w-xs py-5 rounded-full font-hebrew font-bold text-kid-lg shadow-kid-lg no-select mb-2
          ${isReady ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500'}
        `}
        whileTap={{ scale: 0.95 }}
        animate={isReady ? { scale: [1, 1.04, 1] } : {}}
        transition={{ repeat: isReady ? Infinity : 0, duration: 1 }}
        onTouchStart={handleEruptPress}
        onClick={handleEruptPress}
      >
        {isReady ? '🌋 !פוצצי' : `חממי עוד... ${Math.round(heatPercent)}%`}
      </motion.button>
    </div>
  )
}

export default function VolcanoGamePage() {
  return (
    <GameShell
      gameId="volcano"
      gameName="🌋 הר הגעש"
      totalLevels={10}
      levelConfig={volcanoConfig.levels}
    >
      {(props) => <VolcanoLevel {...props} />}
    </GameShell>
  )
}
