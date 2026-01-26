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
  const { books, recipes, collections } = useApp();

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
    demoBanner: {
      backgroundColor: '#FFF3CD',
      padding: spacing.sm,
      borderRadius: borderRadius.base,
      marginBottom: spacing.base,
      borderWidth: 1,
      borderColor: '#FFC107',
      alignItems: 'center',
    },
    demoBannerText: {
      fontSize: fontSizes.sm,
      color: '#856404',
      fontWeight: '600',
      textAlign: 'center',
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
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card.background,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: 60,
      justifyContent: 'center',
    },
    statNumber: {
      fontSize: fontSizes.lg,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: spacing.xs / 2,
    },
    statLabel: {
      fontSize: fontSizes.xs,
      color: theme.text.secondary,
    },
    navSection: {
      gap: spacing.sm,
    },
    navCard: {
      backgroundColor: theme.card.background,
      padding: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: 60,
    },
    navCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    navIcon: {
      fontSize: iconSizes.md,
    },
    navTextContainer: {
      flex: 1,
    },
    navTitle: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs / 2,
    },
    navSubtitle: {
      fontSize: fontSizes.xs,
      color: theme.text.secondary,
    },
    navArrow: {
      fontSize: iconSizes.sm,
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
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}
              accessibilityLabel="Ouvrir le menu de navigation"
              accessibilityRole="button"
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>Liste de recette</Text>
          </View>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            accessibilityLabel={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            accessibilityRole="button"
          >
            <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* BANDEAU VERSION DÉMO */}
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText} allowFontScaling>
            ⚠️ VERSION DÉMO - Les données ne sont pas persistées
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText} allowFontScaling numberOfLines={2} ellipsizeMode="tail">
            💡 Gardez vos livres de cuisine organisés et retrouvez vos recettes préférées en un instant
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard} accessible accessibilityLabel={`${books.length} livre${books.length > 1 ? 's' : ''}`}>
            <Text style={styles.statNumber} allowFontScaling>{books.length}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Livres</Text>
          </View>
          <View style={styles.statCard} accessible accessibilityLabel={`${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}>
            <Text style={styles.statNumber} allowFontScaling>{recipes.length}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Recettes</Text>
          </View>
          <View style={styles.statCard} accessible accessibilityLabel={`${favoriteRecipes.length} favori${favoriteRecipes.length > 1 ? 's' : ''}`}>
            <Text style={styles.statNumber} allowFontScaling>{favoriteRecipes.length}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Favoris</Text>
          </View>
        </View>

        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Books')}
            activeOpacity={0.7}
            accessibilityLabel={`Aller à la bibliothèque, ${books.length} livre${books.length > 1 ? 's' : ''} indexé${books.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <Text style={styles.navIcon}>📚</Text>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Ma Bibliothèque</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
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
            accessibilityLabel={`Aller aux recettes, ${recipes.length} recette${recipes.length > 1 ? 's' : ''}, ${favoriteRecipes.length} favori${favoriteRecipes.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <Text style={styles.navIcon}>🍳</Text>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Mes Recettes</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
                  {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {favoriteRecipes.length} favori{favoriteRecipes.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => navigation.navigate('Collections')}
            activeOpacity={0.7}
            accessibilityLabel={`Aller aux collections, ${collections.length} collection${collections.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <Text style={styles.navIcon}>📂</Text>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Collections</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
                  {collections.length} collection{collections.length > 1 ? 's' : ''}
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