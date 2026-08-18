import { useEffect } from 'react'
import { SITE } from '../data/content'

/* Met à jour title/description/canonical/OG sans dépendance externe */
export default function Seo({ title, description, path = '/', image = '/assets/images/portfolio/food-cafe-1.webp', noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — Photographe à Paris`
    document.title = fullTitle

    const setMeta = (attr, key, value) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    const url = `${SITE.url}${path === '/' ? '/' : path}`
    const img = image.startsWith('http') ? image : `${SITE.url}${image}`

    if (description) setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    if (description) setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', fullTitle)
    if (description) setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [title, description, path, image, noindex])

  return null
}
