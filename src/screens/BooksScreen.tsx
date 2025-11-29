/**
 * src/screens/BooksScreen.tsx
 *
 * Écran d'affichage de la bibliothèque de livres de recettes.
 *
 * Fonctionnalités :
 * - Affichage en grille (2 colonnes) de tous les livres
 * - Barre de recherche pour filtrer par titre ou auteur
 * - Affichage des couvertures d'image ou placeholder stylisé
 * - Navigation vers le détail d'un livre au clic
 * - Bouton d'ajout de nouveau livre
 * - Vue vide avec message encourageant si aucun livre
 *
 * Design :
 * - Cartes en format portrait (ratio 0.7) comme de vrais livres
 * - Images de couverture ou fond coloré avec titre si pas d'image
 * - En-tête avec menu burger et compteur de livres
 * - Recherche en temps réel
 */

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions } from '../theme/responsive';

type BooksScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Books'>;

interface Props {
  navigation: BooksScreenNavigationProp;
}

export default function BooksScreen({ navigation }: Props) {
  const { books } = useApp();
  const { theme } = useTheme();

  /** État de la recherche */
  const [searchQuery, setSearchQuery] = useState('');

  /** Filtre les livres selon la recherche (titre ou auteur) */
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    bookCount: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
    },
    searchInput: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      margin: spacing.base,
      marginBottom: spacing.sm,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.base,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    listContent: {
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.base,
    },
    row: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xs,
    },
    bookCard: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.base,
      padding: spacing.sm,
      margin: spacing.xs,
      width: '48%',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    bookCover: {
      width: '100%',
      aspectRatio: 0.7,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    placeholderCover: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.sm,
    },
    placeholderIcon: {
      fontSize: iconSizes.xl,
      marginBottom: spacing.sm,
    },
    placeholderTitle: {
      color: theme.button.text,
      fontSize: fontSizes.xs,
      fontWeight: '600',
      textAlign: 'center',
    },
    bookTitle: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
      minHeight: screenDimensions.isSmallDevice ? 32 : 36,
    },
    bookAuthor: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
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
    },
    emptySubtext: {
      fontSize: fontSizes.base,
      color: theme.text.tertiary,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: spacing.lg,
      margin: spacing.base,
      borderRadius: borderRadius.base,
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
  });

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <View style={styles.bookCover}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderIcon}>📚</Text>
            <Text style={styles.placeholderTitle} numberOfLines={3}>
              {item.title}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ma Bibliothèque</Text>
        </View>
        <Text style={styles.bookCount}>{books.length} livre{books.length > 1 ? 's' : ''}</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un livre..."
        placeholderTextColor={theme.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Aucun livre pour le moment</Text>
            <Text style={styles.emptySubtext}>Commencez votre bibliothèque !</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={styles.addButtonText}>+ Ajouter un livre</Text>
      </TouchableOpacity>
    </View>
  );
}