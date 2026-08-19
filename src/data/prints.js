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
    id: 'escalier-spirale', n: '01', title: 'Vertige', category: 'architecture', price: 100,
    src: `${IMG}/escalier-spirale.webp`, w: 1080, h: 1338, orientation: 'portrait',
    place: 'Paris', shot: 'Plongée verticale · lumière naturelle',
    short: 'Un escalier qui s’enroule sur lui-même, vu du dessus.',
    desc: "La cage d'escalier photographiée à l'aplomb : les volées s'emboîtent en spirale jusqu'au sol, la rampe dessine une ellipse parfaite. Une image de vertige contrôlé, à la géométrie immédiatement lisible, qui tient un mur seule.",
    why: 'Composition la plus forte de la collection — impact maximal en grand format.',
  },
  {
    id: 'lumiere-jaune', n: '02', title: 'Lumière jaune', category: 'graphique', price: 90,
    src: `${IMG}/lumiere-jaune.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Installation lumineuse', shot: 'Contre-jour · silhouette',
    short: 'Une silhouette découpée dans un mur de néons.',
    desc: "Panneaux verticaux saturés, un corps en contre-jour réduit à sa découpe : tout le sujet tient dans l'opposition du noir et du jaune. La seule image franchement colorée de la série, et la plus contemporaine.",
    why: 'Couleur pure et graphisme radical — idéale dans un intérieur sobre.',
  },
  {
    id: 'colonnade-ombres', n: '03', title: 'Colonnade', category: 'architecture', price: 80,
    src: `${IMG}/colonnade-ombres.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Paris', shot: 'Soleil rasant · noir et blanc',
    short: 'Le soleil traverse les colonnes et allonge les passants.',
    desc: "Sous la galerie, la lumière entre par la tranche et projette des barres d'ombre régulières. Les passants deviennent des accents dans une partition. Rythme, contraste, et cette sensation d'instant volé propre à la photographie de rue.",
    why: 'Rythme lumineux et présence humaine anonyme : très facile à vivre.',
  },
  {
    id: 'estuaire', n: '04', title: 'Estuaire', category: 'nature', price: 70,
    src: `${IMG}/estuaire.webp`, w: 720, h: 720, orientation: 'carre',
    place: 'Vue aérienne', shot: 'Soleil bas · noir et blanc',
    short: 'De l’eau, du sable et un soleil qui rase l’horizon.',
    desc: "Depuis le hublot, les chenaux dessinent des veines argentées dans les bancs de sable et le soleil pose un point blanc sur la ligne d'horizon. Un paysage réduit à ses valeurs : c'est l'image la plus calme de la collection.",
    why: 'Palette douce et abstraite, s’intègre partout.',
  },
  {
    id: 'coupole', n: '05', title: 'Coupole', category: 'architecture', price: 60,
    src: `${IMG}/coupole.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Paris', shot: 'Regard vertical · lumière ambiante',
    short: 'Le plafond peint, cadré comme un vitrail.',
    desc: "Caissons dorés, fresque centrale, symétrie tenue au millimètre : la photographie regarde vers le haut et transforme l'architecture en motif. Les ors et les bleus donnent à cette pièce une chaleur inhabituelle dans la série.",
    why: 'Densité de détails qui récompense l’agrandissement.',
  },
  {
    id: 'ombres-portees', n: '06', title: 'Ombres portées', category: 'graphique', price: 50,
    src: `${IMG}/ombres-portees.webp`, w: 1080, h: 833, orientation: 'paysage',
    place: 'Paris', shot: 'Fin de journée · noir et blanc',
    short: 'Les personnages ont disparu, restent leurs ombres.',
    desc: "Le cadrage abandonne les corps pour ne garder que leur projection sur le bitume. Deux silhouettes étirées, un sol granuleux, rien d'autre. Une image sur le fil de l'abstraction, où le sujet se devine plus qu'il ne se voit.",
    why: 'Abstraction accessible — fonctionne en série avec « Colonnade ».',
  },
  {
    id: 'quai-sous-le-pont', n: '07', title: 'Sous le pont', category: 'urbain', price: 45,
    src: `${IMG}/quai-sous-le-pont.webp`, w: 1080, h: 886, orientation: 'paysage',
    place: 'Quais de Seine, Paris', shot: 'Contre-jour · noir et blanc',
    short: 'La voûte encadre le quai et ceux qui le remontent.',
    desc: "Depuis l'ombre de l'arche, la lumière du quai devient une fuite blanche où les promeneurs se détachent en silhouettes. Le pont sert de cadre naturel : l'œil est conduit sans effort vers le fond de l'image.",
    why: 'Paris reconnaissable sans être touristique.',
  },
  {
    id: 'escalier-canal', n: '08', title: 'Escalier du canal', category: 'architecture', price: 40,
    src: `${IMG}/escalier-canal.webp`, w: 1080, h: 1080, orientation: 'carre',
    place: 'Canal, Paris', shot: 'Symétrie frontale · noir et blanc',
    short: 'Une perspective centrale, presque trop parfaite.',
    desc: "Marches, rambardes et passerelle s'alignent sur un axe unique ; une silhouette minuscule remonte au centre et donne l'échelle. La rigueur de la construction fait tout le travail.",
    why: 'Symétrie franche, très efficace en petit et moyen format.',
  },
  {
    id: 'pave-mouille', n: '09', title: 'Pavé mouillé', category: 'urbain', price: 35,
    src: `${IMG}/pave-mouille.webp`, w: 1080, h: 1350, orientation: 'portrait',
    place: 'Rue pavée, Paris', shot: 'Après l’averse · noir et blanc',
    short: 'La rue vide, juste après la pluie.',
    desc: "Les pavés retiennent l'eau et renvoient la lumière du ciel, les devantures s'alignent en fuyant vers le fond. Une image d'atmosphère, sans personne, qui laisse toute la place au grain de la ville.",
    why: 'Ambiance immédiate — le tirage d’entrée le plus polyvalent.',
  },
  {
    id: 'courbe-de-rails', n: '10', title: 'Courbe de rails', category: 'graphique', price: 30,
    src: `${IMG}/courbe-de-rails.webp`, w: 1080, h: 1350, orientation: 'portrait',
    place: 'Voie ferrée urbaine', shot: 'Ligne de fuite · noir et blanc',
    short: 'Deux lignes qui s’incurvent et s’en vont.',
    desc: "Le rail capte la lumière et trace une courbe blanche dans le ballast sombre. Sujet minimal, lecture instantanée : le petit format parfait pour un couloir ou un bureau.",
    why: 'Épure assumée, parfaite en petit format.',
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
