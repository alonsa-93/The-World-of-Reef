import { motion, AnimatePresence } from 'framer-motion'

const STAR_COLORS = ['#FFD700', '#FFA500', '#FF6B6B']

export default function StarDisplay({ stars = 0, maxStars = 3, size = 'md', animate = false }) {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl' }

  return (
    <div className="flex gap-1 items-center justify-center">
      {Array.from({ length: maxStars }).map((_, i) => (
        <AnimatePresence key={i}>
          {animate && i < stars ? (
            <motion.span
              className={sizes[size]}
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 400, damping: 15 }}
            >
              ⭐
            </motion.span>
          ) : (
            <span className={`${sizes[size]} ${i < stars ? '' : 'opacity-30 grayscale'}`}>
              ⭐
            </span>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}
