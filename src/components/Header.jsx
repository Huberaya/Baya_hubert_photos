import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV, SITE } from '../data/content'
import { useScrollProgress, useSpotlight } from '../hooks'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progress = useScrollProgress()
  const location = useLocation()
  const spotlight = useSpotlight()
  const panelRef = useRef(null)

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header__in">
          <Link to="/" className="brand" aria-label="Baya Hubert — accueil">
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="30" height="30">
                <circle cx="16" cy="16" r="14" fill="none" stroke="url(#bg1)" strokeWidth="1.4" />
                <circle cx="16" cy="16" r="6.5" fill="none" stroke="url(#bg1)" strokeWidth="1.4" />
                <circle cx="16" cy="16" r="2.2" fill="#d8b26a" />
                <defs>
                  <linearGradient id="bg1" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#f0d49a" />
                    <stop offset="100%" stopColor="#a37c33" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="brand__text">
              Baya <em>Hubert</em>
            </span>
          </Link>

          <nav className="header__nav" aria-label="Navigation principale">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `navlink ${isActive ? 'is-active' : ''}`}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn--solid btn--sm" onMouseMove={spotlight}>
              Devis gratuit
            </Link>
          </nav>

          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        hidden={!open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mobile-nav__inner">
          {[...NAV, { to: '/contact', label: 'Demander un devis' }].map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}
              style={{ transitionDelay: `${80 + i * 55}ms` }}
            >
              <em>{String(i + 1).padStart(2, '0')}</em>
              {item.label}
            </NavLink>
          ))}
          <div className="mobile-nav__meta">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">{SITE.instagramHandle}</a>
          </div>
        </div>
      </div>
    </>
  )
}
