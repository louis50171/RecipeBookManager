/**
 * src/screens/RecipesScreen.tsx
 *
 * Écran d'affichage de la liste des recettes.
 *
 * Fonctionnalités :
 * - Liste complète de toutes les recettes
 * - Recherche par nom de recette ou tags
 * - Filtre pour afficher uniquement les favoris
 * - Toggle favori directement depuis la liste (étoile)
 * - Affichage du livre source de chaque recette
 * - Aperçu des tags (3 premiers + compteur)
 * - Navigation vers le détail au clic
 * - Bouton d'ajout de nouvelle recette
 *
 * Design :
 * - Cartes avec nom, livre source et tags
 * - Icône étoile interactive pour les favoris
 * - Bouton de filtre toggle (toutes/favoris)
 * - Recherche en temps réel
 */

import React, { useState } from 'react';
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

  /** État de la recherche */
  const [searchQuery, setSearchQuery] = useState('');

  /** État du filtre favoris */
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  /** Filtre les recettes selon la recherche et le filtre favoris */
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFavorites = !showFavoritesOnly || recipe.isFavorite;

    return matchesSearch && matchesFavorites;
  });

  /**
   * Retourne le titre du livre source d'une recette
   * @param bookId - ID du livre ou undefined pour recettes personnelles
   */
  const getBookTitle = (bookId?: string) => {
    if (!bookId) return 'Recette personnelle';
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Livre inconnu';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      paddingTop: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    menuIcon: {
      fontSize: iconSizes.base,
    },
    headerTitle: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xl : fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
      flex: 1,
    },
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
    },
    filterContainer: {
      flexDirection: 'row',
      marginHorizontal: spacing.base,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    filterButton: {
      flex: 1,
      backgroundColor: theme.card.background,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.card.border,
      flexDirection: 'row',
      gap: spacing.xs,
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterButtonText: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      fontWeight: '600',
    },
    filterButtonTextActive: {
      color: theme.button.text,
      fontWeight: 'bold',
    },
    filterIcon: {
      fontSize: fontSizes.md,
    },
    recipeCard: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      marginHorizontal: spacing.base,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.base,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    recipeInfo: {
      flex: 1,
    },
    recipeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    recipeName: {
      fontSize: fontSizes.lg,
      fontWeight: '600',
      color: theme.text.primary,
      flex: 1,
      flexShrink: 1,
    },
    favoriteIcon: {
      fontSize: iconSizes.base,
      marginLeft: spacing.sm,
    },
    bookSource: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      marginBottom: spacing.sm,
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
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    tagText: {
      fontSize: fontSizes.sm,
      color: theme.tag.text,
    },
    moreTagsText: {
      fontSize: fontSizes.sm,
      color: theme.text.tertiary,
      marginLeft: spacing.xs,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: spacing.xxl * 2,
      fontSize: fontSizes.md,
      color: theme.text.tertiary,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      margin: spacing.base,
      borderRadius: borderRadius.base,
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
  });

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      accessibilityLabel={`Ouvrir la recette ${item.name} du livre ${getBookTitle(item.bookId)}`}
      accessibilityRole="button"
    >
      <View style={styles.recipeInfo}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName} numberOfLines={2} ellipsizeMode="tail" allowFontScaling>{item.name}</Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            accessibilityLabel={item.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            accessibilityRole="button"
          >
            <Text style={styles.favoriteIcon}>
              {item.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bookSource} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{getBookTitle(item.bookId)}</Text>
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText} allowFontScaling>+{item.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
          accessibilityLabel="Ouvrir le menu de navigation"
          accessibilityRole="button"
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>Mes Recettes</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou tag..."
        placeholderTextColor={theme.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        allowFontScaling
        accessibilityLabel="Champ de recherche"
        accessibilityHint="Entrez un nom de recette ou un tag pour filtrer vos recettes"
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !showFavoritesOnly && styles.filterButtonActive]}
          onPress={() => setShowFavoritesOnly(false)}
          accessibilityLabel="Afficher toutes les recettes"
          accessibilityRole="button"
          accessibilityState={{ selected: !showFavoritesOnly }}
        >
          <Text style={[styles.filterIcon, !showFavoritesOnly && styles.filterButtonTextActive]}>📚</Text>
          <Text style={[styles.filterButtonText, !showFavoritesOnly && styles.filterButtonTextActive]} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
            Toutes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, showFavoritesOnly && styles.filterButtonActive]}
          onPress={() => setShowFavoritesOnly(true)}
          accessibilityLabel="Afficher uniquement les favoris"
          accessibilityRole="button"
          accessibilityState={{ selected: showFavoritesOnly }}
        >
          <Text style={[styles.filterIcon, showFavoritesOnly && styles.filterButtonTextActive]}>⭐</Text>
          <Text style={[styles.filterButtonText, showFavoritesOnly && styles.filterButtonTextActive]} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
            Favoris
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText} allowFontScaling>Aucune recette pour le moment</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe')}
        accessibilityLabel="Ajouter une nouvelle recette"
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText} allowFontScaling>+ Ajouter une recette</Text>
      </TouchableOpacity>
    </View>
  );
}