import { useEffect, useRef, useState } from 'react'

/* =========================================================
   AMBIANCE SONORE — Web Audio API procédural
   Un pad doux (3 oscillateurs) + notes cristallines occasionnelles.
   Démarre après interaction utilisateur (politique autoplay).
   ========================================================= */
export function useHeroAudio(enabled) {
  const ctxRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)

  const start = () => {
    if (ctxRef.current || !enabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctxRef.current = ctx

      // Pad doux : 3 oscillateurs décalés en fréquence
      const baseFreqs = [110, 164.81, 220]
      const gains = []
      baseFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()
        osc.type = 'sine'
        osc.frequency.value = freq
        osc.detune.value = (i - 1) * 6
        filter.type = 'lowpass'
        filter.frequency.value = 400
        filter.Q.value = 0.5
        gain.gain.value = 0
        gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 3)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        gains.push(gain)
      })

      // Notes cristallines occasionnelles
      const sparkle = () => {
        if (!ctxRef.current) return
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const freqs = [440, 554.37, 659.25, 880, 1108.7]
        osc.type = 'sine'
        osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)]
        gain.gain.value = 0
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 3)
      }
      intervalRef.current = setInterval(sparkle, 2500)

      setPlaying(true)
    } catch {
      // Silently fail if audio not supported
    }
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (ctxRef.current) {
      ctxRef.current.close()
      ctxRef.current = null
      setPlaying(false)
    }
  }

  const toggle = () => playing ? stop() : start()

  useEffect(() => () => stop(), []) // cleanup

  return { playing, toggle }
}
