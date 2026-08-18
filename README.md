# Baya Hubert — Refonte immersive (v2)

Refonte complète du site `Huberaya/Baya_hubert_photos` en **expérience immersive** :
Vite + React 19 + React Three Fiber (Three.js) + Lenis, sans perte de fonctionnalité.

---

## 1. Démarrer

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # génère /dist
npm run preview   # sert /dist
```

---

## 2. Ce qui a été conservé (aucune régression)

| Fonctionnalité d'origine | État dans la v2 |
|---|---|
| Routes `/`, `/portfolio`, `/services`, `/apropos`, `/contact`, `/legal`, `/confidentialite` | ✅ identiques (React Router, `cleanUrls` conservé) |
| Filtres du portfolio (6 catégories, 15 clichés) | ✅ + compteur par catégorie, 2 dispositions, visionneuse plein écran |
| Formulaire de devis → **Formspree `xbjnygzo`** | ✅ mêmes champs + validation inline, honeypot `_gotcha`, écran de succès, repli e-mail en cas d'échec |
| Préremplissage `/contact?service=...` | ✅ même table de correspondance (`decouverte`, `abonnement`, `premium`, `corporate`, `evenement`, `portrait`, `famille`…) |
| Tarifs, formules, FAQ, textes légaux, RGPD | ✅ textes repris mot pour mot (`src/data/content.js`) |
| SEO : title/description/canonical/OG/Twitter par page, JSON-LD LocalBusiness, sitemap, robots | ✅ + méta dynamiques par route |
| Favicons, images WebP, hébergement Vercel | ✅ |

**Bugs de l'ancien site corrigés** : balises non fermées dans `index.html` (`</div>` orphelin, `<button>` fermé par `</div>`), pages `portfolio.html` / `apropos.html` tronquées (contenu principal manquant), commentaires « TODO » visibles dans le HTML livré.

---

## 3. Direction artistique

**Concept : « la chambre de lumière ».** L'écran est un boîtier : un diaphragme d'objectif en 3D
respire au centre, les photographies orbitent autour, la poussière lumineuse flotte dans le faisceau.

- **Palette** : nocturne chaud (`#08070a` → `#211d29`), or (`#d8b26a`), accents violet et cyan.
- **Typographie** : Cormorant Garamond (display, italique doré) + Plus Jakarta Sans (UI).
- **Matière** : verre dépoli, grain argentique animé, halos, filets 1 px.

### Design system — `src/styles/system.css`
Tokens : couleurs, échelle typographique fluide (`clamp`), espacements fluides, rayons, ombres,
courbes d'easing, durées. Composants : `.btn` (solid / ghost / block, spotlight au survol),
`.card`, `.glass`, `.badge`, `.field` / `.input` / `.select` / `.textarea` / `.checkbox`,
`.accordion`, `.compare` (tableau), `[data-reveal]`.

---

## 4. Animations & interactions

| Effet | Où | Détail |
|---|---|---|
| Scène WebGL | Hero | Diaphragme 9 lames qui s'ouvre/se ferme, 6 photos en orbite, 900 particules, caméra réactive à la souris |
| Fondu contextuel 3D | Hero | Les clichés s'effacent en passant devant la colonne de texte (lisibilité prioritaire) |
| Scroll fluide | Global | Lenis (désactivé sur tactile / faible puissance / `prefers-reduced-motion`) |
| Révélation au scroll | Global | IntersectionObserver unique + MutationObserver (pages lazy) + filet de sécurité |
| Cartes 3D « tilt » | Photos, offres, valeurs | Rotation X/Y suivant le curseur, sheen diagonal, remontée des métadonnées |
| Compteurs animés | Statistiques | Easing cubique, déclenché à l'entrée dans le viewport |
| Anneau de progression | Méthode | Étape active synchronisée au scroll (sticky) |
| Transition de page | Navigation | Rideau en 4 colonnes + fondu montant |
| Curseur lumineux | Desktop | Anneau amorti + point net, réactif aux zones cliquables |
| Micro-interactions | Boutons, filtres, liens, accordéon | Spotlight radial, soulignés animés, flèches |

---

## 5. Performance

- **Code-splitting** : chaque page en `lazy()`, Three.js dans un chunk séparé chargé **après** le premier rendu (260 ms) et **uniquement si** WebGL est disponible.
- **Budget mesuré (build de prod, Chromium)** : FCP ≈ 320–460 ms · JS critique ≈ 90 kB gz · CSS 10 kB gz.
- **Images** : vignettes 420 px générées (`assets/images/portfolio/thumbs/`, 260 kB au total contre 996 kB) utilisées en `srcSet` et comme textures 3D ; `loading="lazy"` + `width`/`height` (CLS ≈ 0).
- **Adaptation automatique** : détection `hardwareConcurrency` / `deviceMemory` / `saveData` / pointeur → 3 paliers (`low` / `mid` / `high`) pilotant DPR, antialiasing, densité de particules, effets de flou et grain.
- **Rendu suspendu** hors écran et onglet inactif (`frameloop="never"`).
- **Repli 2D** (iris CSS animé + photo) si WebGL absent ou `prefers-reduced-motion`.

---

## 6. Accessibilité

Lien d'évitement, focus visibles, nav clavier complète (visionneuse : ←/→/Échap, focus piégé),
`aria-expanded`/`aria-controls` sur le menu et l'accordéon, `role="tab"`+`aria-selected` sur les filtres,
`aria-live` sur les compteurs de résultats et l'état du formulaire, un seul `h1` par page,
`inert` sur le panneau mobile fermé, alternatives textuelles descriptives, respect de `prefers-reduced-motion`.

---

## 7. Contrôles automatisés effectués

Playwright sur 7 routes × desktop/mobile : 0 erreur console applicative, 0 image cassée,
0 contrôle sans nom accessible, 0 bloc resté invisible, filtres/visionneuse/menu/formulaire vérifiés
(validation, préremplissage, succès), test en `prefers-reduced-motion` (repli 2D confirmé).

---

## 8. Déploiement Vercel

`vercel.json` fournit les *rewrites* SPA (indispensables : les URL sont désormais gérées côté client),
le cache immuable sur `/assets/*` et les en-têtes de sécurité.

```
Build Command    : npm run build
Output Directory : dist
```

---

## 9. À personnaliser avant mise en ligne

- SIRET réel, téléphone et adresse (`src/data/content.js` → `SITE`, pages légales).
- Remplacer les images de démonstration par les photographies définitives (mêmes noms de fichiers,
  puis relancer la génération des vignettes).
- Vérifier l'identifiant Formspree si le compte change (`SITE.formspree`).
