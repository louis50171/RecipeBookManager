/**
 * src/screens/BooksScreen.tsx
 */

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book } from '../models/types';
import { spacing, fontSizes, borderRadius, iconSizes, screenDimensions, deviceType, getResponsiveValue } from '../theme/responsive';
import { formatAuthorDisplay } from '../utils/formatters';

type BooksScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Books'>;

interface Props {
  navigation: BooksScreenNavigationProp;
}

/** Génère une couleur de fond déterministe à partir du titre */
function coverColor(title: string): string {
  const palette = [
    ['#4A6FA5', '#2D4A78'],
    ['#C0392B', '#922B21'],
    ['#27AE60', '#1E8449'],
    ['#8E44AD', '#6C3483'],
    ['#D35400', '#A04000'],
    ['#16A085', '#0E6655'],
    ['#2980B9', '#1A5276'],
    ['#F39C12', '#B7770D'],
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length][0];
}

/** Retourne les initiales du titre (max 2 mots) */
function coverInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function BooksScreen({ navigation }: Props) {
  const { books } = useApp();
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const numColumns = getResponsiveValue(2, 2, deviceType.isLargeTablet ? 4 : 3);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      (book.pseudonym && book.pseudonym.toLowerCase().includes(q)) ||
      (book.category && book.category.toLowerCase().includes(q))
    );
  }, [books, searchQuery]);

  const cardWidth = numColumns === 2 ? '48%' : numColumns === 3 ? '31.5%' : '23.5%';

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.sm,
      paddingBottom: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
      marginRight: spacing.md,
    },
    menuIcon: {
      fontSize: iconSizes.base,
    },
    headerTitleBlock: {
      flex: 1,
    },
    headerTitle: {
      fontSize: screenDimensions.isSmallDevice ? fontSizes.xl : fontSizes.xxl,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    bookCount: {
      fontSize: fontSizes.sm,
      color: theme.text.tertiary,
      fontWeight: '500',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      paddingHorizontal: spacing.md,
    },
    searchIcon: {
      fontSize: fontSizes.md,
      marginRight: spacing.sm,
      color: theme.text.tertiary,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSizes.base,
      color: theme.text.primary,
    },
    listContent: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl + spacing.xl,
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
      width: cardWidth,
      borderWidth: 1,
      borderColor: theme.card.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    bookCover: {
      width: '100%',
      aspectRatio: 0.68,
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
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.sm,
    },
    placeholderInitials: {
      color: '#FFFFFF',
      fontSize: fontSizes.xxxl,
      fontWeight: 'bold',
      fontFamily: 'serif',
      letterSpacing: 2,
      opacity: 0.9,
    },
    placeholderTitle: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: fontSizes.xs,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    bookTitle: {
      fontSize: fontSizes.base,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 2,
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
      paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: spacing.base,
    },
    emptyText: {
      fontSize: fontSizes.lg,
      color: theme.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: fontSizes.base * 1.6,
    },
    fabButton: {
      position: 'absolute',
      bottom: spacing.xl,
      right: spacing.xl,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.round,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: fontSizes.xxl,
      fontWeight: '300',
      lineHeight: fontSizes.xxl,
      marginTop: -2,
    },
  }), [theme, cardWidth]);

  const renderBook = ({ item }: { item: Book }) => {
    const bgColor = coverColor(item.title);
    const initials = coverInitials(item.title);
    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
        activeOpacity={0.8}
        accessibilityLabel={`Ouvrir le livre ${item.title} de ${formatAuthorDisplay(item.author, item.pseudonym)}`}
        accessibilityRole="button"
      >
        <View style={styles.bookCover}>
          {item.coverImage ? (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.coverImage}
              accessible
              accessibilityLabel={`Couverture du livre ${item.title}`}
            />
          ) : (
            <View style={[styles.placeholderCover, { backgroundColor: bgColor }]}>
              <Text style={styles.placeholderInitials}>{initials}</Text>
              <Text style={styles.placeholderTitle} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail" allowFontScaling>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
          {formatAuthorDisplay(item.author, item.pseudonym)}
        </Text>
      </TouchableOpacity>
    );
  };

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
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail" allowFontScaling>
              Ma Bibliothèque
            </Text>
            <Text style={styles.bookCount} allowFontScaling numberOfLines={1}>
              {books.length} livre{books.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Titre, auteur, catégorie…"
            placeholderTextColor={theme.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            allowFontScaling
            accessibilityLabel="Champ de recherche"
            accessibilityHint="Entrez un titre, auteur ou catégorie pour filtrer vos livres"
          />
        </View>
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        key={`flatlist-${numColumns}`}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText} allowFontScaling>Votre bibliothèque est vide</Text>
            <Text style={styles.emptySubtext} allowFontScaling>
              Ajoutez votre premier livre de cuisine via le bouton + ci-dessous.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AddBook')}
        accessibilityLabel="Ajouter un nouveau livre"
        accessibilityRole="button"
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
