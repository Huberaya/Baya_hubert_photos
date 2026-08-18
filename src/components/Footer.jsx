import { Link } from 'react-router-dom'
import { NAV, SITE } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="footer__cta" data-reveal>
          <p className="eyebrow">Prochaine étape</p>
          <h2 className="section-title">
            Parlons de vos <em>images</em>.
          </h2>
          <p className="lede mx-auto text-center">
            Un devis détaillé sous 24 h, sans engagement. Dites-moi simplement ce que vous voulez montrer.
          </p>
          <div className="footer__cta-actions">
            <Link to="/contact" className="btn btn--solid">Demander un devis gratuit</Link>
            <Link to="/portfolio" className="btn btn--ghost">Explorer le portfolio<span className="btn__arrow">→</span></Link>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <div className="brand brand--footer">
              Baya <em>Hubert</em>
            </div>
            <p className="text-muted">
              Photographe professionnel basé à Paris, capturant l'essence des lieux, la singularité des parcours
              et la poésie des moments partagés.
            </p>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="badge badge--gold">
              {SITE.instagramHandle}
            </a>
          </div>

          <div className="footer__col">
            <h3>Sitemap</h3>
            <ul>
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
              ))}
              <li><Link to="/contact">Demander un devis</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>Contact & Réseaux</h3>
            <ul>
              <li>Zone : {SITE.zone}</li>
              <li>Instagram : <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">{SITE.instagramHandle}</a></li>
              <li>Email : <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>Informations</h3>
            <ul>
              <li><Link to="/legal">Mentions légales</Link></li>
              <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
              <li><Link to="/services#faq">Questions fréquentes</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 {SITE.name} — Tous droits réservés. SIRET : {SITE.siret}</span>
          <span className="footer__made">Lumière naturelle · Aucune image générée par IA</span>
        </div>
      </div>
    </footer>
  )
}
