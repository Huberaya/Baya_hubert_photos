import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PRINT_CATEGORIES } from '../data/prints'

const catLabel = (id) => PRINT_CATEGORIES.find((c) => c.id === id)?.label || id

/* Visionneuse plein écran : zoom au clic, panoramique au pointeur, navigation clavier */
export default function PrintViewer({ prints, index, onClose, onNav, onBuy }) {
  const print = prints[index]
  const [zoom, setZoom] = useState(false)
  const closeRef = useRef(null)
  const frameRef = useRef(null)

  const onKey = useCallback(
    (e) => {
      if (e.key === 'Escape') return zoom ? setZoom(false) : onClose()
      if (e.key === 'ArrowRight') { setZoom(false); onNav(1) }
      if (e.key === 'ArrowLeft') { setZoom(false); onNav(-1) }
      if (e.key === 'z' || e.key === 'Z') setZoom((z) => !z)
    },
    [onClose, onNav, zoom],
  )

  useEffect(() => {
    document.body.classList.add('is-locked')
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [onKey])

  useEffect(() => setZoom(false), [index])

  const onMove = (e) => {
    if (!zoom || !frameRef.current) return
    const r = frameRef.current.getBoundingClientRect()
    frameRef.current.style.setProperty('--ox', `${((e.clientX - r.left) / r.width) * 100}%`)
    frameRef.current.style.setProperty('--oy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  if (!print) return null

  return createPortal(
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`${print.title} — tirage d'art`}>
      <div className="viewer__backdrop" onClick={onClose} />

      <header className="viewer__bar">
        <span className="viewer__count">{print.n} / {String(prints.length).padStart(2, '0')}</span>
        <div className="viewer__bar-actions">
          <button className="viewer__chip" onClick={() => setZoom((z) => !z)} aria-pressed={zoom}>
            {zoom ? 'Réduire' : 'Zoom'} <kbd>Z</kbd>
          </button>
          <button ref={closeRef} className="viewer__chip viewer__chip--close" onClick={onClose} aria-label="Fermer la visionneuse">
            Fermer <kbd>Échap</kbd>
          </button>
        </div>
      </header>

      <div className="viewer__stage">
        <button className="viewer__arrow viewer__arrow--prev" onClick={() => onNav(-1)} aria-label="Photographie précédente">←</button>

        <figure
          className={`viewer__figure ${zoom ? 'is-zoomed' : ''} viewer__figure--${print.orientation}`}
          ref={frameRef}
          onMouseMove={onMove}
        >
          <button
            type="button"
            className="viewer__imgbtn"
            onClick={() => setZoom((z) => !z)}
            aria-label={zoom ? 'Réduire la photographie' : 'Agrandir la photographie'}
          >
            <img src={print.src} alt={`${print.title} — ${catLabel(print.category)}, photographie de Baya Hubert (${print.place})`} width={print.w} height={print.h} />
          </button>
        </figure>

        <button className="viewer__arrow viewer__arrow--next" onClick={() => onNav(1)} aria-label="Photographie suivante">→</button>
      </div>

      <footer className={`viewer__meta ${zoom ? 'is-dimmed' : ''}`}>
        <div className="viewer__meta-in">
          <div>
            <span className="badge badge--gold">{catLabel(print.category)}</span>
            <h2>{print.title}</h2>
            <p>{print.short}</p>
            <p className="viewer__tech">{print.place} · {print.shot}</p>
          </div>
          <div className="viewer__buy">
            <span className="viewer__price">{print.price} $<em>à partir de</em></span>
            <button className="btn btn--solid" onClick={() => onBuy(print)}>Acheter ce tirage</button>
          </div>
        </div>

        <div className="viewer__thumbs" role="tablist" aria-label="Autres photographies">
          {prints.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === index}
              aria-label={p.title}
              className={`viewer__thumb ${i === index ? 'is-active' : ''}`}
              onClick={() => onNav(i - index)}
            >
              <img src={p.src.replace('/portfolio/', '/portfolio/thumbs/')} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </footer>
    </div>,
    document.body,
  )
}
