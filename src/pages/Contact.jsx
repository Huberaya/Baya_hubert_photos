import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Icon from '../components/Icon'
import { BUDGET_OPTIONS, SERVICE_OPTIONS, SERVICE_PARAM_MAP, SITE } from '../data/content'

const INITIAL = {
  lastname: '',
  firstname: '',
  email: '',
  phone: '',
  'service-type': '',
  'desired-date': '',
  location: '',
  budget: '',
  people: '',
  'project-desc': '',
  gdpr: false,
  _gotcha: '',
}

export default function Contact() {
  const [params] = useSearchParams()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | success | error
  const firstErrorRef = useRef(null)

  /* Préremplissage depuis ?service= (comportement conservé) */
  useEffect(() => {
    const p = params.get('service')
    if (!p) return
    const mapped = SERVICE_PARAM_MAP[p] || (SERVICE_OPTIONS.some((o) => o.value === p) ? p : '')
    if (mapped) setForm((f) => ({ ...f, 'service-type': mapped }))
  }, [params])

  const required = ['lastname', 'firstname', 'email', 'service-type', 'location', 'project-desc']
  const filled = useMemo(() => {
    const done = required.filter((k) => String(form[k]).trim().length > 0).length
    return (done + (form.gdpr ? 1 : 0)) / (required.length + 1)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    required.forEach((k) => {
      if (!String(form[k]).trim()) er[k] = 'Ce champ est obligatoire.'
    })
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = 'Adresse email invalide.'
    if (!form.gdpr) er.gdpr = 'Votre consentement est nécessaire pour traiter la demande.'
    return er
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) {
      const el = document.querySelector('[data-invalid="true"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.querySelector('input, select, textarea')?.focus()
      return
    }
    if (form._gotcha) return // bot

    setState('sending')
    try {
      const res = await fetch(SITE.formspree, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nom: form.lastname,
          Prénom: form.firstname,
          Email: form.email,
          Téléphone: form.phone,
          Prestation: SERVICE_OPTIONS.find((o) => o.value === form['service-type'])?.label || form['service-type'],
          'Date souhaitée': form['desired-date'],
          Lieu: form.location,
          Budget: form.budget,
          'Nombre de personnes': form.people,
          Projet: form['project-desc'],
          _subject: `Nouvelle demande de devis — ${form.firstname} ${form.lastname}`,
        }),
      })
      if (!res.ok) throw new Error('network')
      setState('success')
      setForm(INITIAL)
    } catch {
      setState('error')
    }
  }

  const fieldProps = (k) => ({
    className: `field ${errors[k] ? 'field--error' : ''}`,
    'data-invalid': errors[k] ? 'true' : undefined,
  })

  return (
    <>
      <Seo
        title="Contact & Devis"
        description="Demandez un devis photo gratuit à Paris : corporate, mariage, food, portrait ou événement. Réponse détaillée sous 24 h."
        path="/contact"
      />

      <header className="page-head">
        <div className="page-head__bg" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'ariane">
            <Link to="/">Accueil</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span>
          </nav>
          <p className="eyebrow" data-reveal>Devis gratuit & sans engagement</p>
          <h1 data-reveal data-reveal-delay="60">Qualifions <em>votre projet</em></h1>
          <p className="lede" data-reveal data-reveal-delay="120">
            Un devis détaillé vous sera envoyé sous 24 h. Plus vous m'en dites sur vos attentes logistiques et
            artistiques, plus la proposition sera juste.
          </p>
        </div>
      </header>

      <section className="section--tight">
        <div className="container contact-grid">
          <aside className="contact-panel glass" data-reveal="left">
            <h2>Parler à un humain</h2>
            <p>Pas de standard, pas de formulaire sans réponse : c'est moi qui lis et qui réponds.</p>
            <div className="contact-meta">
              <div className="contact-meta__item">
                <span className="contact-meta__icon" aria-hidden="true"><Icon name="pin" size={20} /></span>
                <div>
                  <h3>Secteur principal</h3>
                  <p>Paris intra-muros et départements 92, 93, 94. Déplacements ailleurs sur devis.</p>
                </div>
              </div>
              <div className="contact-meta__item">
                <span className="contact-meta__icon" aria-hidden="true"><Icon name="mail" size={20} /></span>
                <div>
                  <h3>Courriel direct</h3>
                  <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
                </div>
              </div>
              <div className="contact-meta__item">
                <span className="contact-meta__icon" aria-hidden="true"><Icon name="instagram" size={20} /></span>
                <div>
                  <h3>Instagram</h3>
                  <p><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">{SITE.instagramHandle}</a></p>
                </div>
              </div>
              <div className="contact-meta__item">
                <span className="contact-meta__icon" aria-hidden="true"><Icon name="clock" size={20} /></span>
                <div>
                  <h3>Délai de réponse</h3>
                  <p>Sous 24 h ouvrées, devis détaillé inclus.</p>
                </div>
              </div>
            </div>
          </aside>

          <div>
            {state === 'success' ? (
              <div className="card form-success" role="status" aria-live="polite">
                <div className="form-success__check" aria-hidden="true">✓</div>
                <h2>Votre demande a bien été transmise !</h2>
                <p>
                  Merci pour votre confiance. Je vais étudier en détail les caractéristiques de votre projet et je
                  m'engage à vous répondre sous un délai de 24 h maximum avec un devis détaillé ou des questions
                  complémentaires si nécessaire.
                </p>
                <div className="form-success__actions">
                  <Link to="/" className="btn btn--ghost">Retourner à l'accueil</Link>
                  <Link to="/portfolio" className="btn btn--ghost">Explorer le portfolio</Link>
                  <button className="btn btn--solid" onClick={() => setState('idle')}>Envoyer une autre demande</button>
                </div>
              </div>
            ) : (
              <form className="card form-card" onSubmit={onSubmit} noValidate data-reveal="right">
                <h2>Demander un devis gratuit</h2>
                <p className="form-card__hint">Les champs marqués d'une astérisque (*) sont obligatoires.</p>

                <div className="form-steps" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i}><i style={{ transform: `scaleX(${Math.max(0, Math.min(1, filled * 3 - i))})` }} /></span>
                  ))}
                </div>

                <input type="text" name="_gotcha" value={form._gotcha} onChange={set('_gotcha')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true" />

                <div className="form-grid">
                  <div className="form-grid form-grid--2">
                    <div {...fieldProps('lastname')}>
                      <label className="field__label" htmlFor="lastname">Nom <span>*</span></label>
                      <input className="input" id="lastname" name="lastname" autoComplete="family-name" value={form.lastname} onChange={set('lastname')} placeholder="Dupont" aria-invalid={!!errors.lastname} aria-describedby={errors.lastname ? 'err-lastname' : undefined} />
                      {errors.lastname && <p className="field__error" id="err-lastname">{errors.lastname}</p>}
                    </div>
                    <div {...fieldProps('firstname')}>
                      <label className="field__label" htmlFor="firstname">Prénom <span>*</span></label>
                      <input className="input" id="firstname" name="firstname" autoComplete="given-name" value={form.firstname} onChange={set('firstname')} placeholder="Jean" aria-invalid={!!errors.firstname} aria-describedby={errors.firstname ? 'err-firstname' : undefined} />
                      {errors.firstname && <p className="field__error" id="err-firstname">{errors.firstname}</p>}
                    </div>
                  </div>

                  <div className="form-grid form-grid--2">
                    <div {...fieldProps('email')}>
                      <label className="field__label" htmlFor="email">Adresse email <span>*</span></label>
                      <input className="input" id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="jean.dupont@exemple.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
                      {errors.email && <p className="field__error" id="err-email">{errors.email}</p>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="phone">Téléphone</label>
                      <input className="input" id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="06 12 34 56 78" />
                    </div>
                  </div>

                  <div {...fieldProps('service-type')}>
                    <label className="field__label" htmlFor="service-type">Type de prestation <span>*</span></label>
                    <select className="select" id="service-type" name="service-type" value={form['service-type']} onChange={set('service-type')} aria-invalid={!!errors['service-type']}>
                      <option value="">-- Sélectionnez une catégorie --</option>
                      {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {errors['service-type'] && <p className="field__error">{errors['service-type']}</p>}
                  </div>

                  <div className="form-grid form-grid--2">
                    <div className="field">
                      <label className="field__label" htmlFor="desired-date">Date souhaitée</label>
                      <input className="input" id="desired-date" name="desired-date" type="date" value={form['desired-date']} onChange={set('desired-date')} />
                    </div>
                    <div {...fieldProps('location')}>
                      <label className="field__label" htmlFor="location">Lieu de la prestation <span>*</span></label>
                      <input className="input" id="location" name="location" value={form.location} onChange={set('location')} placeholder="ex : Paris 11ème" aria-invalid={!!errors.location} />
                      {errors.location && <p className="field__error">{errors.location}</p>}
                    </div>
                  </div>

                  <div className="form-grid form-grid--2">
                    <div className="field">
                      <label className="field__label" htmlFor="budget">Budget indicatif</label>
                      <select className="select" id="budget" name="budget" value={form.budget} onChange={set('budget')}>
                        <option value="">-- Sélectionnez une tranche --</option>
                        {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="people">Nombre de personnes (si applicable)</label>
                      <input className="input" id="people" name="people" type="number" min="0" inputMode="numeric" value={form.people} onChange={set('people')} placeholder="ex : 12" />
                    </div>
                  </div>

                  <div {...fieldProps('project-desc')}>
                    <label className="field__label" htmlFor="project-desc">Description de votre projet <span>*</span></label>
                    <textarea className="textarea" id="project-desc" name="project-desc" value={form['project-desc']} onChange={set('project-desc')} placeholder="Décrivez votre projet (horaires, styles, volume d'images attendues)…" aria-invalid={!!errors['project-desc']} />
                    {errors['project-desc'] && <p className="field__error">{errors['project-desc']}</p>}
                  </div>

                  <div className={errors.gdpr ? 'field--error' : ''} data-invalid={errors.gdpr ? 'true' : undefined}>
                    <label className="checkbox">
                      <input type="checkbox" checked={form.gdpr} onChange={set('gdpr')} aria-invalid={!!errors.gdpr} />
                      <span className="checkbox__box" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="12" height="12"><path d="M2 8.5l4 4 8-9" fill="none" stroke="#17130a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span>
                        En soumettant ce formulaire, j'accepte que les informations saisies soient exploitées dans le
                        cadre exclusif de ma demande de devis et de la relation commerciale qui peut en découler,
                        conformément à la <Link to="/confidentialite">politique de confidentialité</Link>. *
                      </span>
                    </label>
                    {errors.gdpr && <p className="field__error">{errors.gdpr}</p>}
                  </div>

                  <button type="submit" className="btn btn--solid btn--block" disabled={state === 'sending'} ref={firstErrorRef}>
                    {state === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande de devis'}
                  </button>

                  {state === 'error' && (
                    <p className="form-status form-status--error" role="alert">
                      L'envoi a échoué. Réessayez, ou écrivez-moi directement à{' '}
                      <a className="link-underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
