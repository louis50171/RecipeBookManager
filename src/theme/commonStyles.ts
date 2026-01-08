/**
 * src/theme/commonStyles.ts
 *
 * Styles communs réutilisables à travers l'application.
 *
 * Ce fichier centralise les styles des composants récurrents
 * pour garantir une cohérence visuelle dans toute l'interface.
 */

import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../contexts/ThemeContext';
import { spacing, fontSizes, borderRadius, iconSizes } from './responsive';

/**
 * Génère les styles communs pour un thème donné
 * @param theme - Le thème actuel
 */
export const createCommonStyles = (theme: Theme) => {
  return StyleSheet.create({
    /** Bouton principal (action primaire) */
    primaryButton: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44, // Taille minimum recommandée pour l'accessibilité
    } as ViewStyle,

    /** Texte du bouton principal */
    primaryButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    } as TextStyle,

    /** Bouton secondaire (action secondaire) */
    secondaryButton: {
      backgroundColor: theme.card.background,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: 44,
    } as ViewStyle,

    /** Texte du bouton secondaire */
    secondaryButtonText: {
      color: theme.text.primary,
      fontSize: fontSizes.md,
      fontWeight: '600',
    } as TextStyle,

    /** Bouton de danger (suppression, actions destructrices) */
    dangerButton: {
      backgroundColor: '#dc3545',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    } as ViewStyle,

    /** Texte du bouton de danger */
    dangerButtonText: {
      color: '#ffffff',
      fontSize: fontSizes.md,
      fontWeight: '600',
    } as TextStyle,

    /** Champ de saisie standard */
    input: {
      backgroundColor: theme.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      color: theme.text.primary,
      minHeight: 44,
    } as ViewStyle,

    /** Champ de saisie multiligne */
    textArea: {
      backgroundColor: theme.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      color: theme.text.primary,
      minHeight: 100,
      textAlignVertical: 'top',
    } as ViewStyle,

    /** Label de formulaire */
    label: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
      marginTop: spacing.base,
    } as TextStyle,

    /** Carte standard */
    card: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      borderWidth: 1,
      borderColor: theme.card.border,
    } as ViewStyle,

    /** En-tête de page standard */
    pageHeader: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      paddingTop: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    } as ViewStyle,

    /** Titre de page */
    pageTitle: {
      fontSize: fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    } as TextStyle,

    /** Conteneur de tag */
    tag: {
      backgroundColor: theme.tag.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    } as ViewStyle,

    /** Texte de tag */
    tagText: {
      fontSize: fontSizes.sm,
      color: theme.tag.text,
    } as TextStyle,

    /** Bouton flottant d'ajout (FAB - Floating Action Button) */
    floatingAddButton: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      margin: spacing.base,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      minHeight: 44,
    } as ViewStyle,

    /** Texte du bouton flottant */
    floatingAddButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    } as TextStyle,

    /** Conteneur vide (quand aucun élément) */
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xxl * 2,
      paddingHorizontal: spacing.base,
    } as ViewStyle,

    /** Icône pour état vide */
    emptyIcon: {
      fontSize: iconSizes.xl * 2,
      marginBottom: spacing.base,
    } as TextStyle,

    /** Texte principal pour état vide */
    emptyText: {
      fontSize: fontSizes.lg,
      color: theme.text.secondary,
      fontWeight: '600',
      marginBottom: spacing.sm,
      textAlign: 'center',
    } as TextStyle,

    /** Sous-texte pour état vide */
    emptySubtext: {
      fontSize: fontSizes.base,
      color: theme.text.tertiary,
      textAlign: 'center',
      paddingHorizontal: spacing.base,
    } as TextStyle,

    /** Séparateur horizontal */
    divider: {
      height: 1,
      backgroundColor: theme.card.border,
      marginVertical: spacing.base,
    } as ViewStyle,

    /** Container de modal */
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.base,
    } as ViewStyle,

    /** Contenu de modal */
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      width: '100%',
      maxWidth: 400,
    } as ViewStyle,

    /** Titre de modal */
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: spacing.base,
    } as TextStyle,

    /** Container de boutons de modal */
    modalButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.base,
    } as ViewStyle,

    /** Barre de recherche */
    searchInput: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      margin: spacing.base,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.base,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: 44,
    } as ViewStyle,
  });
};

/**
 * Styles communs indépendants du thème
 */
export const genericStyles = StyleSheet.create({
  /** Conteneur flexible qui prend tout l'espace */
  flex1: {
    flex: 1,
  },

  /** Centre le contenu horizontalement et verticalement */
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Disposition en ligne */
  row: {
    flexDirection: 'row',
  },

  /** Disposition en ligne avec espacement entre les éléments */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /** Disposition en colonne */
  column: {
    flexDirection: 'column',
  },

  /** Wrap pour les éléments qui débordent */
  wrap: {
    flexWrap: 'wrap',
  },

  /** Shadow légère (iOS/Android compatible) */
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
