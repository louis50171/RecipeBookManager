/**
 * src/screens/HomeScreen.tsx
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';

type HomeScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { books, recipes, collections } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();

  const favoriteCount = useMemo(() => recipes.filter(r => r.isFavorite).length, [recipes]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: spacing.base,
      paddingBottom: spacing.xxl + spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
      flexShrink: 1,
    },
    menuButton: {
      width: 44,
      height: 44,
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
    titleBlock: {
      flex: 1,
      flexShrink: 1,
    },
    greeting: {
      fontSize: fontSizes.sm,
      color: theme.text.tertiary,
      fontWeight: '500',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xxl : fontSizes.xxxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    themeButton: {
      width: 44,
      height: 44,
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

    // ── Stats ──────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card.background,
      padding: spacing.md,
      borderRadius: borderRadius.base,
      borderWidth: 1,
      borderColor: theme.card.border,
      alignItems: 'center',
      minHeight: 90,
      justifyContent: 'center',
      gap: spacing.xs,
    },
    statCardBooks: {
      borderTopWidth: 3,
      borderTopColor: '#5B8DEF',
    },
    statCardRecipes: {
      borderTopWidth: 3,
      borderTopColor: theme.primary,
    },
    statCardFavorites: {
      borderTopWidth: 3,
      borderTopColor: '#E57373',
    },
    statIcon: {
      fontSize: iconSizes.base,
    },
    statNumber: {
      fontSize: fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      lineHeight: fontSizes.xxl * 1.1,
    },
    statLabel: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },

    // ── Section title ──────────────────────────────────────
    sectionLabel: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.sm,
    },

    // ── Nav cards ─────────────────────────────────────────
    navSection: {
      gap: spacing.sm,
    },
    navCard: {
      backgroundColor: theme.card.background,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.base,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      minHeight: 72,
    },
    navCardBooks: {
      borderLeftWidth: 4,
      borderLeftColor: '#5B8DEF',
    },
    navCardRecipes: {
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    navCardCollections: {
      borderLeftWidth: 4,
      borderLeftColor: '#7CB88A',
    },
    navCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    navIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navIconWrapperBooks: {
      backgroundColor: isDark ? '#1C2A45' : '#EBF3FF',
    },
    navIconWrapperRecipes: {
      backgroundColor: isDark ? '#2D1F10' : '#FFF3E0',
    },
    navIconWrapperCollections: {
      backgroundColor: isDark ? '#1A2D1E' : '#EEF7F0',
    },
    navIcon: {
      fontSize: iconSizes.md,
    },
    navTextContainer: {
      flex: 1,
    },
    navTitle: {
      fontSize: fontSizes.md,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 2,
    },
    navSubtitle: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
    },
    navArrow: {
      fontSize: fontSizes.xl,
      color: theme.text.tertiary,
      fontWeight: '300',
    },
  }), [theme, isDark]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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
            <View style={styles.titleBlock}>
              <Text style={styles.greeting} numberOfLines={1}>Mon carnet</Text>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">Recettes</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            accessibilityLabel={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            accessibilityRole="button"
          >
            <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={styles.sectionLabel}>Aperçu</Text>
        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, styles.statCardBooks]}
            accessible
            accessibilityLabel={`${books.length} livre${books.length > 1 ? 's' : ''}`}
          >
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statNumber} allowFontScaling>{books.length}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Livres</Text>
          </View>
          <View
            style={[styles.statCard, styles.statCardRecipes]}
            accessible
            accessibilityLabel={`${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}
          >
            <Text style={styles.statIcon}>🍳</Text>
            <Text style={styles.statNumber} allowFontScaling>{recipes.length}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Recettes</Text>
          </View>
          <View
            style={[styles.statCard, styles.statCardFavorites]}
            accessible
            accessibilityLabel={`${favoriteCount} favori${favoriteCount > 1 ? 's' : ''}`}
          >
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber} allowFontScaling>{favoriteCount}</Text>
            <Text style={styles.statLabel} allowFontScaling numberOfLines={1}>Favoris</Text>
          </View>
        </View>

        {/* Navigation */}
        <Text style={styles.sectionLabel}>Sections</Text>
        <View style={styles.navSection}>
          <TouchableOpacity
            style={[styles.navCard, styles.navCardBooks]}
            onPress={() => navigation.navigate('Books')}
            activeOpacity={0.75}
            accessibilityLabel={`Aller à la bibliothèque, ${books.length} livre${books.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <View style={[styles.navIconWrapper, styles.navIconWrapperBooks]}>
                <Text style={styles.navIcon}>📚</Text>
              </View>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1}>Ma Bibliothèque</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1}>
                  {books.length} livre{books.length > 1 ? 's' : ''} indexé{books.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navCard, styles.navCardRecipes]}
            onPress={() => navigation.navigate('Recipes')}
            activeOpacity={0.75}
            accessibilityLabel={`Aller aux recettes, ${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <View style={[styles.navIconWrapper, styles.navIconWrapperRecipes]}>
                <Text style={styles.navIcon}>🍳</Text>
              </View>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1}>Mes Recettes</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1}>
                  {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {favoriteCount} favori{favoriteCount > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navCard, styles.navCardCollections]}
            onPress={() => navigation.navigate('Collections')}
            activeOpacity={0.75}
            accessibilityLabel={`Aller aux collections, ${collections.length} collection${collections.length > 1 ? 's' : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.navCardContent}>
              <View style={[styles.navIconWrapper, styles.navIconWrapperCollections]}>
                <Text style={styles.navIcon}>📂</Text>
              </View>
              <View style={styles.navTextContainer}>
                <Text style={styles.navTitle} allowFontScaling numberOfLines={1}>Collections</Text>
                <Text style={styles.navSubtitle} allowFontScaling numberOfLines={1}>
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
