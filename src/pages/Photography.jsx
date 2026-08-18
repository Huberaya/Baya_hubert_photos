import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PrintViewer from '../components/PrintViewer'
import PurchasePanel from '../components/PurchasePanel'
import { Aurora } from '../components/ui'
import { PLACEHOLDERS, PRINTS, PRINT_CATEGORIES, FORMATS, SHIPPING } from '../data/prints'
import { SITE } from '../data/content'

const label = (id) => PRINT_CATEGORIES.find((c) => c.id === id)?.label || id

/* Parallaxe très légère sur chaque plaque : l'image respire, le texte reste net */
function useParallax(ref, strength = 40) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
        el.style.setProperty('--py', `${Math.max(-1, Math.min(1, p)) * strength}px`)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref, strength])
}

function Slab({ print, i, onView, onBuy }) {
  const ref = useRef(null)
  useParallax(ref, 46)
  const flip = i % 2 === 1

  return (
    <article ref={ref} className={`slab slab--${print.orientation} ${flip ? 'slab--flip' : ''}`} id={print.id}>
      <div className="slab__media" data-reveal="scale">
        <button className="slab__imgbtn" onClick={onView} aria-label={`Voir en grand : ${print.title}`}>
          <img
            src={print.src}
            srcSet={`${print.src.replace('/portfolio/', '/portfolio/thumbs/')} 420w, ${print.src} 1000w`}
            sizes="(max-width: 900px) 92vw, 46vw"
            alt={`${print.title} — ${label(print.category)}, tirage d'art de Baya Hubert, ${print.place}`}
            width={print.w}
            height={print.h}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <span className="slab__sheen" aria-hidden="true" />
          <span className="slab__hint" aria-hidden="true">Voir en grand ↗</span>
        </button>
        <span className="slab__num" aria-hidden="true">{print.n}</span>
      </div>

      <div className="slab__text">
        <p className="eyebrow" data-reveal>{label(print.category)}</p>
        <h2 className="slab__title" data-reveal data-reveal-delay="60">{print.title}</h2>
        <p className="slab__short" data-reveal data-reveal-delay="100">{print.short}</p>
        <p className="slab__desc" data-reveal data-reveal-delay="140">{print.desc}</p>

        <dl className="slab__specs" data-reveal data-reveal-delay="180">
          <div><dt>Lieu</dt><dd>{print.place}</dd></div>
          <div><dt>Prise de vue</dt><dd>{print.shot}</dd></div>
          <div><dt>Formats</dt><dd>A4 · 40×50 · 60×80 · fichier HD</dd></div>
        </dl>

        <div className="slab__foot" data-reveal data-reveal-delay="220">
          <span className="slab__price">
            <em>à partir de</em>
            {print.price} $
          </span>
          <div className="slab__actions">
            <button className="btn btn--solid" onClick={onBuy}>Acheter</button>
            <button className="btn btn--ghost" onClick={onView}>Voir la photo<span className="btn__arrow">↗</span></button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Photography() {
  const [filter, setFilter] = useState('all')
  const [viewer, setViewer] = useState(-1)
  const [buying, setBuying] = useState(null)

  const list = useMemo(
    () => (filter === 'all' ? PRINTS : PRINTS.filter((p) => p.category === filter)),
    [filter],
  )

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Tirages d’art — Baya Hubert',
      itemListElement: PRINTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.title,
          description: p.short,
          image: `${SITE.url}${p.src}`,
          brand: { '@type': 'Brand', name: 'Baya Hubert' },
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/PreOrder',
            url: `${SITE.url}/photographie#${p.id}`,
          },
        },
      })),
    }),
    [],
  )

  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(el)
    return () => el.remove()
  }, [jsonLd])

  const hero = PRINTS[0]

  return (
    <>
      <Seo
        title="Tirages d'art à vendre | Galerie photographique"
        description="Galerie de tirages d'art signés Baya Hubert : scènes urbaines, architecture, nature et culinaire. Dix photographies disponibles en tirage fine art ou fichier haute définition, de 30 à 100 $."
        path="/photographie"
        image={hero.src}
      />

      {/* ---------- OUVERTURE PLEIN ÉCRAN ---------- */}
      <header className="gal-hero">
        <div className="gal-hero__bg" aria-hidden="true">
          <img src={PRINTS[0].src} alt="" fetchPriority="high" decoding="async" />
          <img src={PRINTS[3].src} alt="" className="gal-hero__bg2" decoding="async" />
        </div>
        <div className="gal-hero__veil" aria-hidden="true" />
        <Aurora />
        <div className="container gal-hero__in">
          <p className="eyebrow">Collection · 10 pièces</p>
          <h1 className="display gal-hero__title">
            La galerie.<br /><em>Des tirages à emporter.</em>
          </h1>
          <p className="gal-hero__lede">
            Dix photographies choisies pour vivre sur un mur : tirage fine art sur papier mat 310 g/m²
            ou fichier haute définition. De 30 à 100 $, réalisées à la commande.
          </p>
          <div className="gal-hero__actions">
            <a href="#collection" className="btn btn--solid">Explorer la collection</a>
            <Link to="/contact" className="btn btn--ghost">Commande sur mesure<span className="btn__arrow">→</span></Link>
          </div>
          <ul className="gal-hero__facts">
            <li><strong>310 g/m²</strong><span>papier fine art mat</span></li>
            <li><strong>4 formats</strong><span>A4 → 60 × 80 cm</span></li>
            <li><strong>5-8 j</strong><span>fabrication à la commande</span></li>
          </ul>
        </div>
        <div className="gal-hero__scroll" aria-hidden="true"><span /></div>
      </header>

      {PLACEHOLDERS && (
        <div className="gal-flag" role="note">
          <strong>Visuels provisoires.</strong> Le compte Instagram @baya_hubert n'est pas lisible
          automatiquement (mur de connexion) : les images ci-dessous sont celles déjà présentes dans le projet.
          Elles seront remplacées par les photographies définitives — titres, prix et parcours d'achat sont, eux, opérationnels.
        </div>
      )}

      {/* ---------- FILTRES ---------- */}
      <section className="section--tight" id="collection">
        <div className="container">
          <div className="filters" style={{ marginTop: 0 }} role="tablist" aria-label="Filtrer la collection">
            {PRINT_CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={filter === c.id}
                className={`filter ${filter === c.id ? 'is-active' : ''}`}
                onClick={() => setFilter(c.id)}
              >
                <span>{c.label}</span>
                <em>{c.id === 'all' ? PRINTS.length : PRINTS.filter((p) => p.category === c.id).length}</em>
              </button>
            ))}
          </div>
          <p className="filters__hint" aria-live="polite">
            {list.length} photographie{list.length > 1 ? 's' : ''} · prix de {Math.min(...list.map((p) => p.price))} à {Math.max(...list.map((p) => p.price))} $
          </p>
        </div>
      </section>

      {/* ---------- LA COLLECTION ---------- */}
      <div className="slabs">
        {list.map((p, i) => (
          <Slab
            key={p.id}
            print={p}
            i={i}
            onView={() => setViewer(i)}
            onBuy={() => setBuying(p)}
          />
        ))}
      </div>

      {/* ---------- MODALITÉS ---------- */}
      <section className="section gal-terms">
        <div className="container">
          <header className="head-center" data-reveal>
            <p className="eyebrow eyebrow--center">Acheter un tirage</p>
            <h2 className="section-title">Simple, <em>et sans zone d'ombre</em></h2>
          </header>

          <div className="gal-terms__grid">
            <div className="card" data-reveal>
              <h3>Formats & prix</h3>
              <ul className="gal-terms__list">
                {FORMATS.map((f) => (
                  <li key={f.id}><strong>{f.label}</strong><span>{f.dims}</span><em>{f.add === 0 ? 'prix de base' : f.add > 0 ? `+${f.add} $` : `${f.add} $`}</em></li>
                ))}
              </ul>
            </div>
            <div className="card" data-reveal data-reveal-delay="80">
              <h3>Fabrication & livraison</h3>
              <p>{SHIPPING.delay}</p>
              <p>{SHIPPING.method}</p>
              <p><strong>{SHIPPING.fees}</strong></p>
            </div>
            <div className="card" data-reveal data-reveal-delay="160">
              <h3>Droits d'usage</h3>
              <p>Les tirages et fichiers sont vendus pour un <strong>usage personnel et décoratif</strong>. La reproduction, la revente et l'exploitation commerciale restent exclues.</p>
              <p>Besoin d'une licence commerciale, d'un usage print ou publicitaire ? <Link to="/contact" className="link-underline">Demandez un devis</Link>.</p>
            </div>
            <div className="card card--featured" data-reveal data-reveal-delay="240">
              <h3>Paiement</h3>
              <p>
                Le règlement par carte n'est <strong>pas encore actif</strong> sur le site. Votre demande de
                commande m'est transmise par email : je confirme la disponibilité et les frais de port, puis
                je vous envoie un lien de paiement sécurisé.
              </p>
              <p className="text-muted">Intégration Stripe Checkout prévue — voir la documentation du projet.</p>
            </div>
          </div>
        </div>
      </section>

      {viewer >= 0 && (
        <PrintViewer
          prints={list}
          index={viewer}
          onClose={() => setViewer(-1)}
          onNav={(d) => setViewer((i) => (i + d + list.length) % list.length)}
          onBuy={(p) => { setViewer(-1); setBuying(p) }}
        />
      )}

      {buying && <PurchasePanel print={buying} onClose={() => setBuying(null)} />}
    </>
  )
}
