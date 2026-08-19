import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { Accordion, TiltCard, Aurora } from '../components/ui'
import Icon from '../components/Icon'
import { FAQ, OFFERS, SERVICE_GROUPS } from '../data/content'

const COMPARE = [
  ['Durée', '1 h', '1 h', '1 h 30 / mois', '½ journée', 'Journée complète'],
  ['Images', '15 retouchées', '12 retouchées', '15 à 20 / mois', '25 HDR', 'Centaines'],
  ['Vidéo', '—', '—', '2 Reels / mois', 'En option', 'En option'],
  ['Livraison', '5 jours', '5 jours', '5 jours', '5 jours', '10 à 15 jours'],
  ['Droits', 'Web & réseaux', 'Web & réseaux', 'Web & réseaux', 'Diffusion pro', 'Privé'],
  ['Galerie privée', 'Oui', 'Oui', 'Oui', 'Oui (équipes)', 'Oui (invités)'],
]

export default function Services() {
  return (
    <>
      <Seo
        title="Services & Tarifs"
        description="Formules photo à Paris : shooting, portraits, restaurant & gastronomie, immobilier & architecture, mariages & événements. Tarifs clairs, droits encadrés, devis sous 24 h."
        path="/services"
      />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Services & Tarifs</span>
          </nav>
          <p className="eyebrow" data-reveal>5 piliers · 5 univers</p>
          <h1 data-reveal data-reveal-delay="60">Des offres claires, <em>sans surprise</em></h1>
          <p className="lede" data-reveal data-reveal-delay="120">
            Un prix, un contenu, un résultat. Les droits d'utilisation sont toujours encadrés et facturés à part
            uniquement si votre diffusion l'exige.
          </p>
        </div>
      </header>

      {/* Piliers */}
      <section className="section--tight">
        <div className="container">
          <div className="offers__grid">
            {OFFERS.map((o, i) => (
              <TiltCard key={o.id} className={`card offer ${o.featured ? 'card--featured' : ''}`} intensity={6} data-reveal data-reveal-delay={i * 90}>
                {o.featured && <span className="offer__flag">Le plus demandé</span>}
                <span className="offer__icon" aria-hidden="true"><Icon name={o.icon} size={26} /></span>
                <p className="offer__pillar">{o.pillar}</p>
                <h2 className="offer__title">{o.title}</h2>
                <p className="offer__price">{o.price}{o.unit && <small>{o.unit}</small>}</p>
                <p className="offer__desc">{o.desc}</p>
                <ul className="offer__list">
                  {o.features.map((f) => (
                    <li key={f}>
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 8.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/contact?service=${o.param}`} className={`btn ${o.featured ? 'btn--solid' : 'btn--ghost'} btn--block`}>{o.cta}</Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="section--tight">
        <div className="container">
          <header data-reveal>
            <p className="eyebrow">Comparer</p>
            <h2 className="section-title">Choisir en <em>un coup d'œil</em></h2>
          </header>
          <div className="compare" data-reveal data-reveal-delay="80">
            <table>
              <caption className="sr-only">Comparatif des cinq piliers de prestation</caption>
              <thead>
                <tr>
                  <th scope="col">Critère</th>
                  {OFFERS.map((o) => <th key={o.id} scope="col">{o.title}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Groupes détaillés */}
      {SERVICE_GROUPS.map((g) => (
        <section className="section--tight" key={g.id} id={g.id}>
          <Aurora className={g.id === 'evenements' ? 'aurora--violet' : ''} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="svc-group__head" data-reveal>
              <p className="eyebrow">{g.pillar}</p>
              <h2 className="section-title">{g.title}</h2>
              <p className="lede">{g.intro}</p>
            </div>
            <div className="svc-grid">
              {g.items.map((it, i) => (
                <TiltCard key={it.title} className="card svc-card" intensity={5} data-reveal data-reveal-delay={i * 90}>
                  <span className="svc-card__tag"><Icon name={it.icon} size={16} />{it.tag}</span>
                  <h3>{it.title}</h3>
                  <p className="svc-card__price">{it.price}</p>
                  <p className="svc-card__desc">{it.desc}</p>
                  <ul>
                    {it.features.map((f) => <li key={f}><span aria-hidden="true" />{f}</li>)}
                  </ul>
                  <Link to={`/contact?service=${it.param}`} className="btn btn--ghost btn--block">{it.cta}</Link>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container container--narrow">
          <header className="head-center" data-reveal>
            <p className="eyebrow eyebrow--center">Questions fréquentes</p>
            <h2 className="section-title">Quelques réponses <em>utiles</em></h2>
            <p className="lede text-center">
              Voici les questions récurrentes que mes clients professionnels et particuliers se posent avant de
              réserver une prestation.
            </p>
          </header>
          <Accordion items={FAQ} />
        </div>
      </section>
    </>
  )
}
