/**
 * src/components/common/Button.tsx
 *
 * Composant Button réutilisable pour uniformiser les boutons dans l'application.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, fontSizes, borderRadius } from '../../theme/responsive';

interface ButtonProps {
  /** Texte affiché dans le bouton */
  title: string;
  /** Fonction appelée lors du clic */
  onPress: () => void;
  /** Variante du bouton */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Désactive le bouton */
  disabled?: boolean;
  /** Affiche un indicateur de chargement */
  loading?: boolean;
  /** Style personnalisé pour le conteneur */
  style?: ViewStyle;
  /** Style personnalisé pour le texte */
  textStyle?: TextStyle;
  /** Label d'accessibilité */
  accessibilityLabel?: string;
  /** Hint d'accessibilité */
  accessibilityHint?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    button: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      flexDirection: 'row',
      gap: spacing.sm,
    },
    primary: {
      backgroundColor: theme.primary,
    },
    secondary: {
      backgroundColor: theme.card.background,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    danger: {
      backgroundColor: '#dc3545',
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
    primaryText: {
      color: theme.button.text,
    },
    secondaryText: {
      color: theme.text.primary,
    },
    dangerText: {
      color: '#ffffff',
    },
  });

  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'danger' && styles.dangerText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading && <ActivityIndicator color={variant === 'secondary' ? theme.text.primary : theme.button.text} />}
      <Text style={buttonTextStyle} allowFontScaling>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
