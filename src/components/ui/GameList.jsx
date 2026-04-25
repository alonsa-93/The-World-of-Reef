import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../../contexts/AudioContext'
import useGameStore from '../../store/useGameStore'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
}

export default function GameList({ world }) {
  const navigate = useNavigate()
  const { playTap, speak } = useAudio()
  const { getGameStars } = useGameStore()

  return (
    <motion.div
      className="flex flex-col gap-3 p-4 w-full max-w-lg mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {world.games.map((game) => {
        const stars = getGameStars(game.id)
        return (
          <motion.button
            key={game.id}
            variants={itemVariants}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => { playTap(); speak(game.nameHe); navigate(`/game/${game.id}`) }}
            className={`
              relative flex items-center gap-4 rounded-3xl p-4 shadow-kid no-select cursor-pointer
              bg-white/80 backdrop-blur border-2 border-white text-right
              ${game.recommended ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
            `}
          >
            {game.recommended && (
              <div className="absolute -top-3 right-4 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full font-hebrew">
                מומלץ! ⭐
              </div>
            )}
            <span className="text-4xl shrink-0">{game.emoji}</span>
            <div className="flex-1 min-w-0 text-right">
              <p className="font-hebrew font-bold text-kid-md text-gray-800" dir="rtl">{game.nameHe}</p>
              <p className="font-hebrew text-kid-sm text-gray-500 truncate" dir="rtl">{game.description}</p>
              {stars > 0 && (
                <span className="text-sm font-hebrew text-yellow-600">⭐ × {stars}</span>
              )}
            </div>
            <span className="text-xl text-gray-400">◀</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
