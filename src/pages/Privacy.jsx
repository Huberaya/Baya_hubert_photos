import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { SITE } from '../data/content'

const SECTIONS = [
  {
    id: 'collecte',
    title: '1. Introduction & Collecte des données',
    body: (
      <>
        <p>
          Dans le cadre de l'exploitation de mon activité de photographe professionnel, je suis amené à traiter des
          données personnelles vous concernant (notamment votre nom, prénom, adresse email, numéro de téléphone et
          détails du projet) lors de votre demande de devis en ligne sur la page de contact.
        </p>
        <p>
          En soumettant le formulaire de contact, vous consentez de manière libre et éclairée au traitement de ces
          informations afin de me permettre de qualifier vos besoins et de formuler une proposition tarifaire (devis)
          adaptée.
        </p>
      </>
    ),
  },
  {
    id: 'utilisation',
    title: '2. Utilisation des données collectées',
    body: (
      <>
        <p>Les données que vous me transmettez font l'objet d'un traitement informatique destiné exclusivement à :</p>
        <ul>
          <li>L'établissement et l'envoi de votre devis de photographie sur mesure.</li>
          <li>La prise de contact téléphonique ou électronique pour préciser les détails logistiques et artistiques de la séance.</li>
          <li>Le suivi de la relation commerciale (factures, galeries privées sécurisées de livraison).</li>
        </ul>
        <p>
          Vos données personnelles ne sont en aucun cas revendues, louées ou transmises à des tiers ou des partenaires
          commerciaux à des fins de prospection ou de marketing.
        </p>
      </>
    ),
  },
  {
    id: 'conservation',
    title: '3. Durée de conservation des données',
    body: (
      <p>
        Si la demande de devis n'aboutit pas à une collaboration commerciale, vos données personnelles sont supprimées
        de mon fichier d'échange sous un délai maximum de 1 an après le dernier contact. Si nous collaborons, vos
        informations de contact et d'échange sont archivées dans le cadre de la gestion clients pour les obligations
        légales de facturation pendant une durée de 10 ans.
      </p>
    ),
  },
  {
    id: 'securite',
    title: '4. Sécurité de vos informations',
    body: (
      <p>
        Je mets en œuvre toutes les mesures techniques et organisationnelles appropriées (hébergement cloud chiffré
        SSL, serveurs sécurisés Vercel, accès restreint et personnel) pour préserver la sécurité de vos informations
        personnelles et empêcher qu'elles ne soient divulguées, modifiées ou détruites de manière accidentelle ou
        illicite.
      </p>
    ),
  },
  {
    id: 'droits',
    title: '5. Vos droits (RGPD)',
    body: (
      <>
        <p>Conformément à la réglementation européenne en vigueur (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> savoir quelles informations me concernant sont conservées.</li>
          <li><strong>Droit de rectification :</strong> demander la mise à jour ou la modification d'une information incorrecte.</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression définitive de vos données personnelles de mes fichiers.</li>
          <li><strong>Droit à la limitation du traitement :</strong> restreindre temporairement l'utilisation de vos données.</li>
        </ul>
        <p>
          Pour exercer l'un de ces droits, il vous suffit de m'adresser un e-mail à l'adresse suivante :{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. J'y répondrai sous un délai réglementaire maximal de 1 mois.
        </p>
      </>
    ),
  },
]

export default function Privacy() {
  return (
    <>
      <Seo
        title="Politique de confidentialité"
        description="Politique de confidentialité et traitement des données personnelles (RGPD) du site de Baya Hubert, photographe à Paris."
        path="/confidentialite"
      />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Confidentialité</span>
          </nav>
          <p className="eyebrow" data-reveal>RGPD</p>
          <h1 data-reveal data-reveal-delay="60">Politique de <em>confidentialité</em></h1>
          <p className="lede" data-reveal data-reveal-delay="120">
            Dernière mise à jour : 18 août 2026. Cette politique détaille la manière dont sont traitées les
            informations personnelles soumises via les formulaires de ce site.
          </p>
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
