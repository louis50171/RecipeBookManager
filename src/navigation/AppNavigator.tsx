/**
 * src/navigation/AppNavigator.tsx
 *
 * Configuration de la navigation de l'application.
 *
 * Architecture de navigation hybride :
 * - Drawer Navigator : pour les écrans principaux (Accueil, Livres, Recettes)
 *   avec menu latéral personnalisé
 * - Stack Navigator : pour les écrans modaux et de détail (AddBook, BookDetail, etc.)
 *   avec navigation empilée standard
 *
 * Hiérarchie :
 * NavigationContainer
 *   └─ Stack.Navigator (niveau racine)
 *       ├─ MainDrawer (Drawer.Navigator)
 *       │   ├─ Home
 *       │   ├─ Books
 *       │   └─ Recipes
 *       ├─ AddBook (modal)
 *       ├─ BookDetail (modal)
 *       ├─ AddRecipe (modal)
 *       └─ RecipeDetail (modal)
 *
 * Cette structure permet :
 * - Navigation rapide entre les sections principales via le drawer
 * - Ouverture d'écrans de détail en mode modal avec retour facile
 * - Type-safety complet grâce à RootStackParamList
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BooksScreen from '../screens/BooksScreen';
import AddBookScreen from '../screens/AddBookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import RecipesScreen from '../screens/RecipesScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import DrawerContent from '../components/DrawerContent';

/**
 * Type définissant toutes les routes de l'application et leurs paramètres
 *
 * Permet le type-checking des navigations et des paramètres de routes
 */
export type RootStackParamList = {
  /** Écran d'accueil - pas de paramètres */
  Home: undefined;

  /** Liste des livres - pas de paramètres */
  Books: undefined;

  /** Ajout/Modification de livre - bookId optionnel (présent en mode édition) */
  AddBook: { bookId?: string };

  /** Détail d'un livre - bookId obligatoire */
  BookDetail: { bookId: string };

  /** Liste des recettes - pas de paramètres */
  Recipes: undefined;

  /** Ajout de recette - pas de paramètres */
  AddRecipe: undefined;

  /** Détail d'une recette - recipeId obligatoire */
  RecipeDetail: { recipeId: string };
};

/** Stack Navigator pour la navigation principale */
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Drawer Navigator pour le menu latéral */
const Drawer = createDrawerNavigator();

/**
 * Composant interne : Drawer Navigator avec les écrans principaux
 *
 * Configure le menu drawer avec :
 * - Contenu personnalisé (DrawerContent)
 * - Type 'front' : le drawer s'affiche au-dessus du contenu
 * - Headers masqués (gérés individuellement par chaque écran)
 *
 * @returns {JSX.Element} Le Drawer Navigator configuré
 */
function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Books" component={BooksScreen} />
      <Drawer.Screen name="Recipes" component={RecipesScreen} />
    </Drawer.Navigator>
  );
}

/**
 * Navigateur principal de l'application
 *
 * Configure la navigation racine avec :
 * - Le MainDrawer comme écran de base
 * - Les écrans modaux pour l'ajout/édition et les détails
 * - Titres dynamiques basés sur les paramètres de route
 *
 * @returns {JSX.Element} Le navigateur complet de l'application
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Écran de base avec le drawer */}
        <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ headerShown: false }}
        />

        {/* Écran d'ajout/modification de livre - titre dynamique */}
        <Stack.Screen
          name="AddBook"
          component={AddBookScreen}
          options={({ route }) => ({
            title: route.params?.bookId ? 'Modifier le Livre' : 'Ajouter un Livre'
          })}
        />

        {/* Écran de détail d'un livre */}
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: 'Détails du Livre' }}
        />

        {/* Écran d'ajout de recette */}
        <Stack.Screen
          name="AddRecipe"
          component={AddRecipeScreen}
          options={{ title: 'Ajouter une Recette' }}
        />

        {/* Écran de détail d'une recette */}
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ title: 'Détails de la Recette' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}