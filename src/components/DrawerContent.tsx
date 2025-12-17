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
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      fontSize: fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    headerSubtitle: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    menuSection: {
      paddingVertical: spacing.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.base,
      paddingHorizontal: spacing.base,
      gap: spacing.base,
    },
    menuItemActive: {
      backgroundColor: theme.primary + '20',
      borderRightWidth: 4,
      borderRightColor: theme.primary,
    },
    menuIcon: {
      fontSize: iconSizes.base,
      width: iconSizes.lg,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
    },
    menuSubtitle: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    divider: {
      height: 1,
      backgroundColor: theme.card.border,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.base,
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
      name: 'Discover',
      icon: '✨',
      title: 'Découvrir',
      subtitle: 'Suggestions IA',
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
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSubtitle}>Recipe Book Manager</Text>
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
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </DrawerContentScrollView>
    </View>
  );
}
