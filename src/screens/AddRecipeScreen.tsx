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
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';
import { spacing, fontSizes, borderRadius } from '../theme/responsive';

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
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nom de la recette *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Poulet rôti"
          placeholderTextColor={theme.text.tertiary}
        />

        <Text style={styles.label}>Livre source (optionnel)</Text>
        <TouchableOpacity
          style={styles.combobox}
          onPress={() => setShowBookPicker(!showBookPicker)}
        >
          <Text style={[styles.comboboxText, !selectedBook && styles.comboboxPlaceholder]}>
            {selectedBook ? selectedBook.title : 'Aucun (recette personnelle)'}
          </Text>
          <Text style={styles.comboboxArrow}>{showBookPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showBookPicker && (
          <View style={styles.bookPickerContainer}>
            <TouchableOpacity
              style={[styles.bookPickerOption, !selectedBookId && styles.bookPickerOptionSelected]}
              onPress={() => {
                setSelectedBookId(undefined);
                setShowBookPicker(false);
              }}
            >
              <Text style={styles.bookPickerOptionText}>Aucun (recette personnelle)</Text>
            </TouchableOpacity>
            {books.map(book => (
              <TouchableOpacity
                key={book.id}
                style={[styles.bookPickerOption, selectedBookId === book.id && styles.bookPickerOptionSelected]}
                onPress={() => {
                  setSelectedBookId(book.id);
                  setShowBookPicker(false);
                }}
              >
                <Text style={styles.bookPickerOptionText}>{book.title}</Text>
                <Text style={styles.bookPickerOptionAuthor}>{book.author}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagsContainer}>
          {selectedTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={styles.selectedTag}
              onPress={() => handleRemoveTag(tag)}
            >
              <Text style={styles.selectedTagText}>{tag} ×</Text>
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
        />

        {tagInput.length > 0 && (
          <View style={styles.suggestions}>
            {filteredTags.length > 0 ? (
              filteredTags.slice(0, 5).map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.suggestion}
                  onPress={() => handleAddTag(tag)}
                >
                  <Text style={styles.suggestionText}>{tag}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => handleAddTag(tagInput)}
              >
                <Text style={styles.suggestionText}>Créer "{tagInput}"</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Notes personnelles</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: page 42, j'ai ajouté plus d'ail..."
          placeholderTextColor={theme.text.tertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}