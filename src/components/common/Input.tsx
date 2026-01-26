/**
 * src/components/common/Input.tsx
 *
 * Composant Input réutilisable pour uniformiser les champs de saisie.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, fontSizes, borderRadius } from '../../theme/responsive';

interface InputProps extends TextInputProps {
  /** Label affiché au-dessus du champ */
  label?: string;
  /** Indique si le champ est obligatoire */
  required?: boolean;
  /** Message d'erreur à afficher */
  error?: string;
  /** Style personnalisé pour le conteneur */
  containerStyle?: ViewStyle;
  /** Style personnalisé pour le label */
  labelStyle?: TextStyle;
  /** Style personnalisé pour l'input */
  inputStyle?: ViewStyle;
  /** Mode multiligne */
  multiline?: boolean;
}

export default function Input({
  label,
  required = false,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  multiline = false,
  ...textInputProps
}: InputProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.base,
    },
    label: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    required: {
      color: '#dc3545',
    },
    input: {
      backgroundColor: theme.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: error ? '#dc3545' : theme.card.border,
      color: theme.text.primary,
      minHeight: 44,
    },
    multiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    error: {
      fontSize: fontSizes.sm,
      color: '#dc3545',
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]} allowFontScaling>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.input, multiline && styles.multiline, inputStyle]}
        placeholderTextColor={theme.text.tertiary}
        allowFontScaling
        multiline={multiline}
        {...textInputProps}
      />
      {error && (
        <Text style={styles.error} allowFontScaling>
          {error}
        </Text>
      )}
    </View>
  );
}
