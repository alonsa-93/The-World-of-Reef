import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/games/GameShell'
import { useAudio } from '../../contexts/AudioContext'

const LEVELS_DATA = [
  {
    categories: [{ id: 'sea', label: 'ים 🌊', color: 'bg-blue-200' }, { id: 'land', label: 'יבשה 🌍', color: 'bg-green-200' }],
    items: [
      { id: 'fish', emoji: '🐟', category: 'sea' }, { id: 'dog', emoji: '🐕', category: 'land' },
      { id: 'shark', emoji: '🦈', category: 'sea' }, { id: 'lion', emoji: '🦁', category: 'land' },
    ]
  },
  {
    categories: [{ id: 'sea', label: 'ים 🌊', color: 'bg-blue-200' }, { id: 'land', label: 'יבשה 🌍', color: 'bg-green-200' }],
    items: [
      { id: 'crab', emoji: '🦀', category: 'sea' }, { id: 'cat', emoji: '🐈', category: 'land' },
      { id: 'dolphin', emoji: '🐬', category: 'sea' }, { id: 'horse', emoji: '🐴', category: 'land' },
      { id: 'octopus', emoji: '🐙', category: 'sea' },
    ]
  },
  {
    categories: [{ id: 'fruit', label: 'פרות 🍎', color: 'bg-red-200' }, { id: 'veggie', label: 'ירקות 🥦', color: 'bg-green-200' }],
    items: [
      { id: 'apple', emoji: '🍎', category: 'fruit' }, { id: 'broccoli', emoji: '🥦', category: 'veggie' },
      { id: 'banana', emoji: '🍌', category: 'fruit' }, { id: 'carrot', emoji: '🥕', category: 'veggie' },
    ]
  },
  {
    categories: [{ id: 'fruit', label: 'פרות 🍎', color: 'bg-red-200' }, { id: 'veggie', label: 'ירקות 🥦', color: 'bg-green-200' }],
    items: [
      { id: 'grape', emoji: '🍇', category: 'fruit' }, { id: 'corn', emoji: '🌽', category: 'veggie' },
      { id: 'watermelon', emoji: '🍉', category: 'fruit' }, { id: 'tomato', emoji: '🍅', category: 'veggie' },
      { id: 'strawberry', emoji: '🍓', category: 'fruit' },
    ]
  },
  {
    categories: [{ id: 'hot', label: 'חם ☀️', color: 'bg-orange-200' }, { id: 'cold', label: 'קר ❄️', color: 'bg-blue-200' }],
    items: [
      { id: 'sun', emoji: '☀️', category: 'hot' }, { id: 'snow', emoji: '❄️', category: 'cold' },
      { id: 'fire', emoji: '🔥', category: 'hot' }, { id: 'ice', emoji: '🧊', category: 'cold' },
    ]
  },
  {
    categories: [{ id: 'hot', label: 'חם ☀️', color: 'bg-orange-200' }, { id: 'cold', label: 'קר ❄️', color: 'bg-blue-200' }, { id: 'wet', label: 'רטוב 💧', color: 'bg-teal-200' }],
    items: [
      { id: 'sun2', emoji: '☀️', category: 'hot' }, { id: 'snow2', emoji: '❄️', category: 'cold' },
      { id: 'rain', emoji: '🌧️', category: 'wet' }, { id: 'fire2', emoji: '🔥', category: 'hot' },
      { id: 'puddle', emoji: '💧', category: 'wet' },
    ]
  },
  {
    categories: [{ id: 'fly', label: 'מעופף ✈️', color: 'bg-sky-200' }, { id: 'swim', label: 'שוחה 🌊', color: 'bg-blue-200' }, { id: 'run', label: 'רץ 🏃', color: 'bg-green-200' }],
    items: [
      { id: 'bird', emoji: '🐦', category: 'fly' }, { id: 'fish2', emoji: '🐟', category: 'swim' },
      { id: 'dog2', emoji: '🐕', category: 'run' }, { id: 'butterfly2', emoji: '🦋', category: 'fly' },
      { id: 'whale', emoji: '🐋', category: 'swim' },
    ]
  },
  {
    categories: [{ id: 'fly', label: 'מעופף ✈️', color: 'bg-sky-200' }, { id: 'swim', label: 'שוחה 🌊', color: 'bg-blue-200' }, { id: 'run', label: 'רץ 🏃', color: 'bg-green-200' }],
    items: [
      { id: 'plane', emoji: '✈️', category: 'fly' }, { id: 'shark2', emoji: '🦈', category: 'swim' },
      { id: 'horse2', emoji: '🐴', category: 'run' }, { id: 'bee', emoji: '🐝', category: 'fly' },
      { id: 'turtle', emoji: '🐢', category: 'swim' }, { id: 'rabbit', emoji: '🐰', category: 'run' },
    ]
  },
  {
    categories: [{ id: 'big', label: 'גדול 🐘', color: 'bg-purple-200' }, { id: 'small', label: 'קטן 🐭', color: 'bg-pink-200' }],
    items: [
      { id: 'elephant', emoji: '🐘', category: 'big' }, { id: 'mouse', emoji: '🐭', category: 'small' },
      { id: 'whale2', emoji: '🐋', category: 'big' }, { id: 'ant', emoji: '🐜', category: 'small' },
      { id: 'dinosaur', emoji: '🦕', category: 'big' }, { id: 'bee2', emoji: '🐝', category: 'small' },
    ]
  },
  {
    categories: [{ id: 'day', label: 'יום ☀️', color: 'bg-yellow-200' }, { id: 'night', label: 'לילה 🌙', color: 'bg-indigo-200' }],
    items: [
      { id: 'sun3', emoji: '☀️', category: 'day' }, { id: 'moon', emoji: '🌙', category: 'night' },
      { id: 'rooster', emoji: '🐓', category: 'day' }, { id: 'owl', emoji: '🦉', category: 'night' },
      { id: 'flower2', emoji: '🌸', category: 'day' }, { id: 'star2', emoji: '⭐', category: 'night' },
    ]
  },
]

function SortingLevel({ level, config, onCorrect, onWrong }) {
  const { speak, playTap } = useAudio()
  const data = LEVELS_DATA[Math.min(level - 1, LEVELS_DATA.length - 1)]
  const [sorted, setSorted] = useState({}) // itemId -> categoryId
  const [wrong, setWrong] = useState(null)
  const [selected, setSelected] = useState(null)

  const remaining = data.items.filter((item) => !sorted[item.id])

  useEffect(() => {
    setSorted({})
    setWrong(null)
    setSelected(null)
    const cats = data.categories.map((c) => c.label).join(' ו')
    setTimeout(() => speak(`עזרי לסטיץ׳ למיין! ${cats}`), 500)
  }, [level])

  useEffect(() => {
    if (remaining.length === 0 && data.items.length > 0) {
      speak('כל הכבוד! הכל ממוין!')
      setTimeout(onCorrect, 800)
    }
  }, [remaining.length])

  const handleDrop = useCallback((itemId, categoryId) => {
    const item = data.items.find((i) => i.id === itemId)
    if (!item) return
    if (item.category === categoryId) {
      playTap()
      setSorted((prev) => ({ ...prev, [itemId]: categoryId }))
      speak('כן!')
    } else {
      setWrong(itemId)
      speak('לא נכון!')
      setTimeout(() => setWrong(null), 800)
      onWrong()
    }
  }, [data, onWrong, playTap, speak])

  const handleItemTap = useCallback((itemId) => {
    if (sorted[itemId]) return
    playTap()
    setSelected(itemId)
  }, [sorted, playTap])

  const handleCategoryTap = useCallback((categoryId) => {
    if (!selected) return
    handleDrop(selected, categoryId)
    setSelected(null)
  }, [selected, handleDrop])

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="flex items-center gap-2 mt-2">
        <span className="text-4xl">👾</span>
        <p className="font-hebrew text-kid-md text-gray-700" dir="rtl">
          {selected ? 'עכשיו לחצי על הקופסה הנכונה!' : 'לחצי על פריט, אחר כך על הקופסה!'}
        </p>
      </div>

      {/* Category bins */}
      <div className="flex gap-3 w-full max-w-sm">
        {data.categories.map((cat) => {
          const itemsInCat = data.items.filter((i) => sorted[i.id] === cat.id)
          return (
            <motion.button
              key={cat.id}
              onPointerDown={() => handleCategoryTap(cat.id)}
              className={`flex-1 min-h-[100px] rounded-3xl ${cat.color} border-2 border-white shadow-kid p-2 flex flex-col items-center gap-1 select-none cursor-pointer`}
              animate={selected ? { scale: [1, 1.04, 1] } : {}}
              transition={{ repeat: selected ? Infinity : 0, duration: 0.8 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-hebrew font-bold text-kid-sm" dir="rtl">{cat.label}</span>
              <div className="flex flex-wrap gap-1 justify-center">
                {itemsInCat.map((item) => (
                  <span key={item.id} className="text-2xl">{item.emoji}</span>
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Remaining items */}
      <div className="flex flex-wrap gap-3 justify-center max-w-sm">
        {remaining.map((item) => (
          <motion.button
            key={item.id}
            onPointerDown={() => handleItemTap(item.id)}
            className={`
              w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shadow-kid select-none
              ${selected === item.id ? 'bg-yellow-300 scale-110 border-2 border-yellow-500' : 'bg-white border-2 border-gray-200'}
              ${wrong === item.id ? 'bg-red-200' : ''}
            `}
            whileTap={{ scale: 0.9 }}
            animate={wrong === item.id ? { x: [-5, 5, -5, 5, 0] } : {}}
          >
            {item.emoji}
          </motion.button>
        ))}
      </div>

      {remaining.length === 0 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">🎉</motion.div>
      )}
      <div className="h-4" />
    </div>
  )
}

export default function SortingGamePage() {
  return (
    <GameShell gameId="sorting" gameName="🗂️ הבלגן של סטיץ׳" totalLevels={10}>
      {(props) => <SortingLevel {...props} />}
    </GameShell>
  )
}
