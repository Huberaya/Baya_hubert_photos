# CLAUDE.md — LOI DU PROJET (BAYA HUBERT PORTFOLIO)

> Ce fichier régit l'intégralité des développements du projet. Tout ajout de code ou de contenu qui contredit ce document sera refusé.

## 1. LA STACK TECHNIQUE
*   **Plateforme & Hébergement :** Statique HTML5 / CSS3 / Vanilla JS déployé sur **Vercel** avec clean URLs.
*   **Moteur d'animation :** **GSAP 3** (GreenSock), centralisé, sans bibliothèque lourde de scroll-jacking.
*   **Pas de bundlers complexes :** Compilation directe, chargement asynchrone des assets.

## 2. DIRECTION ARTISTIQUE CHIRURGICALE

### Typographie (Zéro compromis, pas de fontes système basiques)
*   **Police de Titres (Serif) :** **`Cormorant Garamond`** (Editorial, théâtral, luxe).
*   **Police de Corps (Sans-Serif) :** **`Satoshi`** (Géométrique, épuré, moderne).
*   *Note :* Inter, Roboto, Arial, Open Sans et system-ui sont définitivement proscrits.

### Palette de Couleurs Real-Hex
*   **Fond (`--bg`) :** `#0f0e0c` (Noir chaud organique mat).
*   **Texte (`--text`) :** `#f5f2ec` (Off-white / Papier d'art doux).
*   **Muted (`--text-muted`) :** `#a8a296` (Gris doré atténué).
*   **Unique Accent (`--accent`) :** `#d9a441` (Or ambré chaud).
    *   *Règle d'Or :* Maximum 3 apparitions de l'accent `--accent` par page. Pas de dégradés.

### Contraintes d'Interface (UI)
*   **Pas d'ombres portées :** Bordures ultra-fines de couleur `--ligne` (`#2a2721`) uniquement.
*   **Pas de rounded-2xl :** Rayons de courbure de 12px à 14px maximum.
*   **Pas d'emoji ni de soupe d'icônes :** Usage exclusif d'indicateurs raffinés (comme `✦` ou des flèches SVG minimales).
*   **Une idée par écran :** Titres sous 8 mots, paragraphes manifestes sous 40 mots.

## 3. SYSTÈME DE MOTION (GSAP)
*   **Centralisation :** Un seul script global (`assets/js/main.js`) scanne le DOM et anime les attributs `data-anim`. Aucun tween écrit à la main dans les composants.
*   **Attributs d'animation supportés :**
    *   `data-anim="fade"` : Opacité 0 -> 1.
    *   `data-anim="reveal"` : Opacité 0 -> 1 + TranslateY 24px -> 0.
    *   `data-anim="scale"` : Transition d'échelle subtile.
*   **Timing & Easing :**
    *   **Durée :** 0.6s à 0.9s.
    *   **Easing :** `expo.out` ou `power3.out`.
    *   **Stagger :** 0.04s à 0.08s sur les éléments enfants.
*   **Accessibilité (Reduced Motion) :** Prise en compte de `prefers-reduced-motion: reduce` via `gsap.matchMedia()` pour afficher l'état final immédiatement sans animation.

## 4. BUDGET DE PERFORMANCE & SÉMANTIQUE
*   **Core Web Vitals :** LCP < 2s en 3G/4G, CLS < 0.05, INP < 200ms.
*   **Poids maximal JS :** < 250 Ko compressé.
*   **Sémantique :** Structure HTML5 (`header`, `main`, `section`, `footer`), balises de titres ordonnées (`h1` à `h3`), alt-text systématique, focus visible au clavier.

## 5. RÈGLES DE TRAVAIL (La Règle du Jeu)
1.  **Une étape par message.** Jamais de précipitation ou d'avance.
2.  **Zéro génération de contenu fictif :** Tout élément d'information manquant est demandé au client. Pas de Lorem Ipsum.
3.  **Toute modification de code ou style doit d'abord être validée contre ce document.**
