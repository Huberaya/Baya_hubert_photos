import { createPortal } from 'react-dom'
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

  return createPortal(
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

            {/* Fiche technique complète */}
            <div className="lightbox__specs">
              <dl className="lightbox__meta">
                <div><dt>Lieu</dt><dd>{photo.place}</dd></div>
                <div><dt>Date</dt><dd>{photo.date ? new Date(photo.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</dd></div>
                <div><dt>Lumière</dt><dd>{photo.light}</dd></div>
                <div><dt>Focale</dt><dd>{photo.focal}</dd></div>
              </dl>

              <dl className="lightbox__exif">
                <div><dt>Boîtier</dt><dd>{photo.camera}</dd></div>
                <div><dt>Objectif</dt><dd>{photo.lens}</dd></div>
                <div><dt>Ouverture</dt><dd>{photo.aperture}</dd></div>
                <div><dt>Vitesse</dt><dd>{photo.shutter}</dd></div>
                <div><dt>ISO</dt><dd>{photo.iso}</dd></div>
                <div><dt>Format</dt><dd>{photo.format}</dd></div>
                <div><dt>Traitement</dt><dd>{photo.style}</dd></div>
              </dl>

              {photo.story && (
                <p className="lightbox__story">{photo.story}</p>
              )}
            </div>
          </figcaption>
        </figure>

        <button ref={closeRef} className="lightbox__close" onClick={onClose} aria-label="Fermer la visionneuse">✕</button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={() => onNav(-1)} aria-label="Image précédente">←</button>
        <button className="lightbox__nav lightbox__nav--next" onClick={() => onNav(1)} aria-label="Image suivante">→</button>
        <div className="lightbox__counter">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</div>
      </div>
    </div>,
    document.body,
  )
}
