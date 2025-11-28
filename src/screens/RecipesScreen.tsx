// src/screens/RecipesScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';

type RecipesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Recipes'>;

interface Props {
  navigation: RecipesScreenNavigationProp;
}

export default function RecipesScreen({ navigation }: Props) {
  const { recipes, books, toggleFavorite } = useApp();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFavorites = !showFavoritesOnly || recipe.isFavorite;
    
    return matchesSearch && matchesFavorites;
  });

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
    searchInput: {
      backgroundColor: theme.surface,
      padding: 15,
      margin: 15,
      marginBottom: 10,
      borderRadius: 12,
      fontSize: 16,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    filterButton: {
      backgroundColor: theme.surface,
      padding: 12,
      marginHorizontal: 15,
      marginBottom: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    filterButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterButtonText: {
      fontSize: 14,
      color: theme.text.secondary,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: theme.button.text,
    },
    recipeCard: {
      backgroundColor: theme.card.background,
      padding: 15,
      marginHorizontal: 15,
      marginBottom: 10,
      borderRadius: 16,
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
      marginBottom: 5,
    },
    recipeName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text.primary,
      flex: 1,
    },
    favoriteIcon: {
      fontSize: 24,
      marginLeft: 10,
    },
    bookSource: {
      fontSize: 14,
      color: theme.text.secondary,
      marginBottom: 10,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
      alignItems: 'center',
    },
    tag: {
      backgroundColor: theme.tag.background,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: theme.tag.text,
    },
    moreTagsText: {
      fontSize: 12,
      color: theme.text.tertiary,
      marginLeft: 5,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: theme.text.tertiary,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: 18,
      margin: 15,
      borderRadius: 16,
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.button.text,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
    >
      <View style={styles.recipeInfo}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Text style={styles.favoriteIcon}>
              {item.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bookSource}>{getBookTitle(item.bookId)}</Text>
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom ou tag..."
        placeholderTextColor={theme.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity
        style={[styles.filterButton, showFavoritesOnly && styles.filterButtonActive]}
        onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
      >
        <Text style={[styles.filterButtonText, showFavoritesOnly && styles.filterButtonTextActive]}>
          {showFavoritesOnly ? '⭐ Favoris uniquement' : 'Toutes les recettes'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune recette pour le moment</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddRecipe')}
      >
        <Text style={styles.addButtonText}>+ Ajouter une recette</Text>
      </TouchableOpacity>
    </View>
  );
}