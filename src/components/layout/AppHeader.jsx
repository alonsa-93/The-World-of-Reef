import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MuteButton from '../ui/MuteButton'
import useGameStore from '../../store/useGameStore'

export default function AppHeader({ title, showBack = false, showStars = true }) {
  const navigate = useNavigate()
  const { totalStars } = useGameStore()

  return (
    <motion.header
      className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm border-b border-white/40"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-2">
        <MuteButton />
        {showBack && (
          <motion.button
            onClick={() => navigate(-1)}
            className="touch-target w-14 h-14 rounded-full bg-white/80 shadow-kid flex items-center justify-center text-2xl no-select"
            whileTap={{ scale: 0.9 }}
          >
            ➡️
          </motion.button>
        )}
      </div>

      {title && (
        <h1 className="font-hebrew font-bold text-kid-lg text-gray-700 flex-1 text-center" dir="rtl">
          {title}
        </h1>
      )}

      {showStars && (
        <motion.div
          className="flex items-center gap-1 bg-reef-yellow rounded-full px-4 py-2 shadow-kid"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl">⭐</span>
          <span className="font-hebrew font-bold text-kid-md text-gray-700">{totalStars}</span>
        </motion.div>
      )}
    </motion.header>
  )
}
