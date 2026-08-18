# PLAN DE PAGE — ACCUEIL UNIQUE (PORTFOLIO BAYA HUBERT)

## Section 1 : Le Hero Manifeste
*   **Rôle :** Capter l'attention immédiate du visiteur et asseoir le positionnement d'élite de Baya Hubert.
*   **Contenu réel :** Titre : "Saisir l'authentique, sublimer l'instant." (~5 mots). Manifeste : "Photographe professionnel à Paris. Je traduis l'essence de vos lieux, la singularité de vos collaborateurs et la poésie de vos célébrations en images fortes, contrastées et durables." (~28 mots).
*   **Mise en page & Motion :** Titre en `h1` (`--fs-xxl`), manifeste en `--fs-base`. Motion : Dévoilement des lignes du titre via un effet de masque et de translation de bas en haut (translateY 24px -> 0, opacité 0 -> 1) en `expo.out`.

## Section 2 : Le Curated Portfolio (Grille interactive)
*   **Rôle :** Faciliter la découverte des 5 univers visuels de Baya sans friction par un filtrage asynchrone.
*   **Contenu réel :** 15 photographies haute fidélité classées sous 5 boutons-onglets tactiles : *Food & Café, Urbain, Architecture, Nature, Portraits*.
*   **Mise en page & Motion :** Onglets de filtres en `--fs-xs` centré. Grille fluide `.grid` de cartes d'images au format portrait (aspect-ratio 4/5). Motion : Révélation de la grille en opacité, avec un effet de zoom arrière subtil sur l'image d'arrière-plan lors du survol de sa carte (hover state).

## Section 3 : Les Piliers d'Offres (Services)
*   **Rôle :** Afficher des tarifs transparents et segmenter les typologies de clients (B2B / B2C).
*   **Contenu réel :** 3 formules d'appel : Lieux & Goûts (Abonnement à 350 €/mois), Corporate & Événements (Demi-journée à partir de 800 €), Vie & Célébrations (Séance d'art à partir de 190 €).
*   **Mise en page & Motion :** En-tête de section en `h2` (`--fs-xl`), descriptions de cartes d'offres en `--fs-sm`. Motion : Entrée asymétrique décalée de chaque carte de service par rapport à la précédente (stagger de 0.08s).

## Section 4 : La Note d'Intention (À propos)
*   **Rôle :** Crédibiliser la démarche de l'artiste, détailler son équipement technique et localiser son intervention.
*   **Contenu réel :** Portrait de Baya à gauche. À droite : description courte de sa philosophie, de sa technique (boîtiers à double sauvegarde pour la sécurité des données) et de sa zone d'intervention (Paris & Île-de-France).
*   **Mise en page & Motion :** Portrait au format 4/5 à gauche. Texte d'identité à droite en `--fs-base`. Motion (**Unique moment signature de la page**) : L'image se révèle via une ouverture progressive de masque en diagonale au scroll (*clip-path* fluide).

## Section 5 : L'Envoi (Formulaire de Devis Qualifié)
*   **Rôle :** Transformer le visiteur qualifié en client actif en facilitant la saisie de ses besoins réels.
*   **Contenu réel :** Infos de contact et secteur à gauche. À droite, formulaire qualifié : Nom, Prénom, Email, Téléphone, Prestation, Date, Lieu, Budget, Personnes, Projet, RGPD.
*   **Mise en page & Motion :** Layout à double colonnes en `--fs-sm`. Formulaire en noir d'encre mat délimité par des bordures fines. Motion : Révélation classique d'entrée, transition asynchrone instantanée vers un écran de succès avec coche verte animée lors du clic de validation.
