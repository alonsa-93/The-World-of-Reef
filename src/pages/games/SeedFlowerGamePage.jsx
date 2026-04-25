import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const STAGES = [
  { id: 'seed', emoji: '🌰', nameHe: 'זרע' },
  { id: 'water', emoji: '💧', nameHe: 'מים' },
  { id: 'sun', emoji: '☀️', nameHe: 'שמש' },
  { id: 'flower', emoji: '🌸', nameHe: 'פרח!' },
]

// Per level: how many stages shown, plus distractor emojis
const LEVEL_CONFIG = [
  { stages: 2, distractors: [] },
  { stages: 2, distractors: [] },
  { stages: 3, distractors: [] },
  { stages: 3, distractors: ['🪨'] },
  { stages: 4, distractors: [] },
  { stages: 4, distractors: ['🪨'] },
  { stages: 4, distractors: ['🪨', '❄️'] },
  { stages: 4, distractors: ['🪨', '❄️'] },
  { stages: 4, distractors: ['🌧️', '❄️'] },
  { stages: 4, distractors: ['🌧️', '❄️', '🪨'] },
]

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function SeedFlowerLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const lc = LEVEL_CONFIG[level - 1]
  const activeStages = STAGES.slice(0, lc.stages)

  // Build available cards: correct stages + distractors
  const distractorCards = lc.distractors.map((d, i) => ({ id: `distract${i}`, emoji: d, nameHe: '?', isDistractor: true }))
  const allCards = shuffle([...activeStages.map(s => ({ ...s, isDistractor: false })), ...distractorCards])

  const [completed, setCompleted] = useState([]) // stage ids completed in order
  const [celebration, setCelebration] = useState(false)
  const [cards] = useState(allCards)

  useEffect(() => {
    setCompleted([])
    setCelebration(false)
    const stageNames = activeStages.map(s => s.nameHe).join(', ')
    setTimeout(() => speak(`עזרי לזרע לגדול! ${stageNames}`), 500)
  }, [level])

  const nextStageId = activeStages[completed.length]?.id

  const handleCard = useCallback((card) => {
    if (card.isDistractor) {
      speak('זה לא עוזר לפרח!')
      onWrong()
      return
    }
    if (card.id !== nextStageId) {
      speak('לא נכון! בסדר הנכון!')
      onWrong()
      return
    }
    playTap()
    speak(card.nameHe)
    const newCompleted = [...completed, card.id]
    setCompleted(newCompleted)

    if (newCompleted.length === activeStages.length) {
      setCelebration(true)
      speak('הפרח פרח! מדהים!')
      setTimeout(onCorrect, 1500)
    }
  }, [completed, nextStageId, activeStages, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-green-50 to-emerald-50">
      {/* Progress visualization */}
      <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
        {activeStages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-1">
            <motion.div
              className={`text-4xl p-2 rounded-2xl ${completed.includes(stage.id) ? 'bg-green-200' : 'bg-gray-100 opacity-40'}`}
              animate={completed.includes(stage.id) ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {stage.emoji}
            </motion.div>
            {i < activeStages.length - 1 && <span className="text-gray-400 text-xl">→</span>}
          </div>
        ))}
      </div>

      {/* Celebration flower */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-[120px] text-center"
          >
            🌸
          </motion.div>
        )}
      </AnimatePresence>

      {!celebration && (
        <>
          <p className="font-hebrew text-kid-md text-gray-600 text-center" dir="rtl">
            {nextStageId ? `תורה של ${activeStages.find(s => s.id === nextStageId)?.nameHe}!` : ''}
          </p>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            {cards.map((card) => {
              const isDone = completed.includes(card.id)
              return (
                <motion.button
                  key={card.id}
                  onPointerDown={() => !isDone && handleCard(card)}
                  className={`
                    min-h-[90px] rounded-3xl shadow-kid flex flex-col items-center justify-center gap-1 p-3 select-none
                    ${isDone ? 'bg-green-200 opacity-50' : 'bg-white border-2 border-green-200 cursor-pointer'}
                  `}
                  whileTap={!isDone ? { scale: 0.92 } : {}}
                  animate={isDone ? { opacity: 0.4 } : {}}
                >
                  <span className="text-5xl">{card.emoji}</span>
                  <span className="font-hebrew text-kid-sm text-gray-600" dir="rtl">{card.nameHe}</span>
                </motion.button>
              )
            })}
          </div>
        </>
      )}
      <div className="h-4" />
    </div>
  )
}

export default function SeedFlowerGamePage() {
  return (
    <GameShell gameId="seedflower" gameName="🌱 מהזרע לפרח" totalLevels={10}>
      {(props) => <SeedFlowerLevel {...props} />}
    </GameShell>
  )
}
