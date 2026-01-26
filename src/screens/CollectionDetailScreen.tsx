/**
 * src/screens/CollectionDetailScreen.tsx
 *
 * Écran de détail d'une collection et affichage de ses recettes.
 *
 * Fonctionnalités :
 * - Affichage du nom de la collection et de ses tags
 * - Liste des recettes correspondant aux tags de la collection
 * - Modification du nom et des tags de la collection
 * - Suppression de la collection
 * - Navigation vers le détail des recettes
 * - Toggle favori sur les recettes
 *
 * Design :
 * - Header avec nom de la collection et tags
 * - Liste de recettes filtrées par les tags
 * - Boutons d'édition et de suppression
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe, Collection } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes } from '../theme/responsive';

type CollectionDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CollectionDetail'>;
type CollectionDetailScreenRouteProp = RouteProp<RootStackParamList, 'CollectionDetail'>;

interface Props {
  navigation: CollectionDetailScreenNavigationProp;
  route: CollectionDetailScreenRouteProp;
}

export default function CollectionDetailScreen({ navigation, route }: Props) {
  const { collectionId } = route.params;
  const { collections, recipes, books, toggleFavorite, updateCollection, deleteCollection, tags: availableTags } = useApp();
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);

  const collection = collections.find(c => c.id === collectionId);

  if (!collection) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).emptyText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Collection non trouvée</Text>
      </View>
    );
  }

  // Filtre les recettes qui ont au moins un tag de la collection
  const filteredRecipes = recipes.filter(recipe =>
    recipe.tags.some(tag => collection.tags.includes(tag))
  );

  const getBookTitle = (bookId?: string) => {
    if (!bookId) return 'Recette personnelle';
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Livre inconnu';
  };

  const startEditing = () => {
    setEditedName(collection.name);
    setEditedTags([...collection.tags]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName('');
    setEditedTags([]);
  };

  const saveEditing = async () => {
    if (!editedName.trim()) {
      Alert.alert('Erreur', 'Le nom de la collection est obligatoire');
      return;
    }

    if (editedTags.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un tag');
      return;
    }

    const updatedCollection: Collection = {
      ...collection,
      name: editedName.trim(),
      tags: editedTags,
    };

    await updateCollection(updatedCollection);
    setIsEditing(false);
  };

  const toggleTag = (tag: string) => {
    if (editedTags.includes(tag)) {
      setEditedTags(editedTags.filter(t => t !== tag));
    } else {
      setEditedTags([...editedTags, tag]);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la collection',
      'Êtes-vous sûr de vouloir supprimer cette collection ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteCollection(collectionId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const currentStyles = styles(theme);

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={currentStyles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      accessibilityLabel={`Ouvrir la recette ${item.name}`}
      accessibilityRole="button"
    >
      <View style={currentStyles.recipeHeader}>
        <Text style={currentStyles.recipeName} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{item.name}</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          accessibilityLabel={item.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          accessibilityRole="button"
        >
          <Text style={currentStyles.favoriteIcon}>
            {item.isFavorite ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={currentStyles.recipeSource} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
        {getBookTitle(item.bookId)}
      </Text>
      {item.tags.length > 0 && (
        <View style={currentStyles.tagsPreview}>
          {item.tags.slice(0, 3).map(tag => (
            <View key={tag} style={currentStyles.tag}>
              <Text style={currentStyles.tagText} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={currentStyles.moreTagsText} allowFontScaling>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (isEditing) {
    return (
      <ScrollView style={currentStyles.container}>
        <View style={currentStyles.content}>
          <Text style={currentStyles.editTitle} allowFontScaling numberOfLines={2} ellipsizeMode="tail">Modifier la collection</Text>

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Nom de la collection *</Text>
          <TextInput
            style={currentStyles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Nom de la collection"
            placeholderTextColor={theme.text.tertiary}
            allowFontScaling
            accessibilityLabel="Champ nom de la collection"
            accessibilityHint="Entrez le nom de la collection"
          />

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Sélectionnez les tags *</Text>
          <View style={currentStyles.tagsContainer}>
            {availableTags.map(tag => {
              const isSelected = editedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[currentStyles.tagOption, isSelected && currentStyles.tagOptionSelected]}
                  onPress={() => toggleTag(tag)}
                  accessibilityLabel={isSelected ? `Tag ${tag} sélectionné, appuyez pour désélectionner` : `Tag ${tag} non sélectionné, appuyez pour sélectionner`}
                  accessibilityRole="button"
                >
                  <Text style={[currentStyles.tagOptionText, isSelected && currentStyles.tagOptionTextSelected]} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={currentStyles.editButtons}>
            <TouchableOpacity
              style={currentStyles.cancelButton}
              onPress={cancelEditing}
              accessibilityLabel="Annuler les modifications"
              accessibilityRole="button"
            >
              <Text style={currentStyles.cancelButtonText} allowFontScaling>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={currentStyles.saveEditButton}
              onPress={saveEditing}
              accessibilityLabel="Enregistrer les modifications"
              accessibilityRole="button"
            >
              <Text style={currentStyles.saveEditButtonText} allowFontScaling>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.header}>
        <View style={currentStyles.headerTop}>
          <Text style={currentStyles.title} allowFontScaling numberOfLines={2} ellipsizeMode="tail">{collection.name}</Text>
          <TouchableOpacity
            onPress={startEditing}
            style={currentStyles.editIconButton}
            accessibilityLabel="Modifier la collection"
            accessibilityRole="button"
          >
            <Text style={currentStyles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <View style={currentStyles.tagsPreview}>
          {collection.tags.map(tag => (
            <View key={tag} style={currentStyles.tag}>
              <Text style={currentStyles.tagText} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={currentStyles.recipeCount}>
        <Text style={currentStyles.recipeCountText} allowFontScaling numberOfLines={1}>
          {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        contentContainerStyle={currentStyles.listContent}
        ListEmptyComponent={
          <View style={currentStyles.emptyContainer}>
            <Text style={currentStyles.emptyIcon}>🍳</Text>
            <Text style={currentStyles.emptyText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Aucune recette trouvée</Text>
            <Text style={currentStyles.emptySubtext} allowFontScaling numberOfLines={2} ellipsizeMode="tail">
              Ajoutez des tags à vos recettes pour les voir apparaître ici
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={currentStyles.deleteButton}
        onPress={handleDelete}
        accessibilityLabel="Supprimer cette collection"
        accessibilityRole="button"
      >
        <Text style={currentStyles.deleteButtonText} allowFontScaling>Supprimer cette collection</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: theme.surface,
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.card.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.text.primary,
    flex: 1,
    fontFamily: 'serif',
  },
  editTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.text.primary,
    marginBottom: spacing.base,
    fontFamily: 'serif',
  },
  editIconButton: {
    padding: spacing.xs,
  },
  editIcon: {
    fontSize: iconSizes.base,
  },
  tagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: theme.tag.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: fontSizes.sm,
    color: theme.tag.text,
  },
  recipeCount: {
    padding: spacing.base,
    paddingBottom: spacing.sm,
  },
  recipeCountText: {
    fontSize: fontSizes.base,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: spacing.base,
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
    marginRight: spacing.sm,
  },
  favoriteIcon: {
    fontSize: iconSizes.base,
  },
  recipeSource: {
    fontSize: fontSizes.sm,
    color: theme.text.secondary,
    marginBottom: spacing.xs,
  },
  moreTagsText: {
    fontSize: fontSizes.sm,
    color: theme.text.tertiary,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: iconSizes.xl * 2,
    marginBottom: spacing.base,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: theme.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fontSizes.base,
    color: theme.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
  },
  deleteButton: {
    backgroundColor: theme.error,
    padding: spacing.lg,
    margin: spacing.base,
    borderRadius: borderRadius.base,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: spacing.xs,
    marginTop: spacing.base,
  },
  input: {
    backgroundColor: theme.surface,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: theme.card.border,
    color: theme.text.primary,
    marginBottom: spacing.base,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tagOption: {
    backgroundColor: theme.card.background,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  tagOptionSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  tagOptionText: {
    fontSize: fontSizes.base,
    color: theme.text.primary,
  },
  tagOptionTextSelected: {
    color: theme.button.text,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.card.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  cancelButtonText: {
    color: theme.text.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveEditButtonText: {
    color: theme.button.text,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
