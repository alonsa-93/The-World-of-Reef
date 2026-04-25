import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useGameStore = create(
  persist(
    (set, get) => ({
      // Progress: { [gameId]: { starsPerLevel: [0,1,2,3,...], completedLevels: [] } }
      progress: {},
      totalStars: 0,
      currentGame: null,
      currentLevel: 1,
      sessionStartTime: null,

      startGame: (gameId) => {
        set({ currentGame: gameId, currentLevel: 1, sessionStartTime: Date.now() })
      },

      setLevel: (level) => set({ currentLevel: level }),

      completeLevel: (gameId, level, stars) => {
        const { progress } = get()
        const gameProgress = progress[gameId] || { starsPerLevel: {}, completedLevels: [] }
        const existingStars = gameProgress.starsPerLevel[level] || 0
        const newStars = Math.max(existingStars, stars)
        const starDiff = newStars - existingStars

        const completedLevels = gameProgress.completedLevels.includes(level)
          ? gameProgress.completedLevels
          : [...gameProgress.completedLevels, level]

        set({
          progress: {
            ...progress,
            [gameId]: {
              starsPerLevel: { ...gameProgress.starsPerLevel, [level]: newStars },
              completedLevels,
            },
          },
          totalStars: get().totalStars + starDiff,
        })
      },

      getGameStars: (gameId) => {
        const { progress } = get()
        const gameProgress = progress[gameId]
        if (!gameProgress) return 0
        return Object.values(gameProgress.starsPerLevel).reduce((a, b) => a + b, 0)
      },

      isLevelCompleted: (gameId, level) => {
        const { progress } = get()
        return progress[gameId]?.completedLevels.includes(level) || false
      },

      exitGame: () => set({ currentGame: null, currentLevel: 1, sessionStartTime: null }),
    }),
    {
      name: 'reef-world-progress',
      partialize: (state) => ({ progress: state.progress, totalStars: state.totalStars }),
    }
  )
)

export default useGameStore
