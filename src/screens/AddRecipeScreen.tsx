/**
 * Écran d'ajout d'une nouvelle recette
 *
 * Permet de créer une recette avec :
 * - Nom de la recette
 * - Livre source (optionnel)
 * - Tags personnalisés
 * - Notes et commentaires
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Recipe } from '../models/types';
import { spacing, fontSizes, borderRadius } from '../theme/responsive';
import { formatAuthorDisplay } from '../utils/formatters';

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

    const recipe: Recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      bookId: selectedBookId,
      tags: selectedTags,
      notes: notes.trim(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await addRecipe(recipe);
      Alert.alert('Succès', 'La recette a été ajoutée', [
        { text: 'OK', onPress: () => navigation.navigate('Recipes') }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la recette');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: spacing.base,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.card.background,
      borderWidth: 1,
      borderColor: theme.card.border,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      fontSize: fontSizes.base,
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    notesInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: theme.card.background,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    buttonText: {
      color: theme.primary,
      fontSize: fontSizes.base,
      fontWeight: '600',
    },
    selectedBook: {
      backgroundColor: theme.card.background,
      borderWidth: 1,
      borderColor: theme.card.border,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      marginBottom: spacing.sm,
    },
    selectedBookTitle: {
      fontSize: fontSizes.base,
      fontWeight: '500',
      color: theme.text.primary,
    },
    selectedBookAuthor: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs / 2,
    },
    tagInputContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    tagInputField: {
      flex: 1,
    },
    addTagButton: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      justifyContent: 'center',
      minWidth: 60,
    },
    addTagButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.sm,
      fontWeight: '600',
      textAlign: 'center',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    tagChip: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.round,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    tagText: {
      color: theme.button.text,
      fontSize: fontSizes.sm,
    },
    tagRemove: {
      color: theme.button.text,
      fontSize: fontSizes.base,
      fontWeight: 'bold',
    },
    suggestionsContainer: {
      maxHeight: 150,
    },
    suggestionItem: {
      backgroundColor: theme.card.background,
      borderWidth: 1,
      borderColor: theme.card.border,
      borderRadius: borderRadius.base,
      padding: spacing.sm,
      marginBottom: spacing.xs,
    },
    suggestionText: {
      fontSize: fontSizes.sm,
      color: theme.text.primary,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: spacing.base,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      marginTop: spacing.base,
    },
    saveButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
    cancelButton: {
      padding: spacing.base,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    cancelButtonText: {
      color: theme.text.secondary,
      fontSize: fontSizes.base,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.card.background,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      color: theme.text.primary,
    },
    modalCloseButton: {
      padding: spacing.sm,
    },
    modalCloseText: {
      fontSize: fontSizes.xl,
      color: theme.text.secondary,
    },
    bookItem: {
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    bookItemTitle: {
      fontSize: fontSizes.base,
      fontWeight: '500',
      color: theme.text.primary,
    },
    bookItemAuthor: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs / 2,
    },
    noBookButton: {
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    noBookText: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de la recette</Text>

          <Text style={styles.label}>Nom de la recette *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Tarte aux pommes"
            placeholderTextColor={theme.text.tertiary}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Livre source (optionnel)</Text>
          {selectedBook ? (
            <TouchableOpacity
              style={styles.selectedBook}
              onPress={() => setShowBookPicker(true)}
            >
              <Text style={styles.selectedBookTitle}>{selectedBook.title}</Text>
              <Text style={styles.selectedBookAuthor}>
                {formatAuthorDisplay(selectedBook.author, selectedBook.pseudonym)}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowBookPicker(true)}
            >
              <Text style={styles.buttonText}>📚 Sélectionner un livre</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>

          <View style={styles.tagInputContainer}>
            <TextInput
              style={[styles.input, styles.tagInputField]}
              placeholder="Ajouter un tag..."
              placeholderTextColor={theme.text.tertiary}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={() => handleAddTag(tagInput)}
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => handleAddTag(tagInput)}
            >
              <Text style={styles.addTagButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {selectedTags.length > 0 && (
            <View style={styles.tagsContainer}>
              {selectedTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagChip}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {tagInput.length > 0 && filteredTags.length > 0 && (
            <ScrollView style={styles.suggestionsContainer}>
              {filteredTags.slice(0, 5).map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.suggestionItem}
                  onPress={() => handleAddTag(tag)}
                >
                  <Text style={styles.suggestionText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Ajoutez vos notes, modifications, astuces..."
            placeholderTextColor={theme.text.tertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showBookPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir un livre</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowBookPicker(false)}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={books}
              keyExtractor={item => item.id}
              ListHeaderComponent={
                <TouchableOpacity
                  style={styles.noBookButton}
                  onPress={() => {
                    setSelectedBookId(undefined);
                    setShowBookPicker(false);
                  }}
                >
                  <Text style={styles.noBookText}>Aucun livre (recette personnelle)</Text>
                </TouchableOpacity>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bookItem}
                  onPress={() => {
                    setSelectedBookId(item.id);
                    setShowBookPicker(false);
                  }}
                >
                  <Text style={styles.bookItemTitle}>{item.title}</Text>
                  <Text style={styles.bookItemAuthor}>
                    {formatAuthorDisplay(item.author, item.pseudonym)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
