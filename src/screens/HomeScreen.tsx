/**
 * src/screens/HomeScreen.tsx
 *
 * Écran d'accueil de l'application - Dashboard principal.
 *
 * Cet écran présente une vue d'ensemble de l'application avec :
 * - En-tête avec bouton menu et bouton de changement de thème
 * - Carte d'information présentant l'application
 * - Statistiques en temps réel (nombre de livres, recettes, favoris)
 * - Cartes de navigation vers les sections principales
 *
 * Fonctionnalités :
 * - Bouton menu (burger) : ouvre le drawer de navigation
 * - Bouton thème : bascule entre mode clair et sombre
 * - Statistiques dynamiques mises à jour en temps réel
 * - Navigation rapide vers Livres et Recettes
 *
 * Design :
 * - Interface claire et épurée type "Today" (inspiré des apps modernes)
 * - Cartes avec bordures et arrière-plans thématiques
 * - Disposition responsive et espacements harmonieux
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { responsiveTheme } from '../theme/colors';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';

/** Type combiné pour la navigation (drawer + stack) */
type HomeScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Home'>;

/** Props du composant HomeScreen */
interface Props {
  navigation: HomeScreenNavigationProp;
}

/**
 * Composant de l'écran d'accueil
 *
 * @param navigation - Props de navigation pour le drawer et la stack
 * @returns {JSX.Element} L'écran d'accueil complet
 */
export default function HomeScreen({ navigation }: Props) {
  /** Récupère les données de l'application */
  const { books, recipes } = useApp();

  /** Récupère le thème et la fonction de bascule */
  const { theme, isDark, toggleTheme } = useTheme();

  /** Calcule le nombre de recettes favorites pour les statistiques */
  const favoriteRecipes = recipes.filter(r => r.isFavorite);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: spacing.base,
      paddingBottom: spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
      flexShrink: 1,
    },
    menuButton: {
      width: iconSizes.xl + spacing.md,
      height: iconSizes.xl + spacing.md,
      borderRadius: borderRadius.round,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    menuIcon: {
      fontSize: iconSizes.md,
    },
    title: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xxl : fontSizes.xxxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
      flexShrink: 1,
    },
    themeButton: {
      width: iconSizes.xl + spacing.md,
      height: iconSizes.xl + spacing.md,
      borderRadius: borderRadius.round,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    themeButtonText: {
      fontSize: iconSizes.md,
    },
    infoCard: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.base,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    infoText: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      lineHeight: fontSizes.base * 1.5,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.base,
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: screenDimensions.isSmallDevice ? 70 : 80,
      justifyContent: 'center',
    },
    statNumber: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xl : fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
    },
    navSection: {
      gap: spacing.md,
    },
    navCard: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: screenDimensions.isSmallDevice ? 70 : 80,
    },
    navCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    navIcon: {
      fontSize: iconSizes.lg,
    },
    navTextContainer: {
      flex: 1,
    },
    navTitle: {
      fontSize: fontSizes.lg,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    navSubtitle: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
    },
    navArrow: {
      fontSize: iconSizes.md,
      color: theme.text.tertiary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>Liste de recette</Text>
          </View>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Gardez vos livres de cuisine organisés et retrouvez vos recettes préférées en un instant
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{books.length}</Text>
            <Text style={styles.statLabel}>Livres</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{recipes.length}</Text>
            <Text style={styles.statLabel}>Recettes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoriteRecipes.length}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
        </View>

        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Books')}
            activeOpacity={0.7}
          >
            <View style={styles.navCardContent}>
              <Text style={styles.navIcon}>📚</Text>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle}>Ma Bibliothèque</Text>
                <Text style={styles.navSubtitle} numberOfLines={1}>
                  {books.length} livre{books.length > 1 ? 's' : ''} indexé{books.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Recipes')}
            activeOpacity={0.7}
          >
            <View style={styles.navCardContent}>
              <Text style={styles.navIcon}>🍳</Text>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle}>Mes Recettes</Text>
                <Text style={styles.navSubtitle} numberOfLines={1}>
                  {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {favoriteRecipes.length} favori{favoriteRecipes.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}