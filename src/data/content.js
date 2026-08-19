/* Données centralisées — issues du site existant (contenus préservés) */

export const SITE = {
  name: 'Baya Hubert',
  baseline: "Saisir l'authentique, sublimer l'instant",
  email: 'contact@bayahubertphotos.com',
  phone: '+33 6 12 34 56 78',
  instagram: 'https://instagram.com/baya_hubert',
  instagramHandle: '@baya_hubert',
  zone: 'Paris & Île-de-France',
  siret: '823 456 789 00012',
  url: 'https://baya-hubert-photos.vercel.app',
  formspree: 'https://formspree.io/f/xbjnygzo',
}

export const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/photographie', label: 'Photographie' },
  { to: '/services', label: 'Services & Tarifs' },
  { to: '/apropos', label: 'À propos' },
]

export const CATEGORIES = [
  { id: 'all', label: 'Tous', desc: "L'intégralité de la sélection" },
  { id: 'rue', label: 'Rue & Instantanés', desc: 'scènes de vie, passants, mouvement' },
  { id: 'archi', label: 'Architecture & Lignes', desc: 'escaliers, verrières, perspectives' },
  { id: 'nuit', label: 'Nuit & Lumières', desc: 'heure bleue, tunnels, néons' },
  { id: 'nature', label: 'Nature & Saisons', desc: 'paysages, eau, arbres' },
  { id: 'scene', label: 'Scène & Culture', desc: 'concerts, danse, carnaval' },
]

const G = '/assets/images/gallery'

export const PHOTOS = [
  { id: 'rue-1', src: `${G}/rue-1.webp`, category: 'rue', title: 'Traversée', place: 'Paris', light: 'Lumière du jour', focal: 'Noir et blanc' },
  { id: 'rue-2', src: `${G}/rue-2.webp`, category: 'rue', title: 'Envol', place: 'Place de Paris', light: 'Contraste franc', focal: 'Instantané' },
  { id: 'rue-3', src: `${G}/rue-3.webp`, category: 'rue', title: "Sortie d'escalier", place: 'Paris', light: 'Plein jour', focal: 'Scène de rue' },
  { id: 'archi-1', src: `${G}/archi-1.webp`, category: 'archi', title: 'Vertige', place: 'Paris', light: 'Lumière zénithale', focal: 'Plongée verticale' },
  { id: 'archi-2', src: `${G}/archi-2.webp`, category: 'archi', title: 'Verrière', place: 'Gare, Paris', light: 'Contre-jour', focal: 'Structure métallique' },
  { id: 'archi-3', src: `${G}/archi-3.webp`, category: 'archi', title: 'Nef', place: 'Paris', light: 'Lumière latérale', focal: 'Perspective' },
  { id: 'nuit-1', src: `${G}/nuit-1.webp`, category: 'nuit', title: 'Tunnel', place: 'Périphérique', light: 'Nuit', focal: 'Pose lente' },
  { id: 'nuit-2', src: `${G}/nuit-2.webp`, category: 'nuit', title: 'Rue basse', place: 'Paris', light: 'Éclairage urbain', focal: 'Noir et blanc' },
  { id: 'nuit-3', src: `${G}/nuit-3.webp`, category: 'nuit', title: 'Heure bleue', place: 'Grands boulevards', light: 'Crépuscule', focal: 'Couleur' },
  { id: 'nature-1', src: `${G}/nature-1.webp`, category: 'nature', title: 'Estuaire', place: 'Vue aérienne', light: 'Soleil bas', focal: 'Noir et blanc' },
  { id: 'nature-2', src: `${G}/nature-2.webp`, category: 'nature', title: 'Pont de pierre', place: 'Parc', light: 'Ombre douce', focal: 'Paysage' },
  { id: 'nature-3', src: `${G}/nature-3.webp`, category: 'nature', title: 'Hiver', place: 'Île-de-France', light: 'Ciel couvert', focal: 'Saison' },
  { id: 'scene-1', src: `${G}/scene-1.webp`, category: 'scene', title: 'Ensemble', place: 'Scène, Paris', light: 'Lumière de scène', focal: 'Reportage' },
  { id: 'scene-2', src: `${G}/scene-2.webp`, category: 'scene', title: 'Solo', place: 'Scène, Paris', light: 'Poursuite', focal: 'Clair-obscur' },
  { id: 'scene-3', src: `${G}/scene-3.webp`, category: 'scene', title: 'Voix', place: 'Concert', light: 'Contre-jour', focal: 'Live' },
]

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

/* ---- Piliers de service (repris de index.html + services.html) ---- */
export const OFFERS = [
  {
    id: 'lieux-gouts',
    pillar: 'Pilier 1',
    icon: 'cup',
    title: 'Lieux & Goûts',
    price: '350 €',
    unit: '/ mois',
    param: 'abonnement',
    desc: "La formule idéale pour les restaurateurs et commerçants de quartier souhaitant animer leurs réseaux sociaux.",
    features: [
      '1 shooting par mois sur place (1h30)',
      '15 à 20 photos retouchées',
      '2 courtes vidéos Reels montées',
      'Droits web & réseaux inclus',
    ],
    cta: "Réserver l'abonnement",
  },
  {
    id: 'corporate',
    pillar: 'Pilier 2',
    icon: 'briefcase',
    title: 'Corporate & Événementiel',
    price: 'À partir de 800 €',
    unit: '',
    param: 'corporate',
    featured: true,
    desc: 'Valorisez le savoir-faire de votre entreprise et couvrez vos séminaires, conférences ou portraits pros.',
    features: [
      "Reportage complet sur site d'une demi-journée",
      'Trombinoscope & portraits de collaborateurs',
      'Livraison express sous 5 jours',
      'Droits de diffusion commerciale inclus',
    ],
    cta: 'Demander un devis pro',
  },
  {
    id: 'celebrations',
    pillar: 'Pilier 3',
    icon: 'sparkle',
    title: 'Vie & Célébrations',
    price: 'À partir de 190 €',
    unit: '',
    param: 'portrait',
    desc: "Immortalisez vos plus beaux moments d'émotion : mariages, séances portraits d'art, couples ou famille.",
    features: [
      "Shooting d'une heure à Paris",
      'Sélection sécurisée sur galerie privée',
      '12 photos finement retouchées',
      'Une approche naturelle et spontanée',
    ],
    cta: 'Réserver mon shooting',
  },
]

/* ---- Détail complet des prestations (services.html) ---- */
export const SERVICE_GROUPS = [
  {
    id: 'pro',
    pillar: 'Pilier 2',
    title: 'Corporate & Événementiel',
    intro:
      'Un service sur mesure pour les entreprises, séminaires, concerts, festivals, et séances de portraits professionnels.',
    items: [
      {
        tag: 'Pour les professionnels', icon: 'briefcase',
        title: 'Formule Entreprise & Événements',
        price: 'À partir de 800 €',
        param: 'corporate',
        desc: "Mettez en avant le capital humain de votre structure : trombinoscope professionnel de vos collaborateurs, reportages en situation de travail pour votre marque employeur, ou couverture de vos congrès, assemblées et conférences.",
        features: [
          'Demie-journée ou journée complète de prises de vue',
          'Galerie en ligne partagée sécurisée pour vos équipes',
          'Cession complète de droits de diffusion interne & externe',
          'Facturation claire par devis préalable détaillé',
        ],
        cta: 'Demander un devis sur mesure',
      },
      {
        tag: 'Culture & Réseaux', icon: 'sparkle',
        title: 'Festivals, Concerts & Marque',
        price: 'Sur Devis',
        param: 'evenement',
        desc: "La photographie de scène et d'événement exige réactivité et gestion des conditions de faible luminosité. Je couvre vos lancements de produits, défilés, concerts ou festivals de musique avec du matériel de pointe adapté.",
        features: [
          'Reportage live réactif et livraison express',
          "Traitement colorimétrique adapté à l'univers visuel",
          'Photos prêtes pour les communiqués de presse (RP)',
          'Prises de vues d’ambiance et des coulisses',
        ],
        cta: 'Détailler mon projet événementiel',
      },
    ],
  },
  {
    id: 'c2c',
    pillar: 'Pilier 3',
    title: 'Vie & Célébrations',
    intro:
      "Parce que les moments forts méritent d'être immortalisés, je vous accompagne pour vos mariages, fêtes familiales ou portraits d'art individuels.",
    items: [
      {
        tag: 'Portrait & mode', icon: 'camera',
        title: 'Shooting Portrait & Mode',
        price: 'À partir de 190 €',
        param: 'portrait',
        desc: "Idéal pour les portfolios d'artistes, les mannequins, la création de contenu personnel ou pour simplement se faire plaisir.",
        features: [
          "Séance d'une heure à Paris (extérieur ou intérieur)",
          '12 photos numériques finement éditées',
          'Conseils de pose et de tenues en amont',
          'Galerie privée de sélection sécurisée',
        ],
        cta: 'Réserver mon shooting',
      },
      {
        tag: 'Couple & famille', icon: 'heart',
        title: 'Séance Couple & Famille',
        price: 'À partir de 280 €',
        param: 'famille',
        desc: "Saisissez l'instant partagé : une promenade, un moment complice capturé de façon totalement naturelle et décontractée.",
        features: [
          'Prises de vues sur le lieu de votre choix (1h30)',
          '20 clichés retouchés haute définition',
          'Une expérience joyeuse guidée mais spontanée',
          "Impression d'art en option",
        ],
        cta: 'Réserver une séance couple/famille',
      },
      {
        tag: 'Mariage', icon: 'rings',
        title: 'Reportages Mariage',
        price: 'À partir de 1 200 €',
        param: 'mariage',
        desc: "Une présence attentive et discrète pour raconter l'histoire complète de votre plus beau jour, des préparatifs au bal.",
        features: [
          'Couverture sur mesure selon vos envies',
          'Rencontres préparatoires incluses',
          'Centaines d’images retouchées livrées sur clé USB',
          'Galerie en ligne gratuite pour vos invités',
        ],
        cta: 'Consulter les formules',
      },
    ],
  },
]

/* ---- FAQ (services.html) ---- */
export const FAQ = [
  {
    q: 'Quels sont les délais de livraison des images ?',
    a: "Pour les séances portraits et les abonnements mensuels, les photos sont livrées sous 5 jours ouvrés. Pour les mariages et les grands événements d'entreprise, comptez entre 10 et 15 jours ouvrés, le temps de trier et de retoucher chaque cliché avec le plus grand soin.",
  },
  {
    q: "Cédez-vous les droits d'utilisation des photos ?",
    a: "Oui, toutes mes prestations incluent par défaut des droits d'utilisation pour le web, les réseaux sociaux et la communication interne. Pour les campagnes publicitaires d'envergure, l'affichage urbain ou l'édition papier commerciale (print), des droits d'auteur spécifiques et proportionnels au support sont facturés en option dans le devis.",
  },
  {
    q: 'Fournissez-vous les fichiers bruts (RAW) ?',
    a: "Non, je ne livre jamais les fichiers bruts non retouchés. Le travail de post-traitement (colorimétrie, contrastes, cadrages, ambiance lumineuse) constitue la moitié de mon identité artistique. Livrer des fichiers RAW équivaudrait à livrer un plat de restaurant non cuit !",
  },
  {
    q: "Que se passe-t-il s'il pleut le jour du shooting en extérieur ?",
    a: "Pour les reportages en extérieur, nous faisons un point météo 48 h avant la séance. En cas d'intempéries majeures, nous reportons le shooting à la date disponible la plus proche sans aucun frais supplémentaire.",
  },
]

/* ---- Étapes de la méthode (nouvelle narration, valorise l'existant) ---- */
export const PROCESS = [
  {
    n: '01',
    title: 'Cadrage du besoin',
    desc: "On échange sur votre univers, vos usages (web, réseaux, print) et le volume d'images attendu. Un devis détaillé part sous 24 h.",
    meta: 'Sous 24 h',
  },
  {
    n: '02',
    title: 'Repérage & lumière',
    desc: "J'étudie le lieu, l'orientation, les heures de lumière naturelle. Aucun flash artificiel imposé : on compose avec le réel.",
    meta: 'Avant J-2',
  },
  {
    n: '03',
    title: 'La séance',
    desc: "Direction douce, rythme calme, double sauvegarde sur site. On cherche la vérité d'un regard, pas la pose forcée.",
    meta: '1 h à 1 journée',
  },
  {
    n: '04',
    title: 'Édition & colorimétrie',
    desc: "Tri, cadrage, contrastes, ambiance : la moitié de l'identité artistique se joue ici. Vous recevez des fichiers prêts à publier.",
    meta: '5 à 15 jours',
  },
  {
    n: '05',
    title: 'Livraison sécurisée',
    desc: 'Galerie privée en ligne, formats adaptés à chaque support, droits d’utilisation clairement encadrés dans le devis.',
    meta: 'Galerie privée',
  },
]

export const STATS = [
  { value: 1200, suffix: '+', label: 'clichés livrés', desc: 'sur les 24 derniers mois' },
  { value: 24, suffix: ' h', label: 'délai de devis', desc: 'réponse détaillée garantie' },
  { value: 5, suffix: ' univers', label: 'de prise de vue', desc: 'du plat au portrait' },
  { value: 100, suffix: ' %', label: 'lumière naturelle', desc: 'aucune image générée par IA' },
]

export const SERVICE_OPTIONS = [
  { value: 'food-cafe', label: 'Food & Café (Restaurant, culinaire, artisans)' },
  { value: 'corporate', label: "Corporate (Trombinoscope, reportage entreprise)" },
  { value: 'mariage', label: 'Mariage & Cérémonies' },
  { value: 'evenement-pro', label: 'Événement professionnel (Séminaire, conférence)' },
  { value: 'evenement-prive', label: 'Événement privé (Anniversaire, fête)' },
  { value: 'portrait-lifestyle', label: 'Portrait & Lifestyle (Individuel, couple, famille)' },
  { value: 'immobilier', label: 'Immobilier, Architecture & Produit' },
  { value: 'autre', label: 'Autre demande sur mesure' },
]

export const BUDGET_OPTIONS = [
  'Moins de 300 €',
  '300 € – 600 €',
  '600 € – 1 500 €',
  'Plus de 1 500 €',
  "Non défini / En attente d'estimation",
]

/* Mapping ?service= → valeur du select (comportement conservé de contact.html) */
export const SERVICE_PARAM_MAP = {
  decouverte: 'food-cafe',
  abonnement: 'food-cafe',
  premium: 'food-cafe',
  'lieux-gouts': 'food-cafe',
  corporate: 'corporate',
  evenement: 'evenement-pro',
  portrait: 'portrait-lifestyle',
  famille: 'portrait-lifestyle',
  mariage: 'mariage',
  celebrations: 'portrait-lifestyle',
  entreprise: 'corporate',
}
