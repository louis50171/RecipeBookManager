/**
 * src/screens/AddRecipeScreen.tsx
 *
 * Écran d'ajout d'une nouvelle recette.
 *
 * Fonctionnalités :
 * - Formulaire de création de recette
 * - Champs : nom (obligatoire), livre source (optionnel), tags, notes
 * - Sélection du livre source depuis la liste des livres
 * - Ajout de tags via suggestions ou saisie libre
 * - Validation du nom avant sauvegarde
 * - Génération automatique d'ID et de date de création
 * - Navigation automatique vers les recettes après sauvegarde
 *
 * Gestion des tags :
 * - Affichage des tags disponibles filtrés par la saisie
 * - Ajout en cliquant sur une suggestion ou en validant la saisie
 * - Suppression des tags sélectionnés
 * - Création automatique de nouveaux tags via l'AppContext
 *
 * Design :
 * - Formulaire avec sections organisées
 * - Sélecteur de livre avec modal
 * - Tags affichés en chips colorées
 * - Boutons d'action en bas (Annuler/Enregistrer)
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';
import { spacing, fontSizes, borderRadius } from '../theme/responsive';
import { formatAuthorDisplay } from '../utils/formatters';
import * as ImagePicker from 'expo-image-picker';

type AddRecipeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddRecipe'>;

interface Props {
  navigation: AddRecipeScreenNavigationProp;
}

export default function AddRecipeScreen({ navigation }: Props) {
  const { addRecipe, books, tags: availableTags } = useApp();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(undefined);
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recipeImage, setRecipeImage] = useState<string | undefined>(undefined);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagInput.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  const selectedBook = books.find(b => b.id === selectedBookId);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
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
      setRecipeImage(result.assets[0].uri);
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
      setRecipeImage(result.assets[0].uri);
    }
  };

  const handleImageOptions = () => {
    Alert.alert(
      'Ajouter une photo',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choisir depuis la galerie',
          onPress: handlePickImage,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom de la recette est obligatoire');
      return;
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      bookId: selectedBookId,
      tags: selectedTags,
      notes: notes.trim(),
      isFavorite: false,
      recipeImage: recipeImage,
      createdAt: new Date().toISOString(),
    };

    await addRecipe(newRecipe);
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    form: {
      padding: spacing.base,
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
      minHeight: 100,
    },
    combobox: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    comboboxText: {
      fontSize: fontSizes.md,
      color: theme.text.primary,
      flex: 1,
    },
    comboboxPlaceholder: {
      color: theme.text.tertiary,
    },
    comboboxArrow: {
      fontSize: fontSizes.xs,
      color: theme.text.secondary,
      marginLeft: spacing.sm,
    },
    bookPickerContainer: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      marginTop: spacing.xs,
      maxHeight: 250,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    bookPickerOption: {
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    bookPickerOptionSelected: {
      backgroundColor: theme.card.background,
    },
    bookPickerOptionText: {
      fontSize: fontSizes.md,
      color: theme.text.primary,
      fontWeight: '500',
    },
    bookPickerOptionAuthor: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    selectedTag: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    selectedTagText: {
      color: theme.button.text,
      fontSize: fontSizes.base,
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
    saveButton: {
      backgroundColor: theme.primary,
      padding: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      marginTop: spacing.xxl,
    },
    saveButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
    imageSection: {
      marginTop: spacing.base,
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
      backgroundColor: theme.surface,
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
      backgroundColor: theme.surface,
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Nom de la recette *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Poulet rôti"
          placeholderTextColor={theme.text.tertiary}
          allowFontScaling
          accessibilityLabel="Nom de la recette"
          accessibilityHint="Champ obligatoire, entrez le nom de votre recette"
        />

        <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Livre source (optionnel)</Text>
        <TouchableOpacity
          style={styles.combobox}
          onPress={() => setShowBookPicker(!showBookPicker)}
          accessibilityLabel={`Sélectionner un livre source, ${selectedBook ? selectedBook.title : 'aucun livre sélectionné'}`}
          accessibilityRole="button"
        >
          <Text style={[styles.comboboxText, !selectedBook && styles.comboboxPlaceholder]} allowFontScaling numberOfLines={1} ellipsizeMode="tail">
            {selectedBook ? selectedBook.title : 'Aucun (recette personnelle)'}
          </Text>
          <Text style={styles.comboboxArrow} allowFontScaling>{showBookPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showBookPicker && (
          <View style={styles.bookPickerContainer}>
            <TouchableOpacity
              style={[styles.bookPickerOption, !selectedBookId && styles.bookPickerOptionSelected]}
              onPress={() => {
                setSelectedBookId(undefined);
                setShowBookPicker(false);
              }}
              accessibilityLabel="Aucun livre, recette personnelle"
              accessibilityRole="button"
            >
              <Text style={styles.bookPickerOptionText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Aucun (recette personnelle)</Text>
            </TouchableOpacity>
            {books.map(book => (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookPickerOption, selectedBookId === book.id && styles.bookPickerOptionSelected]}
                onPress={() => {
                  setSelectedBookId(book.id);
                  setShowBookPicker(false);
                }}
                accessibilityLabel={`Sélectionner ${book.title} de ${formatAuthorDisplay(book.author, book.pseudonym)}`}
                accessibilityRole="button"
              >
                <Text style={styles.bookPickerOptionText} allowFontScaling numberOfLines={2} ellipsizeMode="tail">{book.title}</Text>
                <Text style={styles.bookPickerOptionAuthor} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{formatAuthorDisplay(book.author, book.pseudonym)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Tags</Text>
        <View style={styles.tagsContainer}>
          {selectedTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={styles.selectedTag}
              onPress={() => handleRemoveTag(tag)}
              accessibilityLabel={`Retirer le tag ${tag}`}
              accessibilityRole="button"
            >
              <Text style={styles.selectedTagText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag} ×</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          value={tagInput}
          onChangeText={setTagInput}
          placeholder="Ajouter un tag..."
          placeholderTextColor={theme.text.tertiary}
          onSubmitEditing={() => handleAddTag(tagInput)}
          allowFontScaling
          accessibilityLabel="Champ d'ajout de tags"
          accessibilityHint="Entrez un tag et appuyez sur Entrée pour l'ajouter"
        />

        {tagInput.length > 0 && (
          <View style={styles.suggestions}>
            {filteredTags.length > 0 ? (
              filteredTags.slice(0, 5).map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.suggestion}
                  onPress={() => handleAddTag(tag)}
                  accessibilityLabel={`Ajouter le tag ${tag}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.suggestionText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">{tag}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => handleAddTag(tagInput)}
                accessibilityLabel={`Créer un nouveau tag ${tagInput}`}
                accessibilityRole="button"
              >
                <Text style={styles.suggestionText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Créer "{tagInput}"</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Notes personnelles</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: page 42, j'ai ajouté plus d'ail..."
          placeholderTextColor={theme.text.tertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          allowFontScaling
          accessibilityLabel="Notes personnelles"
          accessibilityHint="Ajoutez vos notes personnelles pour cette recette"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Photo de la recette (optionnel)</Text>
          {recipeImage ? (
            <>
              <Image source={{ uri: recipeImage }} style={styles.imagePreview} resizeMode="cover" accessible accessibilityLabel="Photo de la recette" />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setRecipeImage(undefined)} accessibilityLabel="Supprimer la photo" accessibilityRole="button">
                <Text style={styles.removeImageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Supprimer la photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto} accessibilityLabel="Prendre une photo avec la caméra" accessibilityRole="button">
                <Text style={styles.imageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">📷 Prendre une photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={handlePickImage} accessibilityLabel="Choisir une photo depuis la galerie" accessibilityRole="button">
                <Text style={styles.imageButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">🖼️ Choisir depuis la galerie</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel="Enregistrer la recette" accessibilityRole="button">
          <Text style={styles.saveButtonText} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}