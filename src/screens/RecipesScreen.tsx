/**
 * src/screens/RecipesScreen.tsx
 */

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';

type RecipesScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Recipes'>;

interface Props {
  navigation: RecipesScreenNavigationProp;
}

export default function RecipesScreen({ navigation }: Props) {
  const { recipes, books, toggleFavorite } = useApp();
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(q) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(q));
      const matchesFavorites = !showFavoritesOnly || recipe.isFavorite;
      return matchesSearch && matchesFavorites;
    });
  }, [recipes, searchQuery, showFavoritesOnly]);

  const getBookTitle = (bookId?: string) => {
    if (!bookId) return null;
    const book = books.find(b => b.id === bookId);
    return book ? book.title : null;
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      paddingBottom: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      marginRight: spacing.md,
    },
    menuIcon: {
      fontSize: iconSizes.base,
    },
    headerTitleBlock: {
      flex: 1,
    },
    headerTitle: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xl : fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    recipeCount: {
      fontSize: fontSizes.sm,
      color: theme.text.tertiary,
      fontWeight: '500',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    searchIcon: {
      fontSize: fontSizes.md,
      marginRight: spacing.sm,
      color: theme.text.tertiary,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSizes.base,
      color: theme.text.primary,
    },
    filterRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    filterPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.round,
      borderWidth: 1.5,
      borderColor: theme.card.border,
      backgroundColor: 'transparent',
    },
    filterPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterPillText: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      fontWeight: '600',
    },
    filterPillTextActive: {
      color: '#FFFFFF',
    },
    filterPillIcon: {
      fontSize: fontSizes.sm,
    },
    listContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl + spacing.xl,
    },
    recipeCard: {
      backgroundColor: theme.card.background,
      marginHorizontal: spacing.base,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.base,
      borderWidth: 1,
      borderColor: theme.card.border,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    recipeCardFavorite: {
      borderColor: theme.primary,
    },
    recipeAccentBar: {
      height: 3,
      backgroundColor: theme.card.border,
    },
    recipeAccentBarFavorite: {
      backgroundColor: theme.primary,
    },
    recipeCardContent: {
      padding: spacing.base,
    },
    recipeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    recipeName: {
      fontSize: fontSizes.md,
      fontWeight: '700',
      color: theme.text.primary,
      flex: 1,
      flexShrink: 1,
      lineHeight: fontSizes.md * 1.3,
    },
    favoriteButton: {
      paddingLeft: spacing.sm,
      paddingTop: 2,
    },
    favoriteIcon: {
      fontSize: iconSizes.base,
    },
    bookSourceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    bookSourceIcon: {
      fontSize: fontSizes.sm,
    },
    bookSource: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      fontStyle: 'italic',
      flexShrink: 1,
    },
    personalBadge: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
      fontStyle: 'italic',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      alignItems: 'center',
    },
    tag: {
      backgroundColor: theme.tag.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.round,
    },
    tagText: {
      fontSize: fontSizes.xs,
      color: theme.tag.text,
      fontWeight: '600',
    },
    moreTagsText: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
      fontWeight: '600',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xxl * 2,
      paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: spacing.base,
    },
    emptyText: {
      fontSize: fontSizes.lg,
      color: theme.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: fontSizes.base * 1.6,
    },
    fabButton: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.round,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: fontSizes.xxl,
      fontWeight: '300',
      lineHeight: fontSizes.xxl,
      marginTop: -2,
    },
  }), [theme]);

  const renderRecipe = ({ item }: { item: Recipe }) => {
    const bookTitle = getBookTitle(item.bookId);
    return (
      <TouchableOpacity
        style={[styles.recipeCard, item.isFavorite && styles.recipeCardFavorite]}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
        activeOpacity={0.8}
        accessibilityLabel={`Ouvrir la recette ${item.name}`}
        accessibilityRole="button"
      >
        <View style={[styles.recipeAccentBar, item.isFavorite && styles.recipeAccentBarFavorite]} />
        <View style={styles.recipeCardContent}>
          <View style={styles.recipeHeader}>
            <Text style={styles.recipeName} numberOfLines={2} ellipsizeMode="tail" allowFontScaling>
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
              accessibilityLabel={item.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              accessibilityRole="button"
            >
              <Text style={styles.favoriteIcon}>{item.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </View>

          {bookTitle ? (
            <View style={styles.bookSourceRow}>
              <Text style={styles.bookSourceIcon}>📖</Text>
              <Text style={styles.bookSource} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
                {bookTitle}
              </Text>
            </View>
          ) : (
            <Text style={styles.personalBadge} allowFontScaling>Recette personnelle</Text>
          )}

          {item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 4).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{tag}</Text>
                </View>
              ))}
              {item.tags.length > 4 && (
                <Text style={styles.moreTagsText} allowFontScaling>+{item.tags.length - 4}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
            accessibilityLabel="Ouvrir le menu de navigation"
            accessibilityRole="button"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
              Mes Recettes
            </Text>
            <Text style={styles.recipeCount} allowFontScaling numberOfLines={1}>
              {recipes.length} recette{recipes.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Nom, tag…"
            placeholderTextColor={theme.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            allowFontScaling
            accessibilityLabel="Champ de recherche"
            accessibilityHint="Entrez un nom de recette ou un tag pour filtrer"
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, !showFavoritesOnly && styles.filterPillActive]}
            onPress={() => setShowFavoritesOnly(false)}
            accessibilityLabel="Afficher toutes les recettes"
            accessibilityRole="button"
            accessibilityState={{ selected: !showFavoritesOnly }}
          >
            <Text style={styles.filterPillIcon}>📋</Text>
            <Text style={[styles.filterPillText, !showFavoritesOnly && styles.filterPillTextActive]} allowFontScaling numberOfLines={1}>
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterPill, showFavoritesOnly && styles.filterPillActive]}
            onPress={() => setShowFavoritesOnly(true)}
            accessibilityLabel="Afficher uniquement les favoris"
            accessibilityRole="button"
            accessibilityState={{ selected: showFavoritesOnly }}
          >
            <Text style={styles.filterPillIcon}>⭐</Text>
            <Text style={[styles.filterPillText, showFavoritesOnly && styles.filterPillTextActive]} allowFontScaling numberOfLines={1}>
              Favoris
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{showFavoritesOnly ? '⭐' : '🍳'}</Text>
            <Text style={styles.emptyText} allowFontScaling>
              {showFavoritesOnly ? 'Aucun favori' : 'Aucune recette'}
            </Text>
            <Text style={styles.emptySubtext} allowFontScaling>
              {showFavoritesOnly
                ? 'Marquez des recettes en favori avec ⭐ pour les retrouver ici.'
                : 'Ajoutez votre première recette via le bouton + ci-dessous.'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddRecipe')}
        accessibilityLabel="Ajouter une nouvelle recette"
        accessibilityRole="button"
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
