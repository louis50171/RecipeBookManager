// src/screens/BooksScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book } from '../models/types';

type BooksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Books'>;

interface Props {
  navigation: BooksScreenNavigationProp;
}

export default function BooksScreen({ navigation }: Props) {
  const { books } = useApp();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

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
      padding: 20,
      paddingTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: 5,
      fontFamily: 'serif',
    },
    bookCount: {
      fontSize: 14,
      color: theme.text.secondary,
    },
    searchInput: {
      backgroundColor: theme.surface,
      padding: 15,
      margin: 15,
      marginBottom: 10,
      borderRadius: 12,
      fontSize: 16,
      color: theme.text.primary,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    listContent: {
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    row: {
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    bookCard: {
      backgroundColor: theme.card.background,
      borderRadius: 16,
      padding: 10,
      margin: 5,
      width: '48%',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    bookCover: {
      width: '100%',
      aspectRatio: 0.7,
      borderRadius: 12,
      marginBottom: 10,
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
      padding: 10,
    },
    placeholderIcon: {
      fontSize: 40,
      marginBottom: 10,
    },
    placeholderTitle: {
      color: theme.button.text,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    bookTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: 4,
      minHeight: 36,
    },
    bookAuthor: {
      fontSize: 12,
      color: theme.text.secondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 18,
      color: theme.text.secondary,
      fontWeight: '600',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.text.tertiary,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: 18,
      margin: 15,
      borderRadius: 16,
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.button.text,
      fontSize: 16,
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
        <Text style={styles.headerTitle}>Ma Bibliothèque</Text>
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