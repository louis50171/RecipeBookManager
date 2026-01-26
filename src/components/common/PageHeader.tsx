/**
 * src/components/common/PageHeader.tsx
 *
 * Composant d'en-tête de page réutilisable.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, fontSizes, iconSizes, screenDimensions } from '../../theme/responsive';

interface PageHeaderProps {
  /** Titre de la page */
  title: string;
  /** Texte optionnel affiché sous le titre (compteur, etc.) */
  subtitle?: string;
  /** Affiche le bouton menu */
  showMenuButton?: boolean;
  /** Fonction appelée lors du clic sur le menu */
  onMenuPress?: () => void;
  /** Composant personnalisé à afficher à droite */
  rightComponent?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  showMenuButton = true,
  onMenuPress,
  rightComponent,
}: PageHeaderProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      paddingTop: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: subtitle ? spacing.xs : 0,
    },
    menuButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    menuIcon: {
      fontSize: iconSizes.base,
    },
    title: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xl : fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
      flex: 1,
    },
    subtitle: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {showMenuButton && onMenuPress && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            accessibilityLabel="Ouvrir le menu de navigation"
            accessibilityRole="button"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling
        >
          {title}
        </Text>
        {rightComponent}
      </View>
      {subtitle && (
        <Text style={styles.subtitle} allowFontScaling numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
