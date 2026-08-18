import { useEffect, useCallback, useRef } from 'react'
import { CATEGORY_LABEL } from '../data/content'

export default function Lightbox({ photos, index, onClose, onNav }) {
  const closeRef = useRef(null)
  const photo = photos[index]

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
      if (e.key === 'Tab') {
        // piège de focus simple : garde le focus dans la modale
        e.preventDefault()
        closeRef.current?.focus()
      }
    },
    [onClose, onNav],
  )

  useEffect(() => {
    document.body.classList.add('is-locked')
    window.addEventListener('keydown', handleKey)
    closeRef.current?.focus()
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleKey])

  if (!photo) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${photo.title} — ${CATEGORY_LABEL[photo.category]}`}>
      <div className="lightbox__backdrop" onClick={onClose} />
      <div className="lightbox__stage">
        <figure className="lightbox__figure">
          <img src={photo.src} alt={`${photo.title} — ${CATEGORY_LABEL[photo.category]}, par Baya Hubert`} />
          <figcaption>
            <div>
              <span className="badge badge--gold">{CATEGORY_LABEL[photo.category]}</span>
              <h2>{photo.title}</h2>
            </div>
            <dl className="lightbox__meta">
              <div><dt>Lieu</dt><dd>{photo.place}</dd></div>
              <div><dt>Lumière</dt><dd>{photo.light}</dd></div>
              <div><dt>Optique</dt><dd>{photo.focal}</dd></div>
            </dl>
          </figcaption>
        </figure>

        <button ref={closeRef} className="lightbox__close" onClick={onClose} aria-label="Fermer la visionneuse">✕</button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={() => onNav(-1)} aria-label="Image précédente">←</button>
        <button className="lightbox__nav lightbox__nav--next" onClick={() => onNav(1)} aria-label="Image suivante">→</button>
        <div className="lightbox__counter">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</div>
      </div>
    </div>
  )
}
