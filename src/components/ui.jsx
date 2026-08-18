import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView, useCountUp, useSpotlight } from '../hooks'

/* =========================================================
   Compteur animé (statistiques)
   ========================================================= */
export function Counter({ value, suffix = '', label, desc }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const n = useCountUp(value, { start: inView, duration: 1700 })
  return (
    <div className="stat" ref={ref}>
      <div className="stat__value">
        {n.toLocaleString('fr-FR')}
        <span>{suffix}</span>
      </div>
      <div className="stat__label">{label}</div>
      {desc && <p className="stat__desc">{desc}</p>}
    </div>
  )
}

/* =========================================================
   Carte 3D « tilt » — micro-interaction au survol
   ========================================================= */
export function TiltCard({ children, className = '', intensity = 8, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const raf = useRef(0)

  const onMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el || window.matchMedia('(pointer: coarse)').matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty('--rx', `${(0.5 - py) * intensity}deg`)
        el.style.setProperty('--ry', `${(px - 0.5) * intensity}deg`)
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      })
    },
    [intensity],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <Tag ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </Tag>
  )
}

/* =========================================================
   Bouton magnétique
   ========================================================= */
export function Magnetic({ children, strength = 0.28 }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${
      (e.clientY - (r.top + r.height / 2)) * strength
    }px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }
  return (
    <span ref={ref} className="magnetic" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  )
}

/* =========================================================
   Titre à révélation mot par mot
   ========================================================= */
export function SplitReveal({ text, className = '', tag: Tag = 'h1', delay = 0 }) {
  const words = String(text).split(' ')
  return (
    <Tag className={`split ${className}`}>
      {words.map((w, i) => (
        <span className="split__word" key={`${w}-${i}`}>
          <span className="split__inner" style={{ animationDelay: `${delay + i * 70}ms` }}>
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/* =========================================================
   Accordéon accessible (FAQ)
   ========================================================= */
export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`accordion__item ${isOpen ? 'is-open' : ''}`} data-reveal data-reveal-delay={i * 70}>
            <h3>
              <button
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-btn-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{item.q}</span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className="accordion__panel"
              hidden={!isOpen}
            >
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================
   Bouton avec spotlight (réutilisable)
   ========================================================= */
export function GlowButton({ children, className = '', as: Tag = 'button', ...rest }) {
  const spot = useSpotlight()
  return (
    <Tag className={`btn ${className}`} onMouseMove={spot} {...rest}>
      {children}
    </Tag>
  )
}

/* =========================================================
   Section décorative : halo animé
   ========================================================= */
export function Aurora({ className = '' }) {
  return <div className={`aurora ${className}`} aria-hidden="true" />
}
