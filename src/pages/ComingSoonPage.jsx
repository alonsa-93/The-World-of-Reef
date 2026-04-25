import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'

export default function ComingSoonPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full bg-reef-bg">
      <AppHeader showBack />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
        <motion.div
          className="text-8xl"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚧
        </motion.div>
        <p className="font-hebrew font-bold text-kid-xl text-gray-700 text-center" dir="rtl">
          המשחק בדרך!
        </p>
        <p className="font-hebrew text-kid-md text-gray-500 text-center" dir="rtl">
          אנחנו עובדים על זה עבורך ריף 💕
        </p>
        <motion.button
          onClick={() => navigate(-1)}
          className="bg-reef-ocean text-white font-hebrew font-bold text-kid-lg px-8 py-4 rounded-full shadow-kid mt-4"
          whileTap={{ scale: 0.95 }}
        >
          חזרה ◀
        </motion.button>
      </div>
    </div>
  )
}
