import { motion } from 'framer-motion'
import { useEffect } from 'react'
import WorldMap from '../components/ui/WorldMap'
import AppHeader from '../components/layout/AppHeader'
import { useAudio } from '../contexts/AudioContext'
import { analytics } from '../services/analytics'

export default function HomePage() {
  const { speak } = useAudio()

  useEffect(() => {
    analytics.sessionStarted()
    setTimeout(() => speak('!שלום ריף! לאן נלך היום'), 800)
  }, [])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-reef-sky to-reef-bg overflow-hidden">
      <AppHeader showStars />

      {/* Greeting */}
      <motion.div
        className="text-center pt-4 pb-2 px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <motion.div
          className="text-6xl mb-2"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          🌊
        </motion.div>
        <h1 className="font-hebrew font-bold text-kid-2xl text-gray-800" dir="rtl">
          עולם של ריף
        </h1>
        <p className="font-hebrew text-kid-sm text-gray-500 mt-1" dir="rtl">
          בחרי עולם לחקור!
        </p>
      </motion.div>

      {/* World map grid */}
      <div className="flex-1 overflow-y-auto pb-4">
        <WorldMap />
      </div>

      {/* Characters floating */}
      <div className="flex justify-between px-6 pb-4 pointer-events-none">
        <motion.div
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          👾
        </motion.div>
        <motion.div
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🧊
        </motion.div>
      </div>
    </div>
  )
}
