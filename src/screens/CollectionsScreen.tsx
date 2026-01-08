/**
 * src/screens/CollectionsScreen.tsx
 *
 * Écran d'affichage de la liste des collections de recettes.
 *
 * Fonctionnalités :
 * - Affichage en liste de toutes les collections
 * - Bouton d'ajout de nouvelle collection
 * - Navigation vers le détail d'une collection
 * - Vue vide avec message encourageant si aucune collection
 * - Affichage du nombre de tags par collection
 *
 * Design :
 * - Cartes simples avec nom et aperçu des tags
 * - En-tête avec menu burger et compteur
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Collection } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';

type CollectionsScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Collections'>;

interface Props {
  navigation: CollectionsScreenNavigationProp;
}

export default function CollectionsScreen({ navigation }: Props) {
  const { collections, tags: availableTags, addCollection } = useApp();
  const { theme } = useTheme();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert('Erreur', 'Le nom de la collection est obligatoire');
      return;
    }

    if (selectedTags.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un tag');
      return;
    }

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    };

    await addCollection(newCollection);
    setShowAddModal(false);
    setNewCollectionName('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
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
    collectionCount: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
    },
    listContent: {
      padding: spacing.base,
    },
    collectionCard: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      marginBottom: spacing.base,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    collectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    collectionName: {
      fontSize: fontSizes.lg,
      fontWeight: '600',
      color: theme.text.primary,
      flex: 1,
    },
    collectionIcon: {
      fontSize: iconSizes.base,
    },
    tagsPreview: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    tagPreview: {
      backgroundColor: theme.tag.background,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    tagPreviewText: {
      fontSize: fontSizes.sm,
      color: theme.tag.text,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      width: screenDimensions.width - (spacing.base * 2),
      maxWidth: 400,
      maxHeight: screenDimensions.isSmallDevice ? '85%' : '80%',
      alignSelf: 'center',
    },
    modalScrollContent: {
      flexGrow: 1,
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: spacing.base,
    },
    label: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
      marginTop: spacing.base,
    },
    input: {
      backgroundColor: theme.background,
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
      marginBottom: spacing.base,
      maxHeight: 200,
      marginHorizontal: -spacing.xs,
    },
    tagOption: {
      backgroundColor: theme.card.background,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      marginHorizontal: spacing.xs,
      marginBottom: spacing.sm,
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
    modalButtons: {
      flexDirection: 'row',
      marginTop: spacing.base,
      marginHorizontal: -spacing.xs,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      marginHorizontal: spacing.xs,
    },
    cancelButtonText: {
      color: theme.text.primary,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
    createButton: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
    },
    createButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
  });

  const renderCollection = ({ item }: { item: Collection }) => (
    <TouchableOpacity
      style={styles.collectionCard}
      onPress={() => navigation.navigate('CollectionDetail', { collectionId: item.id })}
      accessibilityLabel={`Ouvrir la collection ${item.name}, ${item.tags.length} tag${item.tags.length > 1 ? 's' : ''}`}
      accessibilityRole="button"
    >
      <View style={styles.collectionHeader}>
        <Text style={styles.collectionName} numberOfLines={2} ellipsizeMode="tail" allowFontScaling>{item.name}</Text>
        <Text style={styles.collectionIcon}>›</Text>
      </View>
      <View style={styles.tagsPreview}>
        {item.tags.map(tag => (
          <View key={tag} style={styles.tagPreview}>
            <Text style={styles.tagPreviewText} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
            accessibilityLabel="Ouvrir le menu de navigation"
            accessibilityRole="button"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>Collections</Text>
        </View>
        <Text style={styles.collectionCount} allowFontScaling numberOfLines={1}>
          {collections.length} collection{collections.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={collections}
        renderItem={renderCollection}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText} allowFontScaling>Aucune collection pour le moment</Text>
            <Text style={styles.emptySubtext} allowFontScaling numberOfLines={2} ellipsizeMode="tail">
              Créez des collections pour regrouper vos recettes selon des combinaisons de tags
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
        accessibilityLabel="Créer une nouvelle collection"
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText} allowFontScaling>+ Créer une collection</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
          accessibilityLabel="Fermer le dialogue"
          accessibilityRole="button"
        >
          <View style={styles.modalContent}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
              bounces={false}
            >
              <Text style={styles.modalTitle} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Nouvelle collection</Text>

              <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Nom de la collection *</Text>
              <TextInput
                style={styles.input}
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                placeholder="Ex: Desserts rapides, Plats d'hiver..."
                placeholderTextColor={theme.text.tertiary}
                allowFontScaling
                accessibilityLabel="Nom de la collection"
                accessibilityHint="Entrez un nom pour votre nouvelle collection"
              />

              <Text style={styles.label} allowFontScaling numberOfLines={1} ellipsizeMode="tail">Sélectionnez les tags *</Text>
              <View style={styles.tagsContainer}>
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tagOption, isSelected && styles.tagOptionSelected]}
                      onPress={() => toggleTag(tag)}
                      accessibilityLabel={`Tag ${tag}, ${isSelected ? 'sélectionné' : 'non sélectionné'}`}
                      accessibilityRole="button"
                    >
                      <Text style={[styles.tagOptionText, isSelected && styles.tagOptionTextSelected]} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewCollectionName('');
                    setSelectedTags([]);
                  }}
                  accessibilityLabel="Annuler la création de collection"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText} allowFontScaling>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateCollection}
                  accessibilityLabel="Créer la collection"
                  accessibilityRole="button"
                >
                  <Text style={styles.createButtonText} allowFontScaling>Créer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
