// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

type HomeScreenNavigationProp = DrawerNavigationProp<any> & NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { books, recipes } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const favoriteRecipes = recipes.filter(r => r.isFavorite);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    menuIcon: {
      fontSize: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.card.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    themeButtonText: {
      fontSize: 20,
    },
    infoCard: {
      backgroundColor: theme.card.background,
      padding: 16,
      borderRadius: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    infoText: {
      fontSize: 14,
      color: theme.text.secondary,
      lineHeight: 20,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card.background,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    statNumber: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: theme.text.secondary,
    },
    navSection: {
      gap: 12,
    },
    navCard: {
      backgroundColor: theme.card.background,
      padding: 20,
      borderRadius: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    navCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    navIcon: {
      fontSize: 28,
    },
    navTextContainer: {
      flex: 1,
    },
    navTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: 2,
    },
    navSubtitle: {
      fontSize: 13,
      color: theme.text.secondary,
    },
    navArrow: {
      fontSize: 20,
      color: theme.text.tertiary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Today</Text>
        </View>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          💡 Gardez vos livres de cuisine organisés et retrouvez vos recettes préférées en un instant
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{books.length}</Text>
          <Text style={styles.statLabel}>Livres</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Recettes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{favoriteRecipes.length}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
      </View>

      <View style={styles.navSection}>
        <TouchableOpacity 
          style={styles.navCard}
          onPress={() => navigation.navigate('Books')}
        >
          <View style={styles.navCardContent}>
            <Text style={styles.navIcon}>📚</Text>
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Ma Bibliothèque</Text>
              <Text style={styles.navSubtitle}>
                {books.length} livre{books.length > 1 ? 's' : ''} indexé{books.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navCard}
          onPress={() => navigation.navigate('Recipes')}
        >
          <View style={styles.navCardContent}>
            <Text style={styles.navIcon}>🍳</Text>
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Mes Recettes</Text>
              <Text style={styles.navSubtitle}>
                {recipes.length} recette{recipes.length > 1 ? 's' : ''} · {favoriteRecipes.length} favori{favoriteRecipes.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}