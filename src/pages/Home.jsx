import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import Seo from '../components/Seo'
import PhotoCard from '../components/PhotoCard'
import Lightbox from '../components/Lightbox'
import { Accordion, Aurora } from '../components/ui'
import Icon from '../components/Icon'
import { CATEGORIES, FAQ, OFFERS, PHOTOS, PROCESS, STATS } from '../data/content'
import { PRINTS } from '../data/prints'
import { useHeroAudio } from '../three/useHeroAudio'

const HeroScene = lazy(() => import('../three/HeroScene'))

/* =========================================================
   AMBIANCE SONORE — bouton en bas du hero
   ========================================================= */
function SoundToggle({ tier }) {
  const { playing, toggle } = useHeroAudio(tier)
  return (
    <button
      className={`hero__sound ${playing ? 'is-active' : ''}`}
      onClick={toggle}
      aria-label={playing ? "Couper l'ambiance sonore" : "Activer l'ambiance sonore"}
      title={playing ? 'Son activé' : 'Activer le son'}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" opacity="0.4" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" opacity="0.4" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  )
}

/* =========================================================
   FALLBACK — silhouette Tour Eiffel en CSS pur
   ========================================================= */
function HeroFallback() {
  return (
    <div className="hero__fallback" aria-hidden="true">
      <div className="hero__fallback-veil" />
      <img src="/assets/images/eiffel-tower-transparent-v2.png" alt="" className="hero__fallback-tower" loading="eager" decoding="async" />
    </div>
  )
}

/* =========================================================
   HERO — silencieux, éditorial, premium
   Tour Eiffel en silhouette parallax à l'arrière-plan
   ========================================================= */
function Hero({ caps }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])

  const use3D = caps.ready && caps.webgl && !caps.reducedMotion

  return (
    <section className="hero">
      <div className="hero__scene">
        {use3D && mounted ? (
          <Suspense fallback={<HeroFallback />}>
            <HeroScene tier={caps.tier} className="hero__canvas" />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
        <div className="hero__vignette" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
      </div>

      <div className="container hero__content">
        <p className="hero__kicker" data-reveal>
          <span className="hero__kicker-line" /> Baya Hubert · Paris &amp; Île-de-France
        </p>

        <h1 className="hero__title" data-reveal data-reveal-delay="120">
          <span className="hero__title-line">La lumière,</span>
          <span className="hero__title-line"><em>vraie.</em></span>
        </h1>

        <p className="hero__lede" data-reveal data-reveal-delay="320">
          Photographe à Paris. Cinq univers, une seule obsession&nbsp;: saisir l'authentique.
        </p>

        <div className="hero__actions" data-reveal data-reveal-delay="460">
          <Link to="/contact" className="btn btn--solid btn--magnetic">
            Demander un devis
            <span className="btn__arrow">→</span>
          </Link>
          <a href="#galerie" className="btn btn--ghost">
            Voir le portfolio
            <span className="btn__arrow">↓</span>
          </a>
        </div>
      </div>

      <SoundToggle tier={caps.tier} />

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Défiler</span>
      </div>
    </section>
  )
}

/* =========================================================
   MARQUEE — manifeste défilant (univers)
   ========================================================= */
function Marquee() {
  const words = ['Shooting', 'Portraits', 'Gastronomie', 'Immobilier', 'Mariage', 'Événement']
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1, 2].map((k) => (
          <div className="marquee__group" key={k}>
            {words.map((w) => (
              <span key={`${k}-${w}`} className="marquee__item">{w}<i>✦</i></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   STATEMENT — manifeste éditorial premium
   ========================================================= */
function Manifesto() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
        el.style.setProperty('--par', String(Math.max(-1, Math.min(1, p))))
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="section manifesto" ref={ref}>
      <Aurora />
      <div className="container manifesto__grid">
        <div className="manifesto__text">
          <p className="eyebrow" data-reveal>Parti pris</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">
            Refuser l'artifice.<br />
            Chercher la <em>vérité d'un regard</em>.
          </h2>
          <p className="lede" data-reveal data-reveal-delay="160">
            Pas de pose forcée, pas de lumière artificielle, aucune image générée. Je compose avec le réel&nbsp;: l'heure, la fenêtre, la matière, le geste.
          </p>
          <p className="manifesto__quote" data-reveal data-reveal-delay="240">
            <span className="manifesto__quote-mark">«</span>
            La lumière ne se pose pas, elle se rencontre.
          </p>
        </div>

        <div className="manifesto__media" data-reveal="right">
          <div className="manifesto__stack">
            <img src="/assets/images/gallery/rue-3.webp" alt="Scène de rue à Paris" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--a" />
            <img src="/assets/images/gallery/archi-2.webp" alt="Verrière de gare parisienne" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--b" />
            <img src="/assets/images/gallery/nature-2.webp" alt="Pont de pierre" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--c" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   GALERIE — grille asymétrique éditoriale
   ========================================================= */
function Gallery() {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(-1)

  const visible = useMemo(
    () => (filter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <section className="section gallery" id="galerie">
      <div className="container">
        <header className="head-center" data-reveal>
          <p className="eyebrow eyebrow--center">Portfolio</p>
          <h2 className="section-title">15 clichés, <em>5 univers</em></h2>
          <p className="lede text-center">Chaque photo dispose d'une fiche technique complète&nbsp;: boîtier, objectif, focale, ouverture, vitesse, ISO.</p>
        </header>

        <div className="filters" role="tablist" aria-label="Filtrer la galerie par univers">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              className={`filter ${filter === c.id ? 'is-active' : ''}`}
              onClick={() => setFilter(c.id)}
              data-reveal
              data-reveal-delay={i * 50}
            >
              <span>{c.label}</span>
              <em>{c.id === 'all' ? PHOTOS.length : PHOTOS.filter((p) => p.category === c.id).length}</em>
            </button>
          ))}
        </div>

        <p className="filters__hint" aria-live="polite">
          {visible.length} cliché{visible.length > 1 ? 's' : ''}
          {filter !== 'all' && ` · ${CATEGORIES.find((c) => c.id === filter)?.desc}`}
        </p>

        <div className="photo-grid photo-grid--editorial">
          {visible.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i} priority={i < 3} onOpen={() => setLightbox(i)} />
          ))}
        </div>

        <div className="gallery__more" data-reveal>
          <Link to="/portfolio" className="btn btn--ghost">
            Voir le portfolio complet
            <span className="btn__arrow">→</span>
          </Link>
        </div>
      </div>

      {lightbox >= 0 && (
        <Lightbox
          photos={visible}
          index={lightbox}
          onClose={() => setLightbox(-1)}
          onNav={(d) => setLightbox((i) => (i + d + visible.length) % visible.length)}
        />
      )}
    </section>
  )
}

/* =========================================================
   LES 5 UNIVERS — chapitre éditorial horizontal
   ========================================================= */
function Univers() {
  const universes = [
    { id: 'shooting',    label: 'Shooting & Mode',       desc: 'Street, mode, éditorial',     photo: '/assets/images/gallery/shooting-1.webp' },
    { id: 'portrait',    label: 'Portraits',             desc: 'Individuel, couple, famille', photo: '/assets/images/gallery/portrait-1.webp' },
    { id: 'gastronomie', label: 'Restaurant & Gastronomie', desc: 'Plats, boissons, ambiance', photo: '/assets/images/gallery/gastro-1.webp' },
    { id: 'immobilier',  label: 'Immobilier & Architecture', desc: 'Façades, intérieurs, lignes', photo: '/assets/images/gallery/immobili-1.webp' },
    { id: 'mariage',     label: 'Mariage & Événements',  desc: 'Cérémonies, concerts, fêtes', photo: '/assets/images/gallery/scene-1.webp' },
  ]
  return (
    <section className="section univers">
      <Aurora className="aurora--violet" />
      <div className="container">
        <header className="head-center" data-reveal>
          <p className="eyebrow eyebrow--center">Univers</p>
          <h2 className="section-title">Cinq <em>mondes</em>, un regard</h2>
        </header>
        <div className="univers__grid">
          {universes.map((u, i) => (
            <Link
              key={u.id}
              to={`/portfolio?universe=${u.id}`}
              className="univers__card"
              data-reveal
              data-reveal-delay={i * 80}
            >
              <span className="univers__media">
                <img src={u.photo} alt={u.label} loading="lazy" />
                <span className="univers__media-veil" />
              </span>
              <span className="univers__copy">
                <span className="univers__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="univers__label">{u.label}</span>
                <span className="univers__desc">{u.desc}</span>
                <span className="univers__cta">Explorer <span className="btn__arrow">→</span></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   OFFRES — 5 piliers / univers
   ========================================================= */
function Offers() {
  return (
    <section className="section offers" id="offres">
      <Aurora className="aurora--violet" />
      <div className="container">
        <header className="head-center" data-reveal>
          <p className="eyebrow eyebrow--center">Prestations</p>
          <h2 className="section-title">Cinq piliers, <em>un seul interlocuteur</em></h2>
          <p className="lede text-center">Droits d'utilisation toujours encadrés dans le devis. Devis détaillé sous 24 h.</p>
        </header>

        <div className="offers__grid">
          {OFFERS.map((o, i) => (
            <div key={o.id} className={`card offer ${o.featured ? 'card--featured' : ''}`} data-reveal data-reveal-delay={i * 80}>
              {o.featured && <span className="offer__flag">Le plus demandé</span>}
              <span className="offer__icon" aria-hidden="true"><Icon name={o.icon} size={26} /></span>
              <p className="offer__pillar">{o.pillar}</p>
              <h3 className="offer__title">{o.title}</h3>
              <p className="offer__price">
                {o.price}
                {o.unit && <small>{o.unit}</small>}
              </p>
              <p className="offer__desc">{o.desc}</p>
              <ul className="offer__list">
                {o.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 8.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={`/contact?service=${o.param}`} className={`btn ${o.featured ? 'btn--solid' : 'btn--ghost'} btn--block`}>
                {o.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   PROCESS — méthode en 5 étapes
   ========================================================= */
function Process() {
  const [active, setActive] = useState(0)
  const refs = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.step))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="section process" id="methode">
      <div className="container process__grid">
        <div className="process__aside">
          <p className="eyebrow" data-reveal>Méthode</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">
            De l'idée <em>à l'image livrée</em>
          </h2>
          <p className="lede" data-reveal data-reveal-delay="120">
            Cinq étapes claires, un interlocuteur unique, aucun angle mort sur les droits ni les délais.
          </p>
        </div>
        <ol className="process__steps">
          {PROCESS.map((s, i) => (
            <li
              key={s.n}
              data-step={i}
              ref={(el) => (refs.current[i] = el)}
              className={`process__step ${active === i ? 'is-active' : ''}`}
              data-reveal="right"
              data-reveal-delay={i * 60}
            >
              <span className="process__num">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="badge">{s.meta}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* =========================================================
   STATS — chiffres clés
   ========================================================= */
function Stats() {
  return (
    <section className="section--tight stats-band">
      <div className="container stats-band__grid">
        {STATS.map((s, i) => (
          <div key={s.label} data-reveal data-reveal-delay={i * 80}>
            <span className="stat__value"><strong>{s.value}{s.suffix}</strong></span>
            <span className="stat__label">{s.label}</span>
            <span className="stat__desc">{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   TEASER À PROPOS
   ========================================================= */
function AboutTeaser() {
  return (
    <section className="section about-teaser">
      <div className="container about-teaser__grid">
        <div className="about-teaser__media" data-reveal="left">
          <img src="/assets/images/gallery/nuit-2.webp" alt="Rue parisienne de nuit" loading="lazy" decoding="async" width="340" height="425" />
          <div className="about-teaser__glass glass">
            <strong>Hybride Full Frame</strong>
            <span>Double sauvegarde sur site</span>
          </div>
        </div>
        <div className="about-teaser__text">
          <p className="eyebrow" data-reveal>L'artiste</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">Photographe d'identité <em>& de lieux</em></h2>
          <p data-reveal data-reveal-delay="120">
            Je m'appelle Baya Hubert. Je passe mes journées à parcourir les rues de Paris et sa région pour documenter les projets créatifs et les histoires d'entreprises qui méritent d'être mises en valeur.
          </p>
          <Link to="/apropos" className="btn btn--ghost" data-reveal data-reveal-delay="320">
            Découvrir la démarche
            <span className="btn__arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   CTA CONTACT — final
   ========================================================= */
function ContactCTA() {
  return (
    <section className="section contact-cta">
      <div className="container">
        <div className="contact-cta__inner" data-reveal>
          <p className="eyebrow">Travaillons ensemble</p>
          <h2 className="contact-cta__title">Vous avez un projet <em>en tête&nbsp;?</em></h2>
          <p className="contact-cta__lede">
            Décrivez-moi votre univers, vos envies, vos contraintes. Je reviens vers vous sous 24 h avec une proposition détaillée.
          </p>
          <Link to="/contact" className="btn btn--solid btn--magnetic btn--lg">
            Demander un devis
            <span className="btn__arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   PAGE
   ========================================================= */
export default function Home() {
  const caps = useOutletContext()
  return (
    <>
      <Seo
        title="Baya Hubert — Photographe à Paris"
        description="Photographe à Paris. 5 univers : Shooting, Portraits, Restaurant & Gastronomie, Immobilier, Mariage & Événements. Devis sous 24 h."
        path="/"
      />
      <Hero caps={caps} />
      <Marquee />
      <Manifesto />
      <Univers />
      <Gallery />
      <Offers />
      <Process />
      <Stats />
      <AboutTeaser />
      <ContactCTA />
    </>
  )
}
