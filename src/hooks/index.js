import { useEffect, useRef, useState, useCallback } from 'react'

/* ---------------------------------------------------------
   Détection de capacité : WebGL, motion, puissance appareil
   --------------------------------------------------------- */
function detectWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

function detectTier() {
  if (typeof window === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 768
  const saveData = navigator.connection?.saveData
  if (saveData || cores <= 2 || mem <= 2) return 'low'
  if (coarse || narrow || cores <= 4 || mem <= 4) return 'mid'
  return 'high'
}

export function useCapabilities() {
  const [caps, setCaps] = useState({ webgl: true, tier: 'high', reducedMotion: false, ready: false, touch: false })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compute = () =>
      setCaps({
        webgl: detectWebGL(),
        tier: detectTier(),
        reducedMotion: mq.matches,
        touch: window.matchMedia('(pointer: coarse)').matches,
        ready: true,
      })
    compute()
    mq.addEventListener?.('change', compute)
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      mq.removeEventListener?.('change', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', caps.reducedMotion)
    document.documentElement.dataset.tier = caps.tier
  }, [caps.reducedMotion, caps.tier])

  return caps
}

/* ---------------------------------------------------------
   Révélation au scroll — un seul IntersectionObserver global
   --------------------------------------------------------- */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const delay = Number(e.target.dataset.revealDelay || 0)
          window.setTimeout(() => e.target.classList.add('is-visible'), delay)
          io.unobserve(e.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((n) => io.observe(n))
    }
    scan()

    // Les pages chargées en différé (lazy) arrivent après : on surveille le DOM.
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    // Filet de sécurité : rien ne doit jamais rester invisible à l'écran
    let ticking = false
    const sweep = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const rest = document.querySelectorAll('[data-reveal]:not(.is-visible)')
        rest.forEach((n) => {
          const r = n.getBoundingClientRect()
          if (r.top < window.innerHeight * 0.98 && r.bottom > 0) n.classList.add('is-visible')
        })
      })
    }
    const safety = window.setTimeout(sweep, 900)
    window.addEventListener('scroll', sweep, { passive: true })
    window.addEventListener('resize', sweep, { passive: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      clearTimeout(safety)
      window.removeEventListener('scroll', sweep)
      window.removeEventListener('resize', sweep)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ---------------------------------------------------------
   Compteur animé
   --------------------------------------------------------- */
export function useCountUp(target, { duration = 1600, start = false } = {}) {
  const [value, setValue] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration, start])
  return value
}

/* ---------------------------------------------------------
   Entrée dans le viewport (une fois)
   --------------------------------------------------------- */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25, ...options },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView]
}

/* ---------------------------------------------------------
   Pointeur normalisé (-1 → 1) pour parallaxe
   --------------------------------------------------------- */
export function usePointer(enabled = true) {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])
  return pointer
}

/* ---------------------------------------------------------
   Effet "spotlight" pour les boutons/cartes (--mx / --my)
   --------------------------------------------------------- */
export function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])
}

/* ---------------------------------------------------------
   Progression de scroll (0 → 1)
   --------------------------------------------------------- */
export function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        setP(h > 0 ? Math.min(1, window.scrollY / h) : 0)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return p
}
