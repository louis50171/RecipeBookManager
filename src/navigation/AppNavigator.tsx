// src/navigation/AppNavigator.tsx
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
const Drawer = createDrawerNavigator();

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={{ headerShown: false }}
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