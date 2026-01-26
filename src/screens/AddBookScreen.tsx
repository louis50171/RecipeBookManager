/**
 * Écran d'ajout ou de modification d'un livre de recettes
 *
 * Permet la saisie manuelle de toutes les informations d'un livre :
 * - Titre, auteur, pseudonyme
 * - Éditeur, année de publication
 * - Catégorie
 * - URL de couverture
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book } from '../models/types';
import { spacing, fontSizes, borderRadius } from '../theme/responsive';

type AddBookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;
type AddBookScreenRouteProp = RouteProp<RootStackParamList, 'AddBook'>;

interface Props {
  navigation: AddBookScreenNavigationProp;
  route: AddBookScreenRouteProp;
}

export default function AddBookScreen({ navigation, route }: Props) {
  const { addBook, updateBook, books, suggestBookCategory } = useApp();
  const { theme } = useTheme();
  const editBookId = route.params?.bookId;
  const editingBook = editBookId ? books.find(b => b.id === editBookId) : null;
  const isEditing = !!editingBook;

  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [pseudonym, setPseudonym] = useState(editingBook?.pseudonym || '');
  const [editor, setEditor] = useState(editingBook?.editor || '');
  const [year, setYear] = useState(editingBook?.year?.toString() || '');
  const [category, setCategory] = useState(editingBook?.category || '');
  const [coverImage, setCoverImage] = useState(editingBook?.coverImage || '');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const addCoverUrl = () => {
    Alert.prompt(
      'URL de la couverture',
      'Entrez l\'URL de l\'image de couverture',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: (url) => {
            if (url && url.trim()) {
              setCoverImage(url.trim());
            }
          },
        },
      ],
      'plain-text',
      coverImage
    );
  };

  const getSuggestions = () => {
    if (title.trim() && author.trim()) {
      return suggestBookCategory(title, author, pseudonym);
    }
    return [];
  };

  const handleShowSuggestions = () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Information manquante', 'Veuillez d\'abord renseigner le titre et l\'auteur pour obtenir des suggestions.');
      return;
    }
    setShowCategorySuggestions(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }
    if (!author.trim()) {
      Alert.alert('Erreur', 'L\'auteur est obligatoire');
      return;
    }

    const book: Book = {
      id: isEditing ? editingBook.id : Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      pseudonym: pseudonym.trim() || undefined,
      editor: editor.trim() || undefined,
      year: year.trim() ? parseInt(year) : undefined,
      category: category.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      createdAt: isEditing ? editingBook.createdAt : new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await updateBook(book);
        Alert.alert('Succès', 'Le livre a été mis à jour', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        await addBook(book);
        Alert.alert('Succès', 'Le livre a été ajouté', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le livre');
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
    label: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    halfInput: {
      flex: 1,
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      width: '85%',
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: spacing.base,
    },
    suggestionItem: {
      padding: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    suggestionCategory: {
      fontSize: fontSizes.base,
      color: theme.text.primary,
      fontWeight: '500',
    },
    suggestionConfidence: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginTop: spacing.xs,
    },
    closeButton: {
      marginTop: spacing.base,
      padding: spacing.base,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.base,
      alignItems: 'center',
    },
    closeButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.base,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations du livre</Text>

          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Simplissime"
            placeholderTextColor={theme.text.tertiary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Auteur *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Jean-François Mallet"
            placeholderTextColor={theme.text.tertiary}
            value={author}
            onChangeText={setAuthor}
          />

          <Text style={styles.label}>Pseudonyme (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Nom de plume de l'auteur"
            placeholderTextColor={theme.text.tertiary}
            value={pseudonym}
            onChangeText={setPseudonym}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Éditeur</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Hachette"
                placeholderTextColor={theme.text.tertiary}
                value={editor}
                onChangeText={setEditor}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Année</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 2023"
                placeholderTextColor={theme.text.tertiary}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Catégorie</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cuisine rapide"
            placeholderTextColor={theme.text.tertiary}
            value={category}
            onChangeText={setCategory}
          />

          <TouchableOpacity style={styles.button} onPress={handleShowSuggestions}>
            <Text style={styles.buttonText}>✨ Obtenir des suggestions de catégorie</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image de couverture</Text>

          <TouchableOpacity style={styles.button} onPress={addCoverUrl}>
            <Text style={styles.buttonText}>🔗 {coverImage ? 'Modifier l\'URL' : 'Ajouter une URL'}</Text>
          </TouchableOpacity>

          {coverImage && (
            <Text style={styles.label} numberOfLines={1}>URL: {coverImage}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCategorySuggestions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategorySuggestions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggestions de catégories</Text>
            <ScrollView>
              {getSuggestions().map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setCategory(suggestion.category);
                    setShowCategorySuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                  <Text style={styles.suggestionConfidence}>
                    Confiance: {Math.round(suggestion.confidence * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCategorySuggestions(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
