/**
 * src/theme/colors.ts
 *
 * Définition des thèmes de couleurs de l'application.
 *
 * Ce fichier contient deux thèmes complets :
 * - lightTheme : thème clair avec des tons beiges chauds et accueillants
 * - darkTheme : thème sombre avec des tons vert foncé pour un confort visuel nocturne
 *
 * Les thèmes suivent une palette de couleurs cohérente inspirée de l'univers culinaire
 * avec des tons chauds (orange/corail) comme couleur principale.
 *
 * Chaque thème inclut maintenant des valeurs responsive pour les espacements,
 * tailles de police et bordures, optimisés pour tous les types d'écrans mobiles.
 */

import { spacing, fontSizes, borderRadius, iconSizes } from './responsive';

/**
 * Thème clair de l'application
 *
 * Utilise une palette de couleurs chaudes avec des tons beiges et orangés
 * pour créer une ambiance chaleureuse et accueillante, rappelant
 * l'atmosphère d'une cuisine traditionnelle.
 */
export const lightTheme = {
  /** Couleur de fond principale de l'application - Beige clair doux */
  background: '#F5F5F0',

  /** Couleur de surface pour les composants au premier plan - Blanc pur */
  surface: '#FFFFFF',

  /** Couleur de surface secondaire pour les cartes et zones de contenu - Beige chaud */
  surfaceSecondary: '#F0EBE3',

  /** Couleur primaire de l'application - Orange/corail clair harmonieux */
  primary: '#D4A574',

  /** Variante plus foncée de la couleur primaire pour les états hover/pressed */
  primaryDark: '#C89563',

  /** Couleur d'accentuation pour les éléments secondaires */
  accent: '#E6B88A',

  /** Palette de couleurs pour le texte */
  text: {
    /** Texte principal - Gris très foncé pour une bonne lisibilité */
    primary: '#2C2C2C',
    /** Texte secondaire - Gris moyen pour les informations moins importantes */
    secondary: '#666666',
    /** Texte tertiaire - Gris clair pour les labels et métadonnées */
    tertiary: '#999999',
  },

  /** Couleurs spécifiques aux cartes */
  card: {
    /** Fond des cartes - Beige harmonieux */
    background: '#F0EBE3',
    /** Bordure des cartes - Beige plus clair */
    border: '#E5DFD6',
  },

  /** Couleurs des boutons */
  button: {
    /** Fond du bouton principal */
    primary: '#D4A574',
    /** Texte des boutons - Blanc pour un bon contraste */
    text: '#FFFFFF',
  },

  /** Couleurs des tags */
  tag: {
    /** Fond des tags - Beige très clair */
    background: '#FBF2E9',
    /** Texte des tags - Orange/corail pour cohérence avec le thème */
    text: '#C89563',
  },

  /** Couleur pour l'icône de favori - Reprend la couleur primaire */
  favorite: '#D4A574',

  /** Couleur d'erreur - Rouge doux pour les messages d'erreur */
  error: '#C76B6B',

  /** Couleur des séparateurs et lignes de division */
  divider: '#E0E0E0',
};

/**
 * Thème sombre de l'application
 *
 * Utilise une palette de couleurs sombres avec des tons verts pour réduire
 * la fatigue oculaire en conditions de faible luminosité, tout en conservant
 * les accents orangés caractéristiques de l'application.
 */
export const darkTheme = {
  /** Couleur de fond principale - Vert très foncé apaisant */
  background: '#1A1F1A',

  /** Couleur de surface pour les composants au premier plan */
  surface: '#2A3A2A',

  /** Couleur de surface secondaire pour les cartes */
  surfaceSecondary: '#3A4A3A',

  /** Couleur primaire - Conserve l'orange/corail caractéristique même en mode sombre */
  primary: '#D4A574',

  /** Variante plus foncée de la couleur primaire */
  primaryDark: '#C89563',

  /** Couleur d'accentuation */
  accent: '#E6B88A',

  /** Palette de couleurs pour le texte en mode sombre */
  text: {
    /** Texte principal - Blanc cassé pour une lecture confortable */
    primary: '#E5E5E5',
    /** Texte secondaire - Gris clair */
    secondary: '#B0B0B0',
    /** Texte tertiaire - Gris moyen */
    tertiary: '#808080',
  },

  /** Couleurs spécifiques aux cartes en mode sombre */
  card: {
    /** Fond des cartes - Vert foncé légèrement plus clair que le fond */
    background: '#2F3F2F',
    /** Bordure des cartes */
    border: '#3F4F3F',
  },

  /** Couleurs des boutons en mode sombre */
  button: {
    /** Fond du bouton principal - Conserve l'orange caractéristique */
    primary: '#D4A574',
    /** Texte des boutons - Reprend le fond sombre pour un bon contraste */
    text: '#1A1F1A',
  },

  /** Couleurs des tags en mode sombre */
  tag: {
    /** Fond des tags */
    background: '#3A4A3A',
    /** Texte des tags */
    text: '#E6B88A',
  },

  /** Couleur pour l'icône de favori */
  favorite: '#D4A574',

  /** Couleur d'erreur - Rouge plus clair pour visibilité sur fond sombre */
  error: '#E89B9B',

  /** Couleur des séparateurs et lignes de division */
  divider: '#3F4F3F',
};

/**
 * Type TypeScript représentant la structure d'un thème
 *
 * Permet d'assurer que darkTheme et lightTheme ont la même structure
 * et facilite le typage dans le reste de l'application.
 */
export type Theme = typeof lightTheme;

/**
 * Valeurs responsive communes aux deux thèmes
 * Optimisées pour tous les types d'écrans mobiles
 */
export const responsiveTheme = {
  /** Espacements responsive pour marges et paddings */
  spacing,

  /** Tailles de police responsive */
  fontSizes,

  /** Tailles de border radius responsive */
  borderRadius,

  /** Tailles d'icônes responsive */
  iconSizes,
};