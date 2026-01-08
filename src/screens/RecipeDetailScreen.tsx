/**
 * src/screens/RecipeDetailScreen.tsx
 *
 * Écran de détail et d'édition d'une recette.
 *
 * Fonctionnalités :
 * - Affichage complet de la recette (nom, livre source, tags, notes)
 * - Mode édition in-place pour modifier nom, tags et notes
 * - Toggle favori avec étoile interactive
 * - Ajout/suppression de tags avec suggestions
 * - Navigation vers le livre source si disponible
 * - Suppression de la recette avec confirmation
 * - Sauvegarde automatique des modifications
 *
 * Mode édition :
 * - Activation via bouton "Modifier"
 * - Champs éditables : nom, notes
 * - Gestion des tags : ajout via suggestions ou création libre, suppression
 * - Modal de sélection de tags depuis la liste globale
 * - Boutons Annuler/Enregistrer
 *
 * Design :
 * - Header avec titre et étoile de favori
 * - Cartes d'information (livre source, tags, notes)
 * - Mode édition avec champs de saisie in-place
 * - Suggestions de tags en temps réel
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Modal, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes, shadows } from '../theme/responsive';
import * as ImagePicker from 'expo-image-picker';

type RecipeDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>;
type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

interface Props {
  navigation: RecipeDetailScreenNavigationProp;
  route: RecipeDetailScreenRouteProp;
}

export default function RecipeDetailScreen({ navigation, route }: Props) {
  const { recipeId } = route.params;
  const { recipes, books, deleteRecipe, toggleFavorite, updateRecipe, tags: availableTags } = useApp();
  const { theme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedRecipeImage, setEditedRecipeImage] = useState<string | undefined>(undefined);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  
  const recipe = recipes.find(r => r.id === recipeId);
  const book = recipe?.bookId ? books.find(b => b.id === recipe.bookId) : null;

  const filteredTagSuggestions = availableTags.filter(tag =>
    newTagInput.length > 0 &&
    tag.toLowerCase().includes(newTagInput.toLowerCase()) &&
    !editedTags.includes(tag)
  );

  if (!recipe) {
    return (
      <View style={styles(theme).container}>
        <Text style={styles(theme).emptyText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Recette non trouvée</Text>
      </View>
    );
  }

  const startEditing = () => {
    setEditedName(recipe.name);
    setEditedNotes(recipe.notes);
    setEditedTags([...recipe.tags]);
    setEditedRecipeImage(recipe.recipeImage);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName('');
    setEditedNotes('');
    setEditedTags([]);
    setEditedRecipeImage(undefined);
  };

  const saveEditing = async () => {
    if (!editedName.trim()) {
      Alert.alert('Erreur', 'Le nom de la recette est obligatoire');
      return;
    }

    const updatedRecipe: Recipe = {
      ...recipe,
      name: editedName.trim(),
      notes: editedNotes.trim(),
      tags: editedTags,
      recipeImage: editedRecipeImage,
    };

    await updateRecipe(updatedRecipe);
    setIsEditing(false);
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la galerie pour ajouter une photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedRecipeImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', 'Vous devez autoriser l\'accès à la caméra pour prendre une photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditedRecipeImage(result.assets[0].uri);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !editedTags.includes(tag.trim())) {
      setEditedTags([...editedTags, tag.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter(t => t !== tag));
  };

  const quickAddTag = async (tag: string) => {
    if (!recipe.tags.includes(tag)) {
      const updatedRecipe: Recipe = {
        ...recipe,
        tags: [...recipe.tags, tag],
      };
      await updateRecipe(updatedRecipe);
    }
  };

  const handleAddCustomTag = async () => {
    const trimmedTag = customTagInput.trim();
    if (!trimmedTag) {
      Alert.alert('Erreur', 'Le nom du tag ne peut pas être vide');
      return;
    }
    if (recipe.tags.includes(trimmedTag)) {
      Alert.alert('Erreur', 'Ce tag est déjà ajouté à la recette');
      return;
    }
    await quickAddTag(trimmedTag);
    setCustomTagInput('');
    setShowAddTag(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la recette',
      'Êtes-vous sûr de vouloir supprimer cette recette ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipeId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const currentStyles = styles(theme);

  if (isEditing) {
    return (
      <ScrollView style={currentStyles.container}>
        <View style={currentStyles.content}>
          <Text style={currentStyles.editTitle} allowFontScaling numberOfLines={2} ellipsizeMode="tail">Modifier la recette</Text>

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Nom de la recette *</Text>
          <TextInput
            style={currentStyles.input}
            value={editedName}
            onChangeText={setEditedName}
            placeholder="Nom de la recette"
            placeholderTextColor={theme.text.tertiary}
            allowFontScaling
            accessibilityLabel="Nom de la recette"
            accessibilityHint="Entrez le nom de la recette"
          />

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Tags</Text>
          <View style={currentStyles.tagsContainer}>
            {editedTags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={currentStyles.editTag}
                onPress={() => handleRemoveTag(tag)}
                accessibilityLabel={`Supprimer le tag ${tag}`}
                accessibilityRole="button"
              >
                <Text style={currentStyles.editTagText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag} ×</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={currentStyles.input}
            value={newTagInput}
            onChangeText={setNewTagInput}
            placeholder="Ajouter un tag..."
            placeholderTextColor={theme.text.tertiary}
            onSubmitEditing={() => handleAddTag(newTagInput)}
            allowFontScaling
            accessibilityLabel="Ajouter un tag"
            accessibilityHint="Entrez un nom de tag et validez pour l'ajouter"
          />

          {newTagInput.length > 0 && (
            <View style={currentStyles.suggestions}>
              {filteredTagSuggestions.length > 0 ? (
                filteredTagSuggestions.slice(0, 5).map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={currentStyles.suggestion}
                    onPress={() => handleAddTag(tag)}
                    accessibilityLabel={`Ajouter le tag ${tag}`}
                    accessibilityRole="button"
                  >
                    <Text style={currentStyles.suggestionText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={currentStyles.suggestion}
                  onPress={() => handleAddTag(newTagInput)}
                  accessibilityLabel={`Créer le nouveau tag ${newTagInput}`}
                  accessibilityRole="button"
                >
                  <Text style={currentStyles.suggestionText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Créer "{newTagInput}"</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Notes personnelles</Text>
          <TextInput
            style={[currentStyles.input, currentStyles.textArea]}
            value={editedNotes}
            onChangeText={setEditedNotes}
            placeholder="Notes..."
            placeholderTextColor={theme.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            allowFontScaling
            accessibilityLabel="Notes personnelles"
            accessibilityHint="Entrez vos notes sur la recette"
          />

          <Text style={currentStyles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Photo de la recette</Text>
          {editedRecipeImage ? (
            <>
              <Image source={{ uri: editedRecipeImage }} style={currentStyles.imagePreview} resizeMode="cover" accessible accessibilityLabel="Aperçu de la photo de la recette" />
              <TouchableOpacity style={currentStyles.removeImageButton} onPress={() => setEditedRecipeImage(undefined)} accessibilityLabel="Supprimer la photo de la recette" accessibilityRole="button">
                <Text style={currentStyles.removeImageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Supprimer la photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={currentStyles.imageButtonsContainer}>
              <TouchableOpacity style={currentStyles.imageButton} onPress={handleTakePhoto} accessibilityLabel="Prendre une photo" accessibilityRole="button">
                <Text style={currentStyles.imageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">📷 Prendre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={currentStyles.imageButton} onPress={handlePickImage} accessibilityLabel="Choisir une photo de la galerie" accessibilityRole="button">
                <Text style={currentStyles.imageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">🖼️ Galerie</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={currentStyles.editButtons}>
            <TouchableOpacity style={currentStyles.cancelButton} onPress={cancelEditing} accessibilityLabel="Annuler les modifications" accessibilityRole="button">
              <Text style={currentStyles.cancelButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={currentStyles.saveEditButton} onPress={saveEditing} accessibilityLabel="Enregistrer les modifications" accessibilityRole="button">
              <Text style={currentStyles.saveEditButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={currentStyles.container}>
      <View style={currentStyles.content}>
        <View style={currentStyles.header}>
          <Text style={currentStyles.title} allowFontScaling numberOfLines={3} ellipsizeMode="tail">{recipe.name}</Text>
          <View style={currentStyles.headerActions}>
            <TouchableOpacity onPress={startEditing} style={currentStyles.editIconButton} accessibilityLabel="Modifier la recette" accessibilityRole="button">
              <Text style={currentStyles.editIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(recipeId)} accessibilityLabel={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"} accessibilityRole="button">
              <Text style={currentStyles.favoriteIcon}>
                {recipe.isFavorite ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={currentStyles.section}>
          <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Source</Text>
          {book ? (
            <TouchableOpacity
              style={currentStyles.bookLink}
              onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}
              accessibilityLabel={`Ouvrir le livre source ${book.title}`}
              accessibilityRole="button"
            >
              <Text style={currentStyles.bookLinkText} allowFontScaling numberOfLines={2} ellipsizeMode="tail">📚 {book.title}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={currentStyles.infoText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Recette personnelle</Text>
          )}
        </View>

        {recipe.tags.length > 0 && (
          <View style={currentStyles.section}>
            <View style={currentStyles.sectionHeader}>
              <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Tags</Text>
              <TouchableOpacity
                style={currentStyles.addTagButton}
                onPress={() => setShowAddTag(true)}
                accessibilityLabel="Ajouter un tag"
                accessibilityRole="button"
              >
                <Text style={currentStyles.addTagButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">+ Ajouter</Text>
              </TouchableOpacity>
            </View>
            <View style={currentStyles.tagsContainer}>
              {recipe.tags.map((tag) => (
                <View key={tag} style={currentStyles.tag} accessible accessibilityLabel={`Tag ${tag}`}>
                  <Text style={currentStyles.tagText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {recipe.tags.length === 0 && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Tags</Text>
            <TouchableOpacity
              style={currentStyles.emptyTagButton}
              onPress={() => setShowAddTag(true)}
              accessibilityLabel="Ajouter des tags"
              accessibilityRole="button"
            >
              <Text style={currentStyles.emptyTagButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">+ Ajouter des tags</Text>
            </TouchableOpacity>
          </View>
        )}

        {recipe.recipeImage && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Photo de la recette</Text>
            <Image source={{ uri: recipe.recipeImage }} style={currentStyles.recipeImage} resizeMode="cover" accessible accessibilityLabel={`Photo de la recette ${recipe.name}`} />
          </View>
        )}

        {recipe.notes && (
          <View style={currentStyles.section}>
            <Text style={currentStyles.sectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Notes personnelles</Text>
            <Text style={currentStyles.notes} allowFontScaling>{recipe.notes}</Text>
          </View>
        )}

        <TouchableOpacity style={currentStyles.deleteButton} onPress={handleDelete} accessibilityLabel="Supprimer cette recette" accessibilityRole="button">
          <Text style={currentStyles.deleteButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Supprimer cette recette</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAddTag}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddTag(false)}
      >
        <TouchableOpacity
          style={currentStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddTag(false)}
          accessibilityLabel="Fermer le dialogue"
          accessibilityRole="button"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={currentStyles.modalContent}>
              <Text style={currentStyles.modalTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Ajouter un tag</Text>

              <Text style={currentStyles.modalSectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Tags existants</Text>
              <View style={currentStyles.quickTagsContainer}>
                {availableTags.filter(tag => !recipe.tags.includes(tag)).slice(0, 12).map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={currentStyles.quickTag}
                    onPress={async () => {
                      await quickAddTag(tag);
                      setShowAddTag(false);
                    }}
                    accessibilityLabel={`Ajouter le tag ${tag}`}
                    accessibilityRole="button"
                  >
                    <Text style={currentStyles.quickTagText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={currentStyles.modalSectionTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Ou créer un nouveau tag</Text>
              <View style={currentStyles.customTagContainer}>
                <TextInput
                  style={currentStyles.customTagInput}
                  value={customTagInput}
                  onChangeText={setCustomTagInput}
                  placeholder="Nom du nouveau tag..."
                  placeholderTextColor={theme.text.tertiary}
                  onSubmitEditing={handleAddCustomTag}
                  allowFontScaling
                  accessibilityLabel="Nom du nouveau tag"
                  accessibilityHint="Entrez le nom d'un nouveau tag"
                />
                <TouchableOpacity
                  style={currentStyles.addCustomTagButton}
                  onPress={handleAddCustomTag}
                  accessibilityLabel="Ajouter le nouveau tag"
                  accessibilityRole="button"
                >
                  <Text style={currentStyles.addCustomTagButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Ajouter</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={currentStyles.modalCloseButton}
                onPress={() => {
                  setShowAddTag(false);
                  setCustomTagInput('');
                }}
                accessibilityLabel="Fermer le dialogue"
                accessibilityRole="button"
              >
                <Text style={currentStyles.modalCloseButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Fermer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  editIconButton: {
    padding: spacing.xs,
  },
  editIcon: {
    fontSize: iconSizes.base,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.text.primary,
    flex: 1,
    paddingRight: spacing.sm,
    fontFamily: 'serif',
  },
  editTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.text.primary,
    marginBottom: spacing.base,
    fontFamily: 'serif',
  },
  favoriteIcon: {
    fontSize: iconSizes.xl,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: theme.surface,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    ...shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: theme.text.primary,
  },
  addTagButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  addTagButtonText: {
    color: theme.button.text,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  emptyTagButton: {
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
    borderStyle: 'dashed',
  },
  emptyTagButtonText: {
    color: theme.text.secondary,
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  infoText: {
    fontSize: fontSizes.md,
    color: theme.text.secondary,
  },
  bookLink: {
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: theme.card.border,
    ...shadows.elevated,
  },
  bookLinkText: {
    fontSize: fontSizes.md,
    color: theme.text.primary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: theme.tag.background,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tagText: {
    fontSize: fontSizes.base,
    color: theme.tag.text,
  },
  editTag: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  editTagText: {
    color: theme.button.text,
    fontSize: fontSizes.base,
  },
  notes: {
    fontSize: fontSizes.md,
    color: theme.text.primary,
    lineHeight: 24,
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  deleteButton: {
    backgroundColor: theme.error,
    padding: spacing.lg,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    marginTop: spacing.base,
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
  },
  textArea: {
    minHeight: 120,
  },
  suggestions: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  suggestion: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  suggestionText: {
    fontSize: fontSizes.base,
    color: theme.text.primary,
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
  emptyText: {
    textAlign: 'center',
    color: theme.text.tertiary,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    width: '100%',
    maxWidth: 400,
    ...shadows.modal,
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: theme.text.primary,
    marginBottom: spacing.base,
  },
  quickTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  quickTag: {
    backgroundColor: theme.tag.background,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  quickTagText: {
    fontSize: fontSizes.base,
    color: theme.tag.text,
    fontWeight: '500',
  },
  modalCloseButton: {
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  modalCloseButtonText: {
    color: theme.text.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  modalSectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: theme.text.primary,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  customTagContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  customTagInput: {
    flex: 1,
    backgroundColor: theme.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: theme.card.border,
    color: theme.text.primary,
  },
  addCustomTagButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCustomTagButtonText: {
    color: theme.button.text,
    fontSize: fontSizes.base,
    fontWeight: '600',
  },
  recipeImage: {
    width: '100%',
    height: 250,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  imageButton: {
    flex: 1,
    backgroundColor: theme.card.background,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  imageButtonText: {
    color: theme.text.primary,
    fontSize: fontSizes.base,
  },
  removeImageButton: {
    backgroundColor: theme.card.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: theme.card.border,
  },
  removeImageButtonText: {
    color: theme.text.secondary,
    fontSize: fontSizes.base,
  },
});