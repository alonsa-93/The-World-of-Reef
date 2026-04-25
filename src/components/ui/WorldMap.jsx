import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import worldsConfig from '../../config/worlds.config.json'
import useGameStore from '../../store/useGameStore'
import { useAudio } from '../../contexts/AudioContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
}

export default function WorldMap() {
  const navigate = useNavigate()
  const { getGameStars } = useGameStore()
  const { playTap, speak } = useAudio()

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 p-4 w-full max-w-lg mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {worldsConfig.worlds.map((world) => {
        const totalStars = world.games.reduce((acc, g) => acc + getGameStars(g.id), 0)

        return (
          <motion.button
            key={world.id}
            variants={cardVariants}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => { playTap(); speak(world.nameHe); navigate(`/world/${world.id}`) }}
            className={`
              relative rounded-3xl p-5 shadow-kid text-center no-select cursor-pointer
              min-h-[140px] flex flex-col items-center justify-center gap-2
              bg-gradient-to-br ${world.bgGradient}
              border-2 border-white/60
            `}
          >
            <span className="text-5xl">{world.emoji}</span>
            <span className="font-hebrew font-bold text-kid-sm text-gray-700 leading-tight" dir="rtl">
              {world.nameHe}
            </span>
            {totalStars > 0 && (
              <span className="text-sm font-hebrew text-gray-600">⭐ × {totalStars}</span>
            )}
            <span className="text-xs font-hebrew text-gray-400" dir="rtl">
              {world.games.length} משחקים
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
