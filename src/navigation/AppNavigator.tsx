// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BooksScreen from '../screens/BooksScreen';
import AddBookScreen from '../screens/AddBookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import RecipesScreen from '../screens/RecipesScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Books: undefined;
  AddBook: { bookId?: string };
  BookDetail: { bookId: string };
  Recipes: undefined;
  AddRecipe: undefined;
  RecipeDetail: { recipeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Recipe Book Manager' }}
        />
        <Stack.Screen 
          name="Books" 
          component={BooksScreen}
          options={{ title: 'Mes Livres' }}
        />
        <Stack.Screen 
          name="AddBook" 
          component={AddBookScreen}
          options={({ route }) => ({ 
            title: route.params?.bookId ? 'Modifier le Livre' : 'Ajouter un Livre' 
          })}
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetailScreen}
          options={{ title: 'Détails du Livre' }}
        />
        <Stack.Screen 
          name="Recipes" 
          component={RecipesScreen}
          options={{ title: 'Mes Recettes' }}
        />
        <Stack.Screen 
          name="AddRecipe" 
          component={AddRecipeScreen}
          options={{ title: 'Ajouter une Recette' }}
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen}
          options={{ title: 'Détails de la Recette' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}