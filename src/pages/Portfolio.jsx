import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PhotoCard from '../components/PhotoCard'
import Lightbox from '../components/Lightbox'
import { CATEGORIES, PHOTOS } from '../data/content'

export default function Portfolio() {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('grille')
  const [lightbox, setLightbox] = useState(-1)

  const visible = useMemo(
    () => (filter === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === filter)),
    [filter],
  )


  const activeCat = CATEGORIES.find((c) => c.id === filter)

  return (
    <>
      <Seo
        title="Portfolio"
        description="Explorez le portfolio complet de Baya Hubert. Gastronomie, vie urbaine, architecture, paysages naturels et portraits lifestyle capturés à Paris et en Île-de-France."
        path="/portfolio"
      />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Portfolio</span>
          </nav>
          <p className="eyebrow" data-reveal>15 clichés · 5 univers · fiches techniques complètes</p>
          <h1 data-reveal data-reveal-delay="60">Une banque d'images <em>vivante</em></h1>
          <p className="lede" data-reveal data-reveal-delay="120">
            Chaque catégorie correspond à un univers de mon travail. Filtrez, agrandissez, et projetez-vous :
            chaque cliché affiche sa fiche technique complète (boîtier, objectif, focale, ouverture, vitesse, ISO).
          </p>
        </div>
      </header>

      <section className="section--tight">
        <div className="container">
          <div className="pf-toolbar glass" data-reveal>
            <div className="filters" role="tablist" aria-label="Filtrer par univers" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={filter === c.id}
                  className={`filter ${filter === c.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(c.id)}
                >
                  <span>{c.label}</span>
                  <em>{c.id === 'all' ? PHOTOS.length : PHOTOS.filter((p) => p.category === c.id).length}</em>
                </button>
              ))}
            </div>
            <div className="pf-toolbar__views" role="group" aria-label="Disposition de la galerie">
              {['grille', 'mosaïque'].map((v) => (
                <button key={v} className={`pf-view ${view === v ? 'is-active' : ''}`} onClick={() => setView(v)} aria-pressed={view === v}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <p className="filters__hint" aria-live="polite" style={{ textAlign: 'left' }}>
            {visible.length} cliché{visible.length > 1 ? 's' : ''} — {activeCat?.desc}
          </p>

          <div className={`photo-grid ${view === 'mosaïque' ? 'photo-grid--masonry' : ''}`}>
            {visible.map((p, i) => (
              <PhotoCard key={p.id} photo={p} index={i} priority={i < 4} onOpen={() => setLightbox(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow head-center" data-reveal>
          <p className="eyebrow eyebrow--center">La suite</p>
          <h2 className="section-title">Une vision créative <em>singulière</em> pour votre marque</h2>
          <p className="lede text-center">
            Chaque séance fait l'objet d'une préparation sur mesure afin de s'aligner sur votre univers créatif ou
            l'identité visuelle de votre entreprise.
          </p>
          <div className="footer__cta-actions">
            <Link to="/contact" className="btn btn--solid">Réserver mon shooting</Link>
            <Link to="/services" className="btn btn--ghost">Voir les prestations<span className="btn__arrow">→</span></Link>
          </div>
        </div>
      </section>

      {lightbox >= 0 && (
        <Lightbox
          photos={visible}
          index={lightbox}
          onClose={() => setLightbox(-1)}
          onNav={(d) => setLightbox((i) => (i + d + visible.length) % visible.length)}
        />
      )}
    </>
  )
}
