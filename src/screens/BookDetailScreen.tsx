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
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';
import { formatAuthorDisplay } from '../utils/formatters';

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
        <Text style={styles(theme).emptyText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Livre non trouvé</Text>
      </View>
    );
  }

  const handleDelete = () => {
    const recipeCount = bookRecipes.length;
    const message = recipeCount > 0
      ? `Êtes-vous sûr de vouloir supprimer ce livre ?\n\n${recipeCount} recette${recipeCount > 1 ? 's' : ''} deviendra${recipeCount > 1 ? 'ont' : ''} des recettes personnelles (sans livre associé).`
      : 'Êtes-vous sûr de vouloir supprimer ce livre ?';

    Alert.alert(
      'Supprimer le livre',
      message,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const detachedCount = await deleteBook(bookId);
            navigation.goBack();

            // Afficher une confirmation si des recettes ont été détachées
            if (detachedCount > 0) {
              Alert.alert(
                'Livre supprimé',
                `${detachedCount} recette${detachedCount > 1 ? 's ont' : ' a'} été détachée${detachedCount > 1 ? 's' : ''} et ${detachedCount > 1 ? 'sont' : 'est'} maintenant dans vos recettes personnelles.`
              );
            }
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
            <Image source={{ uri: book.coverImage }} style={currentStyles.coverImage} accessible accessibilityLabel={`Couverture du livre ${book.title}`} />
          ) : (
            <View style={currentStyles.placeholderCover}>
              <Text style={currentStyles.placeholderIcon}>📚</Text>
              <Text style={currentStyles.placeholderTitle} numberOfLines={3} ellipsizeMode="tail" allowFontScaling>
                {book.title}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={currentStyles.editButton}
            onPress={() => navigation.navigate('AddBook', { bookId: book.id })}
            accessibilityLabel={`Modifier le livre ${book.title}`}
            accessibilityRole="button"
          >
            <Text style={currentStyles.editButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">✏️ Modifier</Text>
          </TouchableOpacity>
        </View>

        <Text style={currentStyles.title} allowFontScaling numberOfLines={3} ellipsizeMode="tail">{book.title}</Text>
        <Text style={currentStyles.author} allowFontScaling numberOfLines={2} ellipsizeMode="tail">Par {formatAuthorDisplay(book.author, book.pseudonym)}</Text>

        {book.editor && (
          <Text style={currentStyles.info} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Éditeur: {book.editor}</Text>
        )}
        {book.year && (
          <Text style={currentStyles.info} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Année: {book.year}</Text>
        )}
        {book.category && (
          <Text style={currentStyles.info} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Catégorie: {book.category}</Text>
        )}

        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Recettes de ce livre ({bookRecipes.length})</Text>
          {bookRecipes.length === 0 ? (
            <Text style={currentStyles.emptyText} allowFontScaling numberOfLines={2} ellipsizeMode="tail">Aucune recette pour ce livre</Text>
          ) : (
            bookRecipes.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={currentStyles.recipeCard}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
                accessibilityLabel={`Ouvrir la recette ${recipe.name}${recipe.isFavorite ? ', marquée comme favorite' : ''}`}
                accessibilityRole="button"
              >
                <Text style={currentStyles.recipeName} allowFontScaling numberOfLines={2} ellipsizeMode="tail">{recipe.name}</Text>
                {recipe.isFavorite && <Text style={currentStyles.favorite}>⭐</Text>}
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity style={currentStyles.deleteButton} onPress={handleDelete} accessibilityLabel={`Supprimer le livre ${book.title}`} accessibilityRole="button">
          <Text style={currentStyles.deleteButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Supprimer ce livre</Text>
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
    padding: spacing.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  coverImage: {
    width: 150,
    height: 215,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  placeholderCover: {
    width: 150,
    height: 215,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  placeholderTitle: {
    color: theme.button.text,
    fontSize: fontSizes.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  editButtonText: {
    color: theme.button.text,
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.text.primary,
    marginBottom: spacing.sm,
    fontFamily: 'serif',
  },
  author: {
    fontSize: fontSizes.lg,
    color: theme.text.secondary,
    marginBottom: spacing.base,
  },
  info: {
    fontSize: fontSizes.base,
    color: theme.text.secondary,
    marginBottom: spacing.xs,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: spacing.base,
  },
  recipeCard: {
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  recipeName: {
    fontSize: fontSizes.md,
    color: theme.text.primary,
  },
  favorite: {
    fontSize: iconSizes.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.text.tertiary,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: theme.error,
    padding: spacing.lg,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});