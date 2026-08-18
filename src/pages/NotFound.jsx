import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { Aurora } from '../components/ui'

export default function NotFound() {
  return (
    <>
      <Seo title="Page introuvable" description="Cette page n'existe pas ou a été déplacée." path="/404" noindex />
      <section className="nf">
        <Aurora />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow eyebrow--center" style={{ justifyContent: 'center' }}>Hors cadre</p>
          <div className="nf__code">404</div>
          <h1 className="section-title" style={{ marginTop: 0 }}>Ce cliché n'existe pas</h1>
          <p className="lede mx-auto text-center">
            La page que vous cherchez a été déplacée ou n'a jamais été développée. Revenons à la lumière.
          </p>
          <div className="nf__actions">
            <Link to="/" className="btn btn--solid">Retour à l'accueil</Link>
            <Link to="/portfolio" className="btn btn--ghost">Voir le portfolio<span className="btn__arrow">→</span></Link>
          </div>
        </div>
      </section>
    </>
  )
}
