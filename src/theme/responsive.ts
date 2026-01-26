/**
 * src/theme/responsive.ts
 *
 * Utilitaires pour la gestion responsive de l'application.
 *
 * Ce fichier fournit des outils pour adapter l'interface aux différentes
 * tailles d'écran (petits mobiles, mobiles standards, tablettes).
 * Toutes les valeurs sont calculées proportionnellement à la largeur de l'écran
 * pour garantir une expérience cohérente sur tous les appareils.
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

/** Dimensions de l'écran */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Largeur de référence pour le design (iPhone 11 / Pixel 5) */
const BASE_WIDTH = 375;

/** Hauteur de référence pour le design */
const BASE_HEIGHT = 812;

/**
 * Calcule une taille proportionnelle à la largeur de l'écran
 *
 * @param size - Taille de base définie pour l'écran de référence
 * @returns Taille adaptée à l'écran actuel
 *
 * @example
 * const fontSize = scale(16); // Adapte 16px à la taille d'écran
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Calcule une taille proportionnelle à la hauteur de l'écran
 * Utile pour les espacements verticaux
 *
 * @param size - Taille de base définie pour l'écran de référence
 * @returns Taille adaptée à la hauteur d'écran actuelle
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Calcule une taille modérément responsive
 * Utile pour les tailles de police et les éléments qui ne doivent pas
 * trop grossir sur les grands écrans
 *
 * @param size - Taille de base
 * @param factor - Facteur de scaling (défaut: 0.5 = 50% responsive)
 * @returns Taille adaptée avec facteur modéré
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Arrondit une valeur au pixel près pour éviter les valeurs fractionnaires
 * qui peuvent causer du flou sur certains appareils
 *
 * @param size - Taille à arrondir
 * @returns Taille arrondie au pixel le plus proche
 */
export const normalize = (size: number): number => {
  return Math.round(PixelRatio.roundToNearestPixel(size));
};

/**
 * Breakpoints pour différentes tailles d'écran
 */
export const breakpoints = {
  /** Petits mobiles (iPhone SE, petits Android) */
  smallPhone: 320,
  /** Mobiles standards (iPhone 11, Pixel 5) */
  phone: 375,
  /** Grands mobiles (iPhone Plus, grands Android) */
  largePhone: 414,
  /** Petites tablettes */
  tablet: 768,
  /** Grandes tablettes et iPad Pro */
  largeTablet: 1024,
};

/**
 * Détecte le type d'appareil en fonction de la largeur
 */
export const deviceType = {
  isSmallPhone: SCREEN_WIDTH < breakpoints.phone,
  isPhone: SCREEN_WIDTH >= breakpoints.phone && SCREEN_WIDTH < breakpoints.tablet,
  isTablet: SCREEN_WIDTH >= breakpoints.tablet && SCREEN_WIDTH < breakpoints.largeTablet,
  isLargeTablet: SCREEN_WIDTH >= breakpoints.largeTablet,
};

/**
 * Dimensions de l'écran
 */
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH <= breakpoints.smallPhone,
  isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
};

/**
 * Espacement responsive basé sur la taille d'écran
 */
export const spacing = {
  /** Très petit espacement (4-6px selon l'écran) */
  xs: normalize(moderateScale(4)),
  /** Petit espacement (8-10px selon l'écran) */
  sm: normalize(moderateScale(8)),
  /** Espacement moyen (12-16px selon l'écran) */
  md: normalize(moderateScale(12)),
  /** Espacement standard (16-20px selon l'écran) */
  base: normalize(moderateScale(16)),
  /** Grand espacement (20-24px selon l'écran) */
  lg: normalize(moderateScale(20)),
  /** Très grand espacement (24-30px selon l'écran) */
  xl: normalize(moderateScale(24)),
  /** Espacement extra large (32-40px selon l'écran) */
  xxl: normalize(moderateScale(32)),
};

/**
 * Tailles de police responsive
 */
export const fontSizes = {
  /** Très petit texte (10-11px) - labels, tags */
  xs: normalize(moderateScale(10, 0.3)),
  /** Petit texte (12-13px) - sous-titres, métadonnées */
  sm: normalize(moderateScale(12, 0.3)),
  /** Texte standard (14-15px) - texte principal */
  base: normalize(moderateScale(14, 0.3)),
  /** Texte moyen (16-17px) - titres de cartes */
  md: normalize(moderateScale(16, 0.3)),
  /** Grand texte (18-20px) - sous-titres de section */
  lg: normalize(moderateScale(18, 0.3)),
  /** Très grand texte (20-24px) - titres */
  xl: normalize(moderateScale(20, 0.3)),
  /** Texte extra large (24-28px) - titres principaux */
  xxl: normalize(moderateScale(24, 0.3)),
  /** Texte énorme (32-40px) - titre de page */
  xxxl: normalize(moderateScale(32, 0.4)),
};

/**
 * Tailles de border radius responsive
 */
export const borderRadius = {
  /** Petit arrondi (4-6px) */
  sm: normalize(moderateScale(4)),
  /** Arrondi moyen (8-10px) */
  md: normalize(moderateScale(8)),
  /** Arrondi standard (12-16px) */
  base: normalize(moderateScale(12)),
  /** Grand arrondi (16-20px) */
  lg: normalize(moderateScale(16)),
  /** Très grand arrondi (20-24px) */
  xl: normalize(moderateScale(20)),
  /** Arrondi complet (circulaire) */
  round: 9999,
};

/**
 * Tailles d'icônes responsive
 */
export const iconSizes = {
  /** Petite icône (16-18px) */
  sm: normalize(moderateScale(16, 0.3)),
  /** Icône moyenne (20-22px) */
  md: normalize(moderateScale(20, 0.3)),
  /** Icône standard (24-26px) */
  base: normalize(moderateScale(24, 0.3)),
  /** Grande icône (28-32px) */
  lg: normalize(moderateScale(28, 0.3)),
  /** Très grande icône (32-36px) */
  xl: normalize(moderateScale(32, 0.3)),
};

/**
 * Fonction utilitaire pour obtenir une valeur responsive conditionnelle
 *
 * @param smallValue - Valeur pour petits écrans
 * @param mediumValue - Valeur pour écrans moyens (optionnel)
 * @param largeValue - Valeur pour grands écrans (optionnel)
 * @returns La valeur appropriée selon la taille d'écran
 *
 * @example
 * const columns = getResponsiveValue(1, 2, 3); // 1 col sur petit, 2 sur moyen, 3 sur grand
 */
export const getResponsiveValue = <T,>(
  smallValue: T,
  mediumValue?: T,
  largeValue?: T
): T => {
  if (deviceType.isTablet && largeValue !== undefined) {
    return largeValue;
  }
  if (deviceType.isPhone && mediumValue !== undefined) {
    return mediumValue;
  }
  return smallValue;
};

/**
 * Styles d'ombres pour les cartes et éléments flottants
 * Compatible iOS et Android
 */
export const shadows = {
  /** Ombre très subtile pour cartes principales */
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),
  /** Ombre moyenne pour éléments interactifs */
  elevated: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),
  /** Ombre prononcée pour modales et overlays */
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
  }),
};
