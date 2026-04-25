// Hybrid audio service: TTS (Web Speech API) + pre-recorded audio

class AudioService {
  constructor() {
    this.synth = window.speechSynthesis || null
    this.sounds = {}
    this.bgMusic = null
    this.isMuted = false
    this.hebrewVoice = null
    this._voiceReady = false
    this._initVoices()
  }

  _initVoices() {
    const load = () => {
      const voices = this.synth?.getVoices() || []
      this.hebrewVoice =
        voices.find((v) => v.lang === 'he-IL') ||
        voices.find((v) => v.lang.startsWith('he')) ||
        voices[0] ||
        null
      this._voiceReady = true
    }
    if (this.synth) {
      if (this.synth.getVoices().length > 0) {
        load()
      } else {
        this.synth.addEventListener('voiceschanged', load, { once: true })
      }
    }
  }

  // TTS for dynamic Hebrew content
  speak(text, { rate = 0.85, pitch = 1.1, volume = 1 } = {}) {
    if (!this.synth || this.isMuted || !text) return
    this.synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'he-IL'
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    if (this.hebrewVoice) utterance.voice = this.hebrewVoice
    this.synth.speak(utterance)
  }

  stopSpeaking() {
    this.synth?.cancel()
  }

  // Pre-recorded audio playback
  async playSound(name, { volume = 1, loop = false } = {}) {
    if (this.isMuted) return
    try {
      const audio = new Audio(`/audio/${name}.mp3`)
      audio.volume = volume
      audio.loop = loop
      await audio.play()
      return audio
    } catch {
      // Audio file not yet recorded — silent fallback
    }
  }

  // Character-specific sounds
  playElsa(soundName) { return this.playSound(`elsa/${soundName}`, { volume: 0.9 }) }
  playStitch(soundName) { return this.playSound(`stitch/${soundName}`, { volume: 0.95 }) }

  // UI sounds
  playTap() { return this.playSound('ui/tap', { volume: 0.4 }) }
  playSuccess() { return this.playSound('ui/success', { volume: 0.7 }) }
  playError() { return this.playSound('ui/error', { volume: 0.5 }) }
  playDrag() { return this.playSound('ui/drag', { volume: 0.3 }) }
  playStar() { return this.playSound('ui/star', { volume: 0.8 }) }
  playCelebration() { return this.playSound('ui/celebration', { volume: 0.9 }) }

  setMuted(muted) { this.isMuted = muted }
  toggleMute() { this.isMuted = !this.isMuted; return this.isMuted }
}

export const audioService = new AudioService()
