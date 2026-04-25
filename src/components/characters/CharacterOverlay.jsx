import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../contexts/AudioContext'
import { useEffect } from 'react'

const ELSA_MESSAGES = {
  mistake: ['!בסדר ריף, בואי ננסה שוב יחד', '!לא נורא, כולם לומדים', '!יש לנו עוד ניסיון'],
  hint: ['!אני כאן לעזור לך', 'בואי נסתכל יחד...', '!נסי ככה'],
  encouragement: ['!יופי ריף', '!את עושה עבודה נהדרת', '!כמה חכמה את'],
}

const STITCH_MESSAGES = {
  success: ['!וואו!!! את מדהימה', '!יש!!! ריף הכי טובה', '!ג׳ק פוט! בום!!!'],
  celebration: ['!הידד!!! ריף ניצחה', '!YEEEAH!!! כל הכבוד', '!WOW WOW WOW!!!'],
}

export function ElsaOverlay({ type = 'encouragement', onClose, autoClose = 3000 }) {
  const { speak, playElsa } = useAudio()
  const messages = ELSA_MESSAGES[type] || ELSA_MESSAGES.encouragement
  const message = messages[Math.floor(Math.random() * messages.length)]

  useEffect(() => {
    speak(message)
    playElsa(type)
    if (autoClose) {
      const t = setTimeout(onClose, autoClose)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-end gap-3 max-w-xs"
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="bg-white rounded-3xl rounded-br-lg p-4 shadow-elsa border-2 border-elsa-secondary text-right">
        <p className="font-hebrew text-kid-md text-elsa-dark leading-relaxed" dir="rtl">
          {message}
        </p>
      </div>
      <div className="text-6xl animate-float shrink-0">🧊</div>
    </motion.div>
  )
}

export function StitchOverlay({ type = 'success', onClose, autoClose = 3000 }) {
  const { speak, playStitch } = useAudio()
  const messages = STITCH_MESSAGES[type] || STITCH_MESSAGES.success
  const message = messages[Math.floor(Math.random() * messages.length)]

  useEffect(() => {
    speak(message)
    playStitch(type)
    if (autoClose) {
      const t = setTimeout(onClose, autoClose)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 flex items-end gap-3 max-w-xs"
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="text-6xl animate-bounce shrink-0">👾</div>
      <div className="bg-white rounded-3xl rounded-bl-lg p-4 shadow-stitch border-2 border-stitch-secondary text-right">
        <p className="font-hebrew text-kid-md text-stitch-dark leading-relaxed" dir="rtl">
          {message}
        </p>
      </div>
    </motion.div>
  )
}
