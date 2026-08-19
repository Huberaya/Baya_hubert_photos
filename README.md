# Hubert Baya — Portfolio photographique

Refonte complète du portfolio de **Hubert Baya**, construite avec Next.js 16 (App Router), TypeScript et une direction artistique sombre, éditoriale et immersive.

## Expérience

- Hero futuriste 3D React Three Fiber avec noyau cinétique, orbites, photographies flottantes et parallaxe souris
- Interface HUD, grille perspective, scanlines et storytelling scroll piloté par GSAP
- Portfolio masonry filtrable avec **35 séries — 5 minimum par catégorie**
- 35 pages projet cinématiques, lightbox et navigation visuelle
- Page À propos éditoriale avec timeline et compteurs
- Services en cartes 3D avec déploiement plein écran
- Formulaire accessible avec validation API et envoi Resend optionnel
- Lenis, curseur custom, transitions de page, menu mobile et `prefers-reduced-motion`
- SEO complet : métadonnées, Open Graph, JSON-LD Photographer, sitemap et robots

## Lancer le projet

```bash
npm install
npm run dev
```

Production :

```bash
npm run typecheck
npm run build
npm start
```

## Personnalisation rapide

Les informations principales sont centralisées dans :

- `src/lib/constants.ts` — nom, ville, email, téléphone, navigation
- `src/data/projects.ts` — projets et galeries
- `src/data/services.ts` — prestations, tarifs et contenus
- `src/data/testimonials.ts` — témoignages
- `public/images/hubert/` — 18 photographies issues de l'album Google Photos fourni
- `public/images/editorial/` — placeholders éditoriaux locaux facilement remplaçables

Les images ont été converties en WebP. Next Image génère les variantes responsives/AVIF en production.

## Formulaire de contact

Copier `.env.example` vers `.env.local`, puis renseigner :

- `CONTACT_EMAIL`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`

Sans ces variables, l'API valide le formulaire en mode démonstration sans envoyer d'email. Les coordonnées actuelles dans `src/lib/constants.ts` sont des placeholders à remplacer avant mise en ligne.

## Crédits médias

- Photographies principales : Hubert Baya
- Placeholders catégories : Unsplash
- Vidéo de démonstration : Coverr, version web optimisée

## Déploiement

Le projet est compatible Vercel sans configuration supplémentaire. Ajouter les variables d'environnement dans les réglages du projet pour activer l'envoi d'emails.
