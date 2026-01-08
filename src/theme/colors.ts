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

import { spacing, fontSizes, borderRadius, iconSizes, shadows } from './responsive';

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
    /** Texte secondaire - Gris moyen pour les informations moins importantes (WCAG AA compliant) */
    secondary: '#4A4A4A',
    /** Texte tertiaire - Gris pour les labels et métadonnées (amélioration contraste) */
    tertiary: '#757575',
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
 * Utilise une palette moderne avec des gris foncés et noirs pour réduire
 * la fatigue oculaire en conditions de faible luminosité, tout en conservant
 * les accents orangés caractéristiques de l'application.
 * Design inspiré des interfaces modernes (GitHub, VS Code, etc.)
 */
export const darkTheme = {
  /** Couleur de fond principale - Noir profond */
  background: '#0D1117',

  /** Couleur de surface pour les composants au premier plan */
  surface: '#161B22',

  /** Couleur de surface secondaire pour les cartes */
  surfaceSecondary: '#1C2128',

  /** Couleur primaire - Conserve l'orange/corail caractéristique même en mode sombre */
  primary: '#D4A574',

  /** Variante plus foncée de la couleur primaire */
  primaryDark: '#C89563',

  /** Couleur d'accentuation */
  accent: '#E6B88A',

  /** Palette de couleurs pour le texte en mode sombre */
  text: {
    /** Texte principal - Blanc cassé pour une lecture confortable */
    primary: '#E6EDF3',
    /** Texte secondaire - Gris clair (WCAG AA compliant sur fond sombre) */
    secondary: '#8B949E',
    /** Texte tertiaire - Gris moyen (amélioration contraste) */
    tertiary: '#6E7681',
  },

  /** Couleurs spécifiques aux cartes en mode sombre */
  card: {
    /** Fond des cartes - Gris foncé légèrement plus clair que le fond */
    background: '#161B22',
    /** Bordure des cartes - Gris subtil */
    border: '#30363D',
  },

  /** Couleurs des boutons en mode sombre */
  button: {
    /** Fond du bouton principal - Conserve l'orange caractéristique */
    primary: '#D4A574',
    /** Texte des boutons - Noir pour un bon contraste */
    text: '#0D1117',
  },

  /** Couleurs des tags en mode sombre */
  tag: {
    /** Fond des tags - Gris foncé avec légère transparence */
    background: '#21262D',
    /** Texte des tags */
    text: '#E6B88A',
  },

  /** Couleur pour l'icône de favori */
  favorite: '#D4A574',

  /** Couleur d'erreur - Rouge plus clair pour visibilité sur fond sombre */
  error: '#F85149',

  /** Couleur des séparateurs et lignes de division */
  divider: '#21262D',
};

/**
 * Thème moderne inspiré de l'interface culinaire contemporaine
 *
 * Basé sur une palette épurée avec des tons orange vif et vert sauge,
 * créant une esthétique moderne et raffinée pour une application de recettes.
 * Fond crème doux avec cartes blanches et accents vibrants.
 */
export const modernCuisineTheme = {
  /** Couleur de fond principale - Beige/crème très clair et lumineux */
  background: '#FBF8F3',

  /** Couleur de surface pour les cartes - Blanc pur */
  surface: '#FFFFFF',

  /** Couleur de surface secondaire - Beige très clair */
  surfaceSecondary: '#F5F2ED',

  /** Couleur primaire - Orange vif/corail dynamique */
  primary: '#FF6B35',

  /** Variante plus foncée de la couleur primaire */
  primaryDark: '#E85A28',

  /** Couleur d'accentuation - Orange plus clair */
  accent: '#FF7A4D',

  /** Palette de couleurs pour le texte */
  text: {
    /** Texte principal - Noir charbon pour une excellente lisibilité */
    primary: '#1A1A1A',
    /** Texte secondaire - Gris moyen */
    secondary: '#6B6B6B',
    /** Texte tertiaire - Gris clair */
    tertiary: '#999999',
  },

  /** Couleurs spécifiques aux cartes */
  card: {
    /** Fond des cartes - Blanc pur */
    background: '#FFFFFF',
    /** Bordure des cartes - Gris très clair */
    border: '#E8E8E8',
  },

  /** Couleurs des boutons */
  button: {
    /** Fond du bouton principal - Orange vif */
    primary: '#FF6B35',
    /** Texte des boutons - Blanc */
    text: '#FFFFFF',
  },

  /** Couleurs des tags */
  tag: {
    /** Fond des tags - Vert sauge doux */
    background: '#E8F0E3',
    /** Texte des tags - Vert olive */
    text: '#7B9B6F',
  },

  /** Couleur pour l'icône de favori */
  favorite: '#FF6B35',

  /** Couleur d'erreur - Rouge vibrant */
  error: '#E74C3C',

  /** Couleur des séparateurs et lignes de division */
  divider: '#E8E8E8',
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

  /** Styles d'ombres pour cartes et éléments */
  shadows,
};