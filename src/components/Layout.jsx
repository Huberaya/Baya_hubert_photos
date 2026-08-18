import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Header from './Header'
import Footer from './Footer'
import { useCapabilities, useScrollReveal } from '../hooks'
import Cursor from './Cursor'

export const CapsContext = { current: { tier: 'high', webgl: true, reducedMotion: false, touch: false } }

export default function Layout() {
  const caps = useCapabilities()
  const location = useLocation()
  const [transitioning, setTransitioning] = useState(false)
  const lenisRef = useRef(null)

  CapsContext.current = caps

  /* Smooth scroll — désactivé si reduced-motion ou appareil faible */
  useEffect(() => {
    if (!caps.ready) return
    if (caps.reducedMotion || caps.tier === 'low' || caps.touch) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 })
    lenisRef.current = lenis
    let id
    const raf = (t) => {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [caps.ready, caps.reducedMotion, caps.tier, caps.touch])

  /* Transition de page + scroll top + ancres */
  useEffect(() => {
    setTransitioning(true)
    const t1 = setTimeout(() => {
      if (location.hash) {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
        } else {
          window.scrollTo(0, 0)
        }
      } else {
        lenisRef.current?.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }
    }, 120)
    const t2 = setTimeout(() => setTransitioning(false), 520)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [location.pathname, location.hash])

  useScrollReveal([location.pathname])

  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu principal</a>
      <div className="grain" aria-hidden="true" />
      <div className={`page-veil ${transitioning ? 'is-active' : ''}`} aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      {!caps.touch && !caps.reducedMotion && <Cursor />}
      <Header />
      <main id="main" key={location.pathname} className="page-enter">
        <Outlet context={caps} />
      </main>
      <Footer />
    </>
  )
}
