/**
 * src/screens/DiscoverScreen.tsx
 *
 * Écran "Découvrir" avec suggestions intelligentes basées sur l'IA locale.
 *
 * Fonctionnalités :
 * - Recherche conversationnelle par catégorie
 * - Affichage des livres existants correspondants
 * - Suggestions de nouvelles catégories à explorer
 * - Statistiques personnalisées (livres, recettes, favoris, tags populaires)
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Searchbar, Card, Chip, useTheme, Surface, Button, IconButton } from 'react-native-paper';
import { useApp } from '../contexts/AppContext';
import { spacing, fontSizes, borderRadius } from '../theme/responsive';
import { Book } from '../models/types';
import { formatAuthorDisplay } from '../utils/formatters';

export const DiscoverScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { books, getDiscoverInsights } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Générer les insights basés sur la recherche
  const insights = useMemo(() => {
    return getDiscoverInsights(searchQuery);
  }, [searchQuery, books, getDiscoverInsights]);

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleSearchCategory = (category: string) => {
    setSearchQuery(category);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Barre de recherche */}
        <Searchbar
          placeholder="Ex: pâtisserie, cuisine italienne, rapide..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
          iconColor={theme.colors.primary}
        />

        {/* Section Statistiques */}
        {!searchQuery && (
          <Surface style={[styles.statsCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Votre bibliothèque
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                  {insights.stats.totalBooks}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Livres
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                  {insights.stats.totalRecipes}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Recettes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                  {insights.stats.favoriteCount}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Favoris
                </Text>
              </View>
            </View>

            {/* Tags populaires */}
            {insights.stats.topTags.length > 0 && (
              <>
                <Text
                  variant="titleSmall"
                  style={[styles.subsectionTitle, { color: theme.colors.onSurfaceVariant }]}
                >
                  Vos tags préférés
                </Text>
                <View style={styles.tagsContainer}>
                  {insights.stats.topTags.map((tagInfo) => (
                    <Chip
                      key={tagInfo.tag}
                      mode="outlined"
                      style={styles.chip}
                      textStyle={{ color: theme.colors.primary }}
                    >
                      {tagInfo.tag} ({tagInfo.count})
                    </Chip>
                  ))}
                </View>
              </>
            )}

            {/* Catégories populaires */}
            {insights.stats.topCategories.length > 0 && (
              <>
                <Text
                  variant="titleSmall"
                  style={[styles.subsectionTitle, { color: theme.colors.onSurfaceVariant }]}
                >
                  Vos catégories
                </Text>
                <View style={styles.tagsContainer}>
                  {insights.stats.topCategories.map((catInfo) => (
                    <Chip
                      key={catInfo.category}
                      mode="flat"
                      style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}
                      textStyle={{ color: theme.colors.onPrimaryContainer }}
                      onPress={() => handleSearchCategory(catInfo.category)}
                    >
                      {catInfo.category} ({catInfo.count})
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Surface>
        )}

        {/* Section Vos livres correspondants */}
        {searchQuery && insights.yourBooks.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Vos livres ({insights.yourBooks.length})
            </Text>
            {insights.yourBooks.map((book) => (
              <Card
                key={book.id}
                style={[styles.bookCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleBookPress(book)}
              >
                <Card.Content>
                  <View style={styles.bookCardContent}>
                    <View style={styles.bookInfo}>
                      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                        {book.title}
                      </Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {formatAuthorDisplay(book.author, book.pseudonym)}
                      </Text>
                      {book.category && (
                        <Chip
                          mode="outlined"
                          style={styles.categoryChip}
                          textStyle={{ fontSize: fontSizes.xs }}
                        >
                          {book.category}
                        </Chip>
                      )}
                    </View>
                    <IconButton icon="chevron-right" iconColor={theme.colors.primary} />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Section Suggestions */}
        {insights.suggestions.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              {searchQuery ? 'Suggestions pour vous' : 'Découvrez de nouvelles catégories'}
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {searchQuery
                ? `Basé sur votre recherche "${searchQuery}"`
                : 'Basé sur vos recettes favorites'}
            </Text>

            {insights.suggestions.map((suggestion, index) => (
              <Card
                key={`${suggestion.category}-${index}`}
                style={[styles.suggestionCard, { backgroundColor: theme.colors.primaryContainer }]}
              >
                <Card.Content>
                  <View style={styles.suggestionHeader}>
                    <Text
                      variant="titleMedium"
                      style={[styles.suggestionTitle, { color: theme.colors.onPrimaryContainer }]}
                    >
                      {suggestion.category}
                    </Text>
                    <View style={styles.confidenceBadge}>
                      <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                        {Math.round(suggestion.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={[styles.suggestionReason, { color: theme.colors.onPrimaryContainer }]}
                  >
                    {suggestion.reason}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => handleSearchCategory(suggestion.category)}
                    style={styles.exploreButton}
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.onPrimary}
                  >
                    Explorer cette catégorie
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Message si aucun résultat */}
        {searchQuery && insights.yourBooks.length === 0 && insights.suggestions.length === 0 && (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Aucun résultat
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Essayez une autre recherche ou explorez nos suggestions
            </Text>
            <Button
              mode="outlined"
              onPress={() => setSearchQuery('')}
              style={{ marginTop: 16 }}
              textColor={theme.colors.primary}
            >
              Effacer la recherche
            </Button>
          </Surface>
        )}

        {/* Message si pas de favoris */}
        {!searchQuery && insights.stats.favoriteCount === 0 && insights.suggestions.length === 0 && (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Créez vos premières recettes favorites
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Marquez des recettes comme favorites pour obtenir des suggestions personnalisées
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Recipes')}
              style={{ marginTop: 16 }}
              buttonColor={theme.colors.primary}
            >
              Voir mes recettes
            </Button>
          </Surface>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  searchbar: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.md,
  },
  statsCard: {
    padding: spacing.base,
    borderRadius: borderRadius.base,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  subsectionTitle: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    marginVertical: spacing.xs,
  },
  categoryChip: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: spacing.xl,
  },
  bookCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.base,
  },
  bookCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  suggestionCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.base,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  suggestionTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.base,
  },
  suggestionReason: {
    marginBottom: spacing.md,
  },
  exploreButton: {
    marginTop: spacing.sm,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.base,
    alignItems: 'center',
  },
});
