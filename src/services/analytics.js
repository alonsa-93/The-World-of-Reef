// Analytics service — tracks core learning events
// Structured for easy swap to GA4 / PostHog

const ENABLED = import.meta.env.PROD

function track(event, params = {}) {
  const payload = {
    event,
    timestamp: Date.now(),
    ...params,
  }

  if (ENABLED && window.gtag) {
    window.gtag('event', event, params)
  }

  // Always log in dev
  if (import.meta.env.DEV) {
    console.log('[Analytics]', payload)
  }
}

export const analytics = {
  gameStarted: (gameId, level) => track('game_started', { game_id: gameId, level }),
  gameCompleted: (gameId, level, stars, durationMs) =>
    track('game_completed', { game_id: gameId, level, stars, duration_ms: durationMs }),
  wrongAttempt: (gameId, level, attemptCount) =>
    track('wrong_attempt', { game_id: gameId, level, attempt_count: attemptCount }),
  hintShown: (gameId, level, hintType) =>
    track('hint_shown', { game_id: gameId, level, hint_type: hintType }),
  sessionStarted: () => track('session_started'),
  sessionEnded: (durationMs) => track('session_ended', { duration_ms: durationMs }),
}
