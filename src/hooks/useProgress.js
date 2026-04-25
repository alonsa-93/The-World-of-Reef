import useGameStore from '../store/useGameStore'

export function useProgress(gameId) {
  const { progress, completeLevel, getGameStars, isLevelCompleted } = useGameStore()

  const gameProgress = progress[gameId] || { starsPerLevel: {}, completedLevels: [] }

  const calculateStars = (hasNoMistakes, isFast) => {
    let stars = 1 // completion
    if (hasNoMistakes) stars += 1
    if (isFast) stars += 1
    return stars
  }

  return {
    gameProgress,
    totalGameStars: getGameStars(gameId),
    completeLevel: (level, hasNoMistakes, isFast) =>
      completeLevel(gameId, level, calculateStars(hasNoMistakes, isFast)),
    isLevelCompleted: (level) => isLevelCompleted(gameId, level),
    getLevelStars: (level) => gameProgress.starsPerLevel[level] || 0,
  }
}
