import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import worldsConfig from '../config/worlds.config.json'
import GameList from '../components/ui/GameList'
import AppHeader from '../components/layout/AppHeader'
import { useEffect } from 'react'
import { useAudio } from '../contexts/AudioContext'

export default function WorldPage() {
  const { worldId } = useParams()
  const { speak } = useAudio()
  const world = worldsConfig.worlds.find((w) => w.id === worldId)

  useEffect(() => {
    if (world) speak(`ברוכה הבאה ל${world.nameHe}`)
  }, [world])

  if (!world) return null

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b ${world.bgGradient} to-reef-bg overflow-hidden`}>
      <AppHeader title={world.nameHe} showBack />

      <motion.div
        className="text-center pt-6 pb-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <span className="text-7xl">{world.emoji}</span>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <GameList world={world} />
      </div>
    </div>
  )
}
