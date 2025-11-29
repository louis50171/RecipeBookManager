/**
 * src/screens/BookDetailScreen.tsx
 *
 * Écran de détail d'un livre de recettes.
 *
 * Fonctionnalités :
 * - Affichage complet des informations du livre (titre, auteur, éditeur, année, catégorie, couverture)
 * - Liste des recettes associées à ce livre avec navigation vers le détail
 * - Bouton de modification du livre
 * - Bouton de suppression avec confirmation
 * - Gestion du cas "livre non trouvé"
 *
 * Design :
 * - Image de couverture en grand format en haut
 * - Informations organisées en cartes
 * - Liste des recettes liées avec compteur
 * - Boutons d'action colorés en bas
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

type BookDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;
type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

interface Props {
  navigation: BookDetailScreenNavigationProp;
  route: BookDetailScreenRouteProp;
}

export default function BookDetailScreen({ navigation, route }: Props) {
  const { bookId } = route.params;
  const { books, recipes, deleteBook } = useApp();
  const { theme } = useTheme();

  /** Recherche le livre par son ID */
  const book = books.find(b => b.id === bookId);

  /** Récupère toutes les recettes associées à ce livre */
  const bookRecipes = recipes.filter(r => r.bookId === bookId);

  if (!book) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).emptyText}>Livre non trouvé</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le livre',
      'Êtes-vous sûr de vouloir supprimer ce livre ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(bookId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const currentStyles = styles(theme);

  return (
    <ScrollView style={currentStyles.container}>
      <View style={currentStyles.content}>
        <View style={currentStyles.header}>
          {book.coverImage ? (
            <Image source={{ uri: book.coverImage }} style={currentStyles.coverImage} />
          ) : (
            <View style={currentStyles.placeholderCover}>
              <Text style={currentStyles.placeholderIcon}>📚</Text>
              <Text style={currentStyles.placeholderTitle} numberOfLines={3}>
                {book.title}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={currentStyles.editButton}
            onPress={() => navigation.navigate('AddBook', { bookId: book.id })}
          >
            <Text style={currentStyles.editButtonText}>✏️ Modifier</Text>
          </TouchableOpacity>
        </View>

        <Text style={currentStyles.title}>{book.title}</Text>
        <Text style={currentStyles.author}>Par {book.author}</Text>
        
        {book.editor && (
          <Text style={currentStyles.info}>Éditeur: {book.editor}</Text>
        )}
        {book.year && (
          <Text style={currentStyles.info}>Année: {book.year}</Text>
        )}
        {book.category && (
          <Text style={currentStyles.info}>Catégorie: {book.category}</Text>
        )}

        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle}>Recettes de ce livre ({bookRecipes.length})</Text>
          {bookRecipes.length === 0 ? (
            <Text style={currentStyles.emptyText}>Aucune recette pour ce livre</Text>
          ) : (
            bookRecipes.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={currentStyles.recipeCard}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
              >
                <Text style={currentStyles.recipeName}>{recipe.name}</Text>
                {recipe.isFavorite && <Text style={currentStyles.favorite}>⭐</Text>}
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={currentStyles.deleteButton} onPress={handleDelete}>
          <Text style={currentStyles.deleteButtonText}>Supprimer ce livre</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 150,
    height: 215,
    borderRadius: 12,
    marginBottom: 15,
  },
  placeholderCover: {
    width: 150,
    height: 215,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderTitle: {
    color: theme.button.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editButtonText: {
    color: theme.button.text,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text.primary,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  author: {
    fontSize: 18,
    color: theme.text.secondary,
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 5,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 15,
  },
  recipeCard: {
    backgroundColor: theme.card.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  recipeName: {
    fontSize: 16,
    color: theme.text.primary,
  },
  favorite: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.text.tertiary,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: theme.error,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});