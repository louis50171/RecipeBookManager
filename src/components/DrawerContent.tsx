/**
 * src/components/DrawerContent.tsx
 *
 * Composant personnalisé pour le contenu du menu drawer (menu latéral).
 *
 * Ce composant affiche un menu de navigation élégant avec :
 * - Un en-tête contenant le titre de l'application
 * - Une liste d'items de menu avec icônes, titres et sous-titres dynamiques
 * - Un indicateur visuel pour la route active
 * - Des compteurs mis à jour en temps réel (nombre de livres et recettes)
 *
 * Design :
 * - Adapté automatiquement au thème actif (clair/sombre)
 * - Utilise des émojis comme icônes pour un rendu universel
 * - Séparateurs entre les items pour une meilleure lisibilité
 * - Mise en évidence de l'item actif avec bordure et fond coloré
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { spacing, fontSizes, iconSizes } from '../theme/responsive';

/**
 * Composant du contenu personnalisé du drawer
 *
 * @param props - Props standard du drawer de React Navigation
 * @returns {JSX.Element} Le contenu du menu drawer
 */
export default function DrawerContent(props: DrawerContentComponentProps) {
  /** Récupère le thème actuel pour le styling */
  const { theme } = useTheme();

  /** Récupère les données de l'application pour afficher les compteurs */
  const { books, recipes, collections } = useApp();

  /** Styles dynamiques basés sur le thème actuel */
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: spacing.xxl,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      backgroundColor: theme.primary,
    },
    headerTitle: {
      fontSize: fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.button.text,
      fontFamily: 'serif',
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: fontSizes.sm,
      color: theme.button.text + 'CC',
      marginTop: spacing.xs,
      fontWeight: '500',
    },
    menuSection: {
      paddingVertical: spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
      borderRadius: spacing.sm,
      gap: spacing.md,
    },
    menuItemActive: {
      backgroundColor: theme.primary + '15',
      borderLeftWidth: 3,
      borderLeftColor: theme.primary,
    },
    menuIcon: {
      fontSize: iconSizes.md,
      width: iconSizes.lg,
      textAlign: 'center',
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: theme.text.primary,
    },
    menuSubtitle: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: theme.card.border + '40',
      marginVertical: spacing.sm,
      marginHorizontal: spacing.lg,
    },
  });

  /**
   * Définition des items du menu
   * Les sous-titres sont dynamiques et affichent le nombre d'éléments en temps réel
   */
  const menuItems = [
    {
      name: 'Home',
      icon: '🏠',
      title: 'Accueil',
      subtitle: 'Vue d\'ensemble',
    },
    {
      name: 'Books',
      icon: '📚',
      title: 'Mes Livres',
      subtitle: `${books.length} livre${books.length > 1 ? 's' : ''}`,
    },
    {
      name: 'Recipes',
      icon: '🍳',
      title: 'Mes Recettes',
      subtitle: `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`,
    },
    {
      name: 'Collections',
      icon: '📂',
      title: 'Collections',
      subtitle: `${collections.length} collection${collections.length > 1 ? 's' : ''}`,
    },
  ];

  /** Détermine la route actuelle pour mettre en évidence l'item correspondant */
  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Menu</Text>
        <Text style={styles.headerSubtitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Recipe Book Manager</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.menuSection}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.name}>
            {index > 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={[
                styles.menuItem,
                currentRoute === item.name && styles.menuItemActive,
              ]}
              onPress={() => props.navigation.navigate(item.name)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
              accessibilityState={{ selected: currentRoute === item.name }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                <Text style={styles.menuSubtitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </DrawerContentScrollView>
    </View>
  );
}
