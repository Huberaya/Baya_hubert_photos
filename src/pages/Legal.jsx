import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { SITE } from '../data/content'

const SECTIONS = [
  {
    id: 'editeur',
    title: '1. Éditeur du site',
    body: (
      <>
        <p>Le site internet www.bayahubertphotos.com est édité par :</p>
        <ul>
          <li><strong>Nom & Prénom :</strong> Baya Hubert</li>
          <li><strong>Statut professionnel :</strong> Entrepreneur individuel / Photographe indépendant</li>
          <li><strong>Adresse de l'établissement :</strong> Paris, France</li>
          <li><strong>Numéro de SIRET :</strong> {SITE.siret}</li>
          <li><strong>Code APE/NAF :</strong> 7420Z — Activités photographiques</li>
          <li><strong>Adresse email :</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><strong>Téléphone :</strong> {SITE.phone}</li>
        </ul>
      </>
    ),
  },
  {
    id: 'publication',
    title: '2. Directeur de la publication',
    body: <p>Le Directeur de la publication du site internet est <strong>Baya Hubert</strong> en sa qualité d'éditeur et de responsable légal de l'activité.</p>,
  },
  {
    id: 'hebergement',
    title: '3. Hébergement du site',
    body: (
      <>
        <p>Ce site internet est propulsé et hébergé de manière sécurisée par la plateforme cloud :</p>
        <ul>
          <li><strong>Hébergeur :</strong> Vercel Inc.</li>
          <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
          <li><strong>Site internet :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a></li>
        </ul>
      </>
    ),
  },
  {
    id: 'propriete',
    title: '4. Propriété intellectuelle',
    body: (
      <>
        <p>
          L'ensemble du contenu présent sur ce site internet, incluant, de façon non limitative, les graphismes,
          images, textes, vidéos, logos et icônes, ainsi que leur mise en forme, sont la propriété exclusive de Baya
          Hubert, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
        </p>
        <p>
          Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle,
          de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Baya Hubert. Cette
          représentation ou reproduction, par quelque procédé que ce soit, constitue une contrefaçon sanctionnée par
          les articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </>
    ),
  },
  {
    id: 'litiges',
    title: '5. Litiges et juridiction',
    body: (
      <p>
        Les présentes conditions du site internet sont régies par les lois françaises et toute contestation ou litige
        qui pourrait naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des
        tribunaux sur lesquels dépend le siège social de l'entreprise (Paris, France).
      </p>
    ),
  },
]

export default function Legal() {
  return (
    <>
      <Seo title="Mentions légales" description="Mentions légales du site de Baya Hubert, photographe professionnel à Paris." path="/legal" />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Mentions légales</span>
          </nav>
          <p className="eyebrow" data-reveal>Informations légales</p>
          <h1 data-reveal data-reveal-delay="60">Mentions <em>légales</em></h1>
          <p className="lede" data-reveal data-reveal-delay="120">En vigueur au 18 août 2026.</p>
        </div>
      </header>

      <section className="section--tight">
        <div className="container legal-grid">
          <nav className="toc" aria-label="Sommaire">
            <h2>Sommaire</h2>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ol>
          </nav>
          <div className="prose">
            {SECTIONS.map((s, i) => (
              <section key={s.id} id={s.id} data-reveal data-reveal-delay={i * 50}>
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
