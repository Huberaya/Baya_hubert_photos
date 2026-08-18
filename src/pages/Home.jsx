import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import Seo from '../components/Seo'
import PhotoCard from '../components/PhotoCard'
import Lightbox from '../components/Lightbox'
import { Counter, SplitReveal, TiltCard, Accordion, Aurora } from '../components/ui'
import Icon from '../components/Icon'
import { CATEGORIES, FAQ, OFFERS, PHOTOS, PROCESS, STATS } from '../data/content'
import { PRINTS } from '../data/prints'

const HeroScene = lazy(() => import('../three/HeroScene'))

/* =========================================================
   HERO
   ========================================================= */
function Hero({ caps }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // on laisse le contenu peindre avant d'initialiser la 3D (LCP)
    const t = setTimeout(() => setMounted(true), 260)
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
      </div>

      <div className="container hero__content">
        <p className="eyebrow hero__kicker" data-reveal>Paris & Île-de-France · Depuis 2019</p>

        <h1 className="display hero__title">
          <SplitReveal tag="span" text="Saisir l'authentique," className="hero__line" delay={120} />
          <span className="hero__line hero__line--em">
            <em>sublimer l'instant.</em>
          </span>
        </h1>

        <p className="hero__lede" data-reveal data-reveal-delay="240">
          Photographe professionnel à Paris. Je traduis l'essence de vos lieux, la singularité de vos collaborateurs
          et la poésie de vos célébrations en images fortes, contrastées et durables.
        </p>

        <div className="hero__actions" data-reveal data-reveal-delay="340">
          <Link to="/contact" className="btn btn--solid">Réserver une séance</Link>
          <a href="#galerie" className="btn btn--ghost">Découvrir le portfolio<span className="btn__arrow">↓</span></a>
        </div>

        <ul className="hero__pills" data-reveal data-reveal-delay="420">
          <li className="badge badge--dot">Lumière naturelle</li>
          <li className="badge badge--dot">Devis sous 24 h</li>
          <li className="badge badge--dot">Droits encadrés</li>
        </ul>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Défiler</span>
      </div>
    </section>
  )
}

function HeroFallback() {
  return (
    <div className="hero__fallback" aria-hidden="true">
      <div className="hero__fallback-iris">
        <span /><span /><span />
      </div>
      <img src="/assets/images/portfolio/architecture-1.webp" alt="" className="hero__fallback-img" loading="eager" decoding="async" />
    </div>
  )
}

/* =========================================================
   BANDEAU DÉFILANT (manifeste)
   ========================================================= */
function Marquee() {
  const words = ['Lieux', 'Goûts', 'Corporate', 'Célébrations', 'Architecture', 'Portraits', 'Street', 'Saisons']
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div className="marquee__group" key={k}>
            {words.map((w) => (
              <span key={`${k}-${w}`} className="marquee__item">
                {w}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   MANIFESTE + PARALLAXE
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
          <p className="eyebrow" data-reveal>Le parti pris</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">
            Refuser l'artifice.<br />Chercher la <em>vérité d'un regard</em>.
          </h2>
          <p className="lede" data-reveal data-reveal-delay="120">
            Pas de pose forcée, pas de lumière artificielle imposée, aucune image générée par intelligence
            artificielle. Je compose avec le réel : l'heure, la fenêtre, la matière, le geste.
          </p>
          <ul className="manifesto__list">
            {[
              ['Lumière naturelle', 'La séance est calée sur la course du soleil et l’orientation du lieu.'],
              ['Direction douce', 'Un rythme calme qui laisse apparaître les expressions justes.'],
              ['Post-traitement signé', 'Colorimétrie et contrastes travaillés image par image.'],
            ].map(([t, d], i) => (
              <li key={t} data-reveal="left" data-reveal-delay={i * 90}>
                <span className="manifesto__idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="manifesto__media" data-reveal="right">
          <div className="manifesto__stack">
            <img src="/assets/images/portfolio/portraits-lifestyle-2.webp" alt="Portrait en lumière naturelle réalisé par Baya Hubert" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--a" />
            <img src="/assets/images/portfolio/food-cafe-2.webp" alt="Photographie culinaire en lumière de fenêtre" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--b" />
            <img src="/assets/images/portfolio/nature-saisons-2.webp" alt="Paysage d'Île-de-France à l'heure dorée" loading="lazy" decoding="async" width="340" height="425" className="manifesto__img manifesto__img--c" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   GALERIE FILTRABLE (fonctionnalité conservée)
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
          <p className="eyebrow eyebrow--center">Galerie</p>
          <h2 className="section-title">Un regard, <em>cinq univers</em></h2>
          <p className="lede text-center">
            Une sélection rigoureuse de mes travaux. Filtrez la banque créative pour ne voir que ce qui vous concerne.
          </p>
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
          {visible.length} cliché{visible.length > 1 ? 's' : ''} affiché{visible.length > 1 ? 's' : ''}
          {filter !== 'all' && ` · ${CATEGORIES.find((c) => c.id === filter)?.desc}`}
        </p>

        <div className="photo-grid">
          {visible.map((p, i) => (
            <PhotoCard key={p.id} photo={p} index={i} priority={i < 3} onOpen={() => setLightbox(i)} />
          ))}
        </div>

        <div className="gallery__more" data-reveal>
          <Link to="/portfolio" className="btn btn--ghost">Voir le portfolio complet<span className="btn__arrow">→</span></Link>
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
   GALERIE DE TIRAGES — teaser vers /photographie
   ========================================================= */
function PrintsTeaser() {
  const picks = [PRINTS[0], PRINTS[1], PRINTS[2], PRINTS[3]]
  return (
    <section className="section prints-teaser">
      <Aurora />
      <div className="container">
        <header className="prints-teaser__head">
          <div>
            <p className="eyebrow" data-reveal>Tirages d'art</p>
            <h2 className="section-title" data-reveal data-reveal-delay="60">
              Découvrez mon <em>travail photographique</em>
            </h2>
            <p className="lede" data-reveal data-reveal-delay="120">
              Une collection de dix photographies disponibles en tirage fine art ou fichier haute définition,
              de 30 à 100 $. Réalisées à la commande, signées.
            </p>
          </div>
          <Link to="/photographie" className="btn btn--ghost prints-teaser__cta" data-reveal data-reveal-delay="180">
            Voir toute la galerie<span className="btn__arrow">→</span>
          </Link>
        </header>

        <div className="prints-teaser__grid">
          {picks.map((p, i) => (
            <Link
              key={p.id}
              to={`/photographie#${p.id}`}
              className={`ptile ptile--${p.orientation}`}
              data-reveal="scale"
              data-reveal-delay={i * 90}
              aria-label={`${p.title} — tirage à partir de ${p.price} dollars`}
            >
              <img
                src={p.src.replace('/portfolio/', '/portfolio/thumbs/')}
                srcSet={`${p.src.replace('/portfolio/', '/portfolio/thumbs/')} 420w, ${p.src} 1000w`}
                sizes="(max-width: 700px) 45vw, 24vw"
                alt={`${p.title} — tirage d'art de Baya Hubert`}
                loading="lazy"
                decoding="async"
                width={p.w}
                height={p.h}
              />
              <span className="ptile__veil" aria-hidden="true" />
              <span className="ptile__info">
                <span className="ptile__title">{p.title}</span>
                <span className="ptile__price">dès {p.price} $</span>
              </span>
            </Link>
          ))}
        </div>

        <p className="prints-teaser__note" data-reveal>
          Tirage fine art 310 g/m² · 4 formats · fabrication à la commande sous 5 à 8 jours ouvrés.
        </p>
      </div>
    </section>
  )
}

/* =========================================================
   MÉTHODE — étapes en sticky
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
          <p className="eyebrow" data-reveal>La méthode</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">
            De l'idée à l'image <em>livrée</em>
          </h2>
          <p className="lede" data-reveal data-reveal-delay="120">
            Cinq étapes claires, un interlocuteur unique, aucun angle mort sur les droits ni les délais.
          </p>

          <div className="process__viz" aria-hidden="true">
            <div className="process__ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" className="process__ring-bg" />
                <circle
                  cx="60" cy="60" r="52"
                  className="process__ring-fg"
                  style={{ strokeDashoffset: 327 - 327 * ((active + 1) / PROCESS.length) }}
                />
              </svg>
              <div className="process__ring-label">
                <strong>{String(active + 1).padStart(2, '0')}</strong>
                <span>/ {String(PROCESS.length).padStart(2, '0')}</span>
              </div>
            </div>
            <p className="process__viz-meta">{PROCESS[active].meta}</p>
          </div>
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
   OFFRES
   ========================================================= */
function Offers() {
  return (
    <section className="section offers" id="offres">
      <Aurora className="aurora--violet" />
      <div className="container">
        <header className="head-center" data-reveal>
          <p className="eyebrow eyebrow--center">Prestations</p>
          <h2 className="section-title">Trois piliers, <em>zéro surprise</em></h2>
          <p className="lede text-center">Un prix, un contenu, un résultat. Les droits d'utilisation sont toujours encadrés dans le devis.</p>
        </header>

        <div className="offers__grid">
          {OFFERS.map((o, i) => (
            <TiltCard
              key={o.id}
              className={`card offer ${o.featured ? 'card--featured' : ''}`}
              intensity={6}
              data-reveal
              data-reveal-delay={i * 100}
            >
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
            </TiltCard>
          ))}
        </div>

        <p className="offers__note" data-reveal>
          Besoin d'un cadrage sur mesure (multi-établissements, festival, campagne print) ?{' '}
          <Link to="/services" className="link-underline">Voir le détail des prestations</Link>
        </p>
      </div>
    </section>
  )
}

/* =========================================================
   STATS
   ========================================================= */
function Stats() {
  return (
    <section className="section--tight stats-band">
      <div className="container stats-band__grid">
        {STATS.map((s, i) => (
          <div key={s.label} data-reveal data-reveal-delay={i * 80}>
            <Counter {...s} />
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
          <img src="/assets/images/portfolio/portraits-lifestyle-1.webp" alt="Baya Hubert, photographe à Paris" loading="lazy" decoding="async" width="340" height="425" />
          <div className="about-teaser__glass glass">
            <strong>Hybride Full Frame</strong>
            <span>Double sauvegarde sur site</span>
          </div>
        </div>
        <div className="about-teaser__text">
          <p className="eyebrow" data-reveal>L'artiste</p>
          <h2 className="section-title" data-reveal data-reveal-delay="60">Photographe d'identité <em>& de lieux</em></h2>
          <p data-reveal data-reveal-delay="120">
            Je m'appelle Baya Hubert. Je passe mes journées à parcourir les rues de Paris et sa région pour
            documenter les projets créatifs et les histoires d'entreprises qui méritent d'être mises en valeur.
          </p>
          <p data-reveal data-reveal-delay="180">
            Ma philosophie est simple : refuser l'artifice pour privilégier la lumière naturelle et la vérité d'un
            regard. Chaque séance est préparée avec soin pour créer une atmosphère de bienveillance propice aux
            clichés authentiques.
          </p>
          <div className="about-teaser__specs">
            <div className="glass" data-reveal data-reveal-delay="220">
              <h4>Équipement</h4>
              <p>Hybride Full Frame & objectifs lumineux</p>
            </div>
            <div className="glass" data-reveal data-reveal-delay="280">
              <h4>Sécurité</h4>
              <p>Boîtier pro à double sauvegarde sur site</p>
            </div>
          </div>
          <Link to="/apropos" className="btn btn--ghost" data-reveal data-reveal-delay="320">
            Découvrir la démarche<span className="btn__arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* =========================================================
   FAQ
   ========================================================= */
function FaqBlock() {
  return (
    <section className="section faq-block">
      <div className="container container--narrow">
        <header className="head-center" data-reveal>
          <p className="eyebrow eyebrow--center">Questions fréquentes</p>
          <h2 className="section-title">Ce qu'on me demande <em>avant de réserver</em></h2>
        </header>
        <Accordion items={FAQ} />
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
        title="Photographe à Paris | Corporate & Événementiel"
        description="Découvrez le travail de Baya Hubert, photographe d'art et commercial à Paris. Reportages, architecture, portraits d'art et corporate en lumière naturelle."
        path="/"
      />
      <Hero caps={caps} />
      <Marquee />
      <Manifesto />
      <Gallery />
      <PrintsTeaser />
      <Stats />
      <Process />
      <Offers />
      <AboutTeaser />
      <FaqBlock />
    </>
  )
}
