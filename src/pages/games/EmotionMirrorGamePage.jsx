import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const SITUATIONS = [
  { scene: '🎂🥳', descHe: 'יש מסיבת יום הולדת!', emotion: '😄', options: ['😄', '😢', '😠'] },
  { scene: '🌧️😿', descHe: 'הצעצוע של ילד נשבר', emotion: '😢', options: ['😄', '😢', '😮'] },
  { scene: '🙀😱', descHe: 'ילד ראה עכביש!', emotion: '😨', options: ['😨', '😄', '😢'] },
  { scene: '😠👊', descHe: 'חבר לקח את הצעצוע', emotion: '😠', options: ['😄', '😠', '😢'] },
  { scene: '🤗💕', descHe: 'אמא נתנה חיבוק גדול', emotion: '🥰', options: ['🥰', '😢', '😠'] },
  { scene: '🎁🎉', descHe: 'קיבלת מתנה מפתיעה!', emotion: '😮', options: ['😮', '😠', '😴'] },
  { scene: '😴🌙', descHe: 'ריף מאוד עייפה', emotion: '😴', options: ['😴', '😄', '😨'] },
  { scene: '🏆⭐', descHe: 'ניצחתי במשחק!', emotion: '😄', options: ['😄', '😢', '😠'] },
  { scene: '💔😓', descHe: 'החבר הלך הביתה', emotion: '😢', options: ['😢', '😄', '😮'] },
  { scene: '🤒🌡️', descHe: 'הבטן כואבת', emotion: '😣', options: ['😣', '😄', '😮'] },
]

function EmotionMirrorLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = SITUATIONS[level - 1]
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    setSelected(null)
    setFeedback(null)
    setTimeout(() => speak(`${data.descHe} — מה מרגישים?`), 400)
  }, [level])

  const handleSelect = useCallback((emotion) => {
    if (feedback) return
    playTap()
    setSelected(emotion)
    if (emotion === data.emotion) {
      setFeedback('correct')
      speak('נכון! כל הכבוד ריף!')
      setTimeout(onCorrect, 800)
    } else {
      setFeedback('wrong')
      speak('לא בדיוק... נסי שוב!')
      setTimeout(() => { setFeedback(null); setSelected(null); onWrong() }, 900)
    }
  }, [data, feedback, onCorrect, onWrong, speak, playTap])

  return (
    <div className="flex flex-col items-center justify-between h-full p-6 bg-gradient-to-b from-pink-50 to-rose-50">
      {/* Situation */}
      <motion.button
        onPointerDown={() => speak(`${data.descHe} — מה מרגישים?`)}
        className="mt-4 bg-rose-400 text-white px-6 py-3 rounded-full shadow-kid flex items-center gap-2"
        whileTap={{ scale: 0.95 }}
      >
        <span>🔊</span>
        <span className="font-hebrew font-bold text-kid-md" dir="rtl">שמעי את הסיטואציה</span>
      </motion.button>

      <motion.div
        key={level}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3 my-4"
      >
        <span className="text-[80px]">{data.scene}</span>
        <p className="font-hebrew font-bold text-kid-lg text-gray-800 text-center" dir="rtl">{data.descHe}</p>
        <p className="font-hebrew text-kid-md text-gray-500" dir="rtl">מה הם מרגישים?</p>
      </motion.div>

      {/* Emotion options */}
      <div className="flex gap-4 justify-center">
        {data.options.map((emotion) => {
          const isSelected = selected === emotion
          const isCorrect = isSelected && feedback === 'correct'
          const isWrong = isSelected && feedback === 'wrong'
          return (
            <motion.button
              key={emotion}
              onPointerDown={() => handleSelect(emotion)}
              className={`
                w-24 h-24 rounded-3xl text-6xl flex items-center justify-center shadow-kid select-none
                ${isCorrect ? 'bg-green-200' : isWrong ? 'bg-red-200' : 'bg-white border-2 border-pink-200'}
              `}
              whileTap={{ scale: 0.9 }}
              animate={isCorrect ? { scale: [1, 1.2, 1] } : isWrong ? { x: [-5, 5, 0] } : {}}
            >
              {emotion}
            </motion.button>
          )
        })}
      </div>
      <div className="h-6" />
    </div>
  )
}

export default function EmotionMirrorGamePage() {
  return (
    <GameShell gameId="emotionmirror" gameName="😊 מראת הרגשות" totalLevels={10}>
      {(props) => <EmotionMirrorLevel {...props} />}
    </GameShell>
  )
}
