import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { Counter, TiltCard } from '../components/ui'
import { STATS } from '../data/content'

const VALUES = [
  { t: 'Lumière naturelle avant tout', d: "Je cale la séance sur la course du soleil et l'orientation du lieu plutôt que d'imposer un flash qui aplatit la matière." },
  { t: 'Aucune image générée par IA', d: "Ce que vous montrez existe : vos plats, vos murs, vos équipes. La confiance de votre audience se construit sur du réel." },
  { t: 'Direction douce, jamais forcée', d: "Un rythme calme, quelques repères de posture, et on laisse venir l'expression juste plutôt que la pose figée." },
  { t: 'Sécurité des fichiers', d: 'Boîtier professionnel à double carte : chaque image est écrite deux fois, sur site, dès la prise de vue.' },
]

const TIMELINE = [
  { y: 'Repérage', t: 'Lire le lieu', d: "Orientation, sources de lumière, matières, contraintes de passage : la séance se prépare avant d'arriver." },
  { y: 'Séance', t: 'Documenter le vrai', d: 'Reportage discret ou direction posée selon le sujet, toujours avec le souci du détail signifiant.' },
  { y: 'Édition', t: 'Signer les images', d: 'Tri sévère, colorimétrie cohérente, contrastes maîtrisés : une série homogène, pas un lot de fichiers.' },
  { y: 'Livraison', t: 'Rendre utilisable', d: 'Formats adaptés à chaque support, galerie privée sécurisée, droits écrits noir sur blanc dans le devis.' },
]

export default function About() {
  return (
    <>
      <Seo
        title="À propos"
        description="Découvrez le parcours, la philosophie artistique et les méthodes de travail de Baya Hubert, photographe d'identité et de reportage à Paris."
        path="/apropos"
      />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">À propos</span>
          </nav>
          <p className="eyebrow" data-reveal>L'artiste</p>
          <h1 data-reveal data-reveal-delay="60">Photographe d'identité <em>& de lieux</em></h1>
        </div>
      </header>

      <section className="section--tight">
        <div className="container about-hero__grid">
          <div data-reveal="left">
            <p className="lede" style={{ marginTop: 0 }}>
              Je m'appelle Baya Hubert. Je passe mes journées à parcourir les rues de Paris et sa région pour
              documenter les projets créatifs et les histoires d'entreprises qui méritent d'être mises en valeur.
            </p>
            <p style={{ color: 'var(--text-soft)', marginTop: 'var(--space-4)' }}>
              Ma philosophie est simple : refuser l'artifice pour privilégier la lumière naturelle et la vérité d'un
              regard. Chaque séance est préparée avec soin pour créer une atmosphère de bienveillance propice aux
              clichés authentiques.
            </p>
            <p style={{ color: 'var(--text-soft)', marginTop: 'var(--space-4)' }}>
              Je travaille aussi bien pour des restaurateurs et hôteliers exigeants que pour des directions
              artistiques, des marques indépendantes et une clientèle privée qui cherche autre chose qu'une photo
              de circonstance.
            </p>
            <div className="about-teaser__specs">
              <div className="glass"><h4>Équipement</h4><p>Hybride Full Frame & objectifs lumineux</p></div>
              <div className="glass"><h4>Sécurité</h4><p>Boîtier pro à double sauvegarde sur site</p></div>
            </div>
            <div className="footer__cta-actions" style={{ justifyContent: 'flex-start', marginTop: 'var(--space-4)' }}>
              <Link to="/contact" className="btn btn--solid">Demander mon devis</Link>
              <Link to="/portfolio" className="btn btn--ghost">Voir les galeries<span className="btn__arrow">→</span></Link>
            </div>
          </div>

          <div className="about-portrait" data-reveal="right">
            <img src="/assets/images/portfolio/portraits-lifestyle-1.webp" alt="Portrait de Baya Hubert, photographe à Paris" loading="eager" decoding="async" width="340" height="425" />
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <header data-reveal>
            <p className="eyebrow">Le parti pris</p>
            <h2 className="section-title">Quatre engagements <em>tenus</em></h2>
          </header>
          <div className="about-values">
            {VALUES.map((v, i) => (
              <TiltCard key={v.t} className="card" intensity={5} data-reveal data-reveal-delay={i * 80}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <header data-reveal>
            <p className="eyebrow">Façon de travailler</p>
            <h2 className="section-title">Ce qui se passe <em>concrètement</em></h2>
          </header>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div className="timeline__item" key={t.y} data-reveal data-reveal-delay={i * 70}>
                <span className="timeline__year">{t.y}</span>
                <div>
                  <h3>{t.t}</h3>
                  <p>{t.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight stats-band">
        <div className="container stats-band__grid">
          {STATS.map((s, i) => (
            <div key={s.label} data-reveal data-reveal-delay={i * 70}>
              <Counter {...s} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
