import { useEffect, useRef, useCallback } from 'react'

export function useInactivity(onInactive, timeoutMs = 10000) {
  const timerRef = useRef(null)

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(onInactive, timeoutMs)
  }, [onInactive, timeoutMs])

  useEffect(() => {
    const events = ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'keydown']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [reset])
}
