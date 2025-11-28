// src/components/DrawerContent.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  const { books, recipes } = useApp();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.card.border,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text.primary,
      fontFamily: 'serif',
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.text.secondary,
      marginTop: 4,
    },
    menuSection: {
      paddingVertical: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      gap: 15,
    },
    menuItemActive: {
      backgroundColor: theme.primary + '20',
      borderRightWidth: 4,
      borderRightColor: theme.primary,
    },
    menuIcon: {
      fontSize: 24,
      width: 30,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text.primary,
    },
    menuSubtitle: {
      fontSize: 12,
      color: theme.text.secondary,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: theme.card.border,
      marginVertical: 10,
      marginHorizontal: 20,
    },
  });

  const menuItems = [
    {
      name: 'Home',
      icon: '🏠',
      title: 'Accueil',
      subtitle: 'Vue d\'ensemble',
    },
    {
      name: 'Books',
      icon: '📚',
      title: 'Mes Livres',
      subtitle: `${books.length} livre${books.length > 1 ? 's' : ''}`,
    },
    {
      name: 'Recipes',
      icon: '🍳',
      title: 'Mes Recettes',
      subtitle: `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`,
    },
  ];

  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSubtitle}>Recipe Book Manager</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.menuSection}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.name}>
            {index > 0 && <View style={styles.divider} />}
            <TouchableOpacity
              style={[
                styles.menuItem,
                currentRoute === item.name && styles.menuItemActive,
              ]}
              onPress={() => props.navigation.navigate(item.name)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </DrawerContentScrollView>
    </View>
  );
}
