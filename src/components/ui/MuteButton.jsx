import { motion } from 'framer-motion'
import { useAudio } from '../../contexts/AudioContext'

export default function MuteButton() {
  const { isMuted, toggleMute } = useAudio()
  return (
    <motion.button
      onClick={toggleMute}
      className="touch-target w-14 h-14 rounded-full bg-white/80 backdrop-blur shadow-kid flex items-center justify-center text-2xl no-select"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isMuted ? 'הפעל צליל' : 'השתק'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  )
}
