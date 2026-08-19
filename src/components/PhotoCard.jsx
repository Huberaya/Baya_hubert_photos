import { CATEGORY_LABEL } from '../data/content'
import { TiltCard } from './ui'

export default function PhotoCard({ photo, onOpen, index = 0, priority = false }) {
  return (
    <TiltCard
      className="photo"
      intensity={7}
      data-reveal="scale"
      data-reveal-delay={(index % 6) * 60}
    >
      <button className="photo__btn" onClick={onOpen} aria-label={`Agrandir : ${photo.title} — ${CATEGORY_LABEL[photo.category]}`}>
        <span className="photo__frame">
          <img
            src={photo.src}
            srcSet={`${photo.src.replace('/gallery/', '/gallery/thumbs/')} 420w, ${photo.src} 1000w`}
            sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 300px"
            alt={`${photo.title} — photographie ${CATEGORY_LABEL[photo.category]} par Baya Hubert`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="340"
            height="425"
          />
          <span className="photo__sheen" aria-hidden="true" />
        </span>

        <span className="photo__overlay">
          <span className="photo__cat">{CATEGORY_LABEL[photo.category]}</span>
          <span className="photo__title">{photo.title}</span>
          <span className="photo__meta">
            <em>{photo.place}</em>
            <em>{photo.camera}</em>
          </span>
          <span className="photo__exif">
            {photo.aperture && <span>{photo.aperture}</span>}
            {photo.shutter && <span>{photo.shutter}</span>}
            {photo.iso && <span>ISO {photo.iso}</span>}
          </span>
          <span className="photo__zoom" aria-hidden="true">Agrandir ↗</span>
        </span>
      </button>
    </TiltCard>
  )
}
