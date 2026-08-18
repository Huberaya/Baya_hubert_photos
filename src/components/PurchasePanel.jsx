import { createPortal } from 'react-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FORMATS, LICENSES, SHIPPING } from '../data/prints'
import { SITE } from '../data/content'

/* Panneau d'achat : récapitulatif honnête + demande de commande réellement envoyée
   (Formspree, déjà configuré). Le paiement en ligne reste à brancher. */
export default function PurchasePanel({ print, onClose }) {
  const [formatId, setFormatId] = useState('a4')
  const [qty, setQty] = useState(1)
  const [buyer, setBuyer] = useState({ name: '', email: '', note: '' })
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const format = useMemo(() => FORMATS.find((f) => f.id === formatId), [formatId])
  const isFile = formatId === 'file'
  const unit = Math.max(20, print.price + format.add)
  const total = unit * qty
  const license = isFile ? LICENSES.file : LICENSES.print

  useEffect(() => {
    document.body.classList.add('is-locked')
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!buyer.name.trim()) er.name = 'Indiquez votre nom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(buyer.email)) er.email = 'Adresse email invalide.'
    setErrors(er)
    if (Object.keys(er).length) return

    setState('sending')
    try {
      const res = await fetch(SITE.formspree, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Commande de tirage — ${print.title} (${format.label})`,
          Type: 'Demande de commande — galerie de tirages',
          Photographie: `${print.title} (réf. ${print.id})`,
          Format: `${format.label} — ${format.dims}`,
          Quantité: qty,
          'Prix unitaire': `${unit} $`,
          'Total hors frais de port': `${total} $`,
          Licence: license.title,
          Nom: buyer.name,
          Email: buyer.email,
          Message: buyer.note,
        }),
      })
      if (!res.ok) throw new Error('network')
      setState('sent')
    } catch {
      setState('error')
    }
  }

  return createPortal(
    <div className="buy" role="dialog" aria-modal="true" aria-labelledby="buy-title" ref={panelRef}>
      <div className="buy__backdrop" onClick={onClose} />

      <aside className="buy__panel">
        <button ref={closeRef} className="buy__close" onClick={onClose} aria-label="Fermer le panneau d'achat">✕</button>

        {state === 'sent' ? (
          <div className="buy__sent">
            <div className="form-success__check" aria-hidden="true">✓</div>
            <h2 id="buy-title">Demande de commande envoyée</h2>
            <p>
              Merci. Je vous réponds sous 24 h avec la confirmation de disponibilité, les frais de port exacts
              et le lien de règlement. Aucun montant n'a été débité à ce stade.
            </p>
            <div className="buy__recap-mini">
              <span>{print.title}</span>
              <span>{format.label} × {qty}</span>
              <strong>{total} $</strong>
            </div>
            <button className="btn btn--ghost btn--block" onClick={onClose}>Continuer à explorer la galerie</button>
          </div>
        ) : (
          <>
            <header className="buy__head">
              <img src={print.src.replace('/portfolio/', '/portfolio/thumbs/')} alt="" className="buy__thumb" />
              <div>
                <p className="eyebrow">Commander un tirage</p>
                <h2 id="buy-title">{print.title}</h2>
                <p className="buy__sub">{print.place} · {print.shot}</p>
              </div>
            </header>

            <section className="buy__section">
              <h3>1 · Choisir le format</h3>
              <div className="buy__formats" role="radiogroup" aria-label="Format du tirage">
                {FORMATS.map((f) => {
                  const p = Math.max(20, print.price + f.add)
                  return (
                    <button
                      key={f.id}
                      role="radio"
                      aria-checked={formatId === f.id}
                      className={`buy__format ${formatId === f.id ? 'is-active' : ''}`}
                      onClick={() => setFormatId(f.id)}
                    >
                      <span className="buy__format-top">
                        <strong>{f.label}</strong>
                        <em>{p} $</em>
                      </span>
                      <span className="buy__format-dims">{f.dims}</span>
                      <span className="buy__format-note">{f.note}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="buy__section">
              <h3>2 · Quantité</h3>
              <div className="buy__qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité">−</button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Augmenter la quantité">+</button>
              </div>
            </section>

            <section className="buy__section">
              <h3>3 · Ce que vous achetez</h3>
              <p className="buy__license-title">{license.title}</p>
              <ul className="buy__license">
                {license.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <dl className="buy__terms">
                {!isFile && (
                  <>
                    <div><dt>Fabrication</dt><dd>{SHIPPING.delay}</dd></div>
                    <div><dt>Expédition</dt><dd>{SHIPPING.method}</dd></div>
                    <div><dt>Frais de port</dt><dd>{SHIPPING.fees}</dd></div>
                  </>
                )}
                {isFile && <div><dt>Livraison</dt><dd>{SHIPPING.digital}</dd></div>}
              </dl>
            </section>

            <section className="buy__section buy__total">
              <div>
                <span>Total {isFile ? '' : 'hors frais de port'}</span>
                <strong>{total} $</strong>
              </div>
              <p className="buy__total-note">{unit} $ × {qty} — prix en dollars US.</p>
            </section>

            <div className="buy__notice" role="note">
              <strong>Paiement en ligne pas encore actif.</strong> Le règlement par carte (Stripe) n'est pas
              connecté sur ce site. Votre demande m'est transmise immédiatement par email : je confirme la
              disponibilité, les frais de port réels, puis je vous envoie un lien de paiement sécurisé.
              Aucun débit n'a lieu ici.
            </div>

            <form className="buy__form" onSubmit={submit} noValidate>
              <h3>4 · Vos coordonnées</h3>
              <div className={`field ${errors.name ? 'field--error' : ''}`}>
                <label className="field__label" htmlFor="buy-name">Nom complet <span>*</span></label>
                <input id="buy-name" className="input" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} placeholder="Jean Dupont" />
                {errors.name && <p className="field__error">{errors.name}</p>}
              </div>
              <div className={`field ${errors.email ? 'field--error' : ''}`}>
                <label className="field__label" htmlFor="buy-email">Email <span>*</span></label>
                <input id="buy-email" type="email" className="input" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} placeholder="jean.dupont@exemple.com" />
                {errors.email && <p className="field__error">{errors.email}</p>}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="buy-note">Précisions (encadrement, livraison, délai…)</label>
                <textarea id="buy-note" className="textarea" style={{ minHeight: 90 }} value={buyer.note} onChange={(e) => setBuyer({ ...buyer, note: e.target.value })} />
              </div>

              <button type="submit" className="btn btn--solid btn--block" disabled={state === 'sending'}>
                {state === 'sending' ? 'Envoi…' : 'Envoyer ma demande de commande'}
              </button>

              {state === 'error' && (
                <p className="form-status form-status--error" role="alert">
                  L'envoi a échoué. Écrivez-moi à <a className="link-underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              )}
            </form>
          </>
        )}
      </aside>
    </div>,
    document.body,
  )
}
