/* =========================================================
   TIRAGES D'ART — catalogue de la page /photographie
   ---------------------------------------------------------
   Photographies de Baya Hubert, importées depuis son album
   Google Photos (publications Instagram @baya_hubert).
   Fichiers : /public/assets/images/prints/ (+ thumbs/ 420 px)
   ========================================================= */

export const PLACEHOLDERS = false

export const PRINT_CATEGORIES = [
  { id: 'all', label: 'Toutes' },
  { id: 'graphique', label: 'Graphique & Abstrait' },
  { id: 'architecture', label: 'Architecture & Lignes' },
  { id: 'urbain', label: 'Rue & Instantanés' },
  { id: 'nature', label: 'Nature & Paysage' },
]

/* Formats proposés — le prix affiché correspond au format d'entrée (A4). */
export const FORMATS = [
  { id: 'a4', label: 'Tirage A4', dims: '21 × 29,7 cm', add: 0, note: 'Papier fine art mat 310 g/m²' },
  { id: '40x50', label: 'Tirage 40 × 50', dims: '40 × 50 cm', add: 45, note: 'Papier fine art mat 310 g/m², marges blanches' },
  { id: '60x80', label: 'Tirage 60 × 80', dims: '60 × 80 cm', add: 110, note: 'Édition limitée à 15 exemplaires, signée et numérotée' },
  { id: 'file', label: 'Fichier numérique', dims: 'Pleine résolution', add: -10, note: 'JPEG haute définition, sRGB — usage personnel' },
]

export const LICENSES = {
  print: {
    title: 'Tirage — usage décoratif personnel',
    points: [
      'Usage privé et décoratif uniquement',
      'Revente, reproduction et exploitation commerciale exclues',
      'Droits d’auteur conservés par Baya Hubert',
    ],
  },
  file: {
    title: 'Fichier numérique — licence personnelle',
    points: [
      'Impression personnelle et usage privé illimités',
      'Publication commerciale, revente et cession à un tiers exclues',
      'Licence commerciale ou publicitaire disponible sur devis',
    ],
  },
}

const IMG = '/assets/images/prints'

export const PRINTS = [
  {
    id: 'canal-reflets', n: '01', title: 'Canal, reflets', category: 'urbain', price: 100,
    src: `${IMG}/canal-reflets.webp`, w: 1080, h: 829, orientation: 'paysage',
    place: 'Amsterdam', shot: 'Fin d’hiver · noir et blanc',
    short: 'Les façades se répètent à l’envers dans l’eau noire.',
    desc: "Les maisons alignées, les péniches amarrées et les branches nues se dédoublent dans le canal, jusqu'à ce qu'on ne sache plus quel côté regarder. Une image dense, qui se lit longtemps, et dont le contraste soutient parfaitement le grand format.",
    why: 'La pièce maîtresse de la collection : profondeur, matière et lecture inépuisable.',
  },
  {
    id: 'verriere', n: '02', title: 'Verrière', category: 'architecture', price: 90,
    src: `${IMG}/verriere.webp`, w: 1080, h: 810, orientation: 'paysage',
    place: 'Station, Paris', shot: 'Lumière zénithale · noir et blanc',
    short: 'Une nervure de verre au-dessus des marches.',
    desc: "La coque vitrée s'ouvre en éventail au-dessus de l'escalier ; les voyageurs montent de part et d'autre, minuscules sous la structure. Symétrie franche, lumière blanche, géométrie contemporaine : l'image la plus architecturale de la série.",
    why: 'Géométrie et lumière — parfait pour un intérieur moderne ou un espace de travail.',
  },
  {
    id: 'voie-de-nuit', n: '03', title: 'Voie de nuit', category: 'urbain', price: 80,
    src: `${IMG}/voie-de-nuit.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Paris', shot: 'Tombée du jour · noir et blanc',
    short: 'La chaussée file droit, la ville s’allume.',
    desc: "Le pointillé de la voie conduit l'œil jusqu'au fond du cadre, entre l'auvent sombre du premier plan et les immeubles haussmanniens qui prennent la dernière lumière. Le calme d'une ville juste avant la nuit.",
    why: 'Perspective puissante et ciel travaillé : très fort en format carré.',
  },
  {
    id: 'eclaboussure', n: '04', title: 'Éclaboussure', category: 'graphique', price: 70,
    src: `${IMG}/eclaboussure.webp`, w: 1080, h: 810, orientation: 'paysage',
    place: 'Atelier', shot: 'Instant figé · noir et blanc',
    short: 'Deux mains, de l’eau en suspension, rien d’autre.',
    desc: "Le geste est saisi à la milliseconde : les gouttes se détachent en constellation sur un fond noir absolu. Une image franchement abstraite, la plus inattendue de la collection, qui fonctionne comme une respiration au milieu d'un accrochage.",
    why: 'Pièce singulière, très remarquée : l’image qu’on regarde en dernier et dont on se souvient.',
  },
  {
    id: 'nef', n: '05', title: 'Nef', category: 'architecture', price: 60,
    src: `${IMG}/nef.webp`, w: 1080, h: 1350, orientation: 'portrait',
    place: 'Église, Paris', shot: 'Lumière intérieure · noir et blanc',
    short: 'Les arcs s’enchaînent jusqu’au fond du chœur.',
    desc: "Colonnes, chapiteaux et voûtes se répètent en enfilade et compriment la perspective. La lumière tombe des bas-côtés, les luminaires ponctuent la travée : une image de silence, verticale, qui impose son calme.",
    why: 'Patrimoine et profondeur, sans effet : une valeur sûre en format vertical.',
  },
  {
    id: 'pave-mouille', n: '06', title: 'Pavé mouillé', category: 'urbain', price: 50,
    src: `${IMG}/pave-mouille.webp`, w: 1080, h: 1350, orientation: 'portrait',
    place: 'Rue commerçante', shot: 'Après l’averse · noir et blanc',
    short: 'La rue est vide, les pavés brillent encore.',
    desc: "L'eau reste dans les joints et renvoie la lumière du ciel ; les devantures fuient vers le fond, personne ne passe. Le grain du pavé occupe le premier plan et donne à l'ensemble sa texture particulière.",
    why: 'Ambiance immédiate et intemporelle — le tirage le plus facile à placer.',
  },
  {
    id: 'grille-et-passage', n: '07', title: 'Grille et passage', category: 'graphique', price: 45,
    src: `${IMG}/grille-et-passage.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Paris', shot: 'Lumière du jour · noir et blanc',
    short: 'Une ferronnerie, des bandes blanches, un axe parfait.',
    desc: "Le portail ouvragé est cadré de face, les bandes du passage clouté viennent buter au premier plan comme un clavier. Deux motifs qui n'ont rien à voir et qui, alignés, composent une image d'une rigueur inattendue.",
    why: 'Composition graphique nette, excellente en pendant d’« Éclaboussure ».',
  },
  {
    id: 'pont-au-crepuscule', n: '08', title: 'Pont au crépuscule', category: 'nature', price: 40,
    src: `${IMG}/pont-au-crepuscule.webp`, w: 1440, h: 1080, orientation: 'paysage',
    place: 'Bord de fleuve', shot: 'Soleil couchant · noir et blanc',
    short: 'Le soleil s’accroche une dernière fois aux câbles.',
    desc: "Le pont suspendu se réduit à sa silhouette pendant que le soleil perce entre les piles et déchire les nuages. Le seul point lumineux de l'image suffit à tenir tout le cadre.",
    why: 'Image émotionnelle et lisible de loin, idéale en horizontal.',
  },
  {
    id: 'passage-couvert', n: '09', title: 'Passage couvert', category: 'architecture', price: 35,
    src: `${IMG}/passage-couvert.webp`, w: 1080, h: 1350, orientation: 'portrait',
    place: 'Passage parisien', shot: 'Lumière mixte · noir et blanc',
    short: 'Une galerie de verre, ses lampes et son perspective.',
    desc: "La verrière en berceau file jusqu'au fond du passage, les suspensions ponctuent la marche et les vitrines renvoient une lumière douce. Un Paris couvert, feutré, que l'on traverse sans lever la tête.",
    why: 'Beaucoup de détail pour un petit prix : parfait en couloir ou en entrée.',
  },
  {
    id: 'double-courbe', n: '10', title: 'Double courbe', category: 'graphique', price: 30,
    src: `${IMG}/double-courbe.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Escalier public, Paris', shot: 'Contre-plongée · noir et blanc',
    short: 'Deux rampes qui s’enroulent au bas des marches.',
    desc: "Les mains courantes descendent en s'incurvant et coupent la trame régulière des marches ; deux passants montent au loin, dos tourné. Un exercice de ligne pure, très efficace en petit format.",
    why: 'Épure et rythme — le point d’entrée dans la collection.',
  },
]

/* Frais et modalités — volontairement présentés comme « à confirmer »
   tant que la logistique et le paiement ne sont pas branchés. */
export const SHIPPING = {
  method: 'Expédition sous tube rigide ou pochette renforcée, avec suivi.',
  delay: 'Tirage réalisé à la commande : 5 à 8 jours ouvrés avant expédition.',
  fees: 'Frais de port confirmés dans la réponse à votre demande (selon format et destination).',
  digital: 'Fichier numérique : lien de téléchargement envoyé sous 24 h après règlement.',
}
