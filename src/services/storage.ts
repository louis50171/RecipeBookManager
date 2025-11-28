// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Recipe } from '../models/types';

const KEYS = {
  BOOKS: '@storage/books',
  RECIPES: '@storage/recipes',
  TAGS: '@storage/tags',
};

// Books
export const getBooks = async (): Promise<Book[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting books:', error);
    return [];
  }
};

export const saveBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks();
    const updatedBooks = [...books, book];
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error saving book:', error);
  }
};

export const updateBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks();
    const updatedBooks = books.map(b => b.id === book.id ? book : b);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error updating book:', error);
  }
};

export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const books = await getBooks();
    const updatedBooks = books.filter(b => b.id !== bookId);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

// Recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = [...recipes, recipe];
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

export const updateRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? recipe : r);
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error updating recipe:', error);
  }
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

export const toggleFavorite = async (recipeId: string): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    );
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

// Tags
export const getTags = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.TAGS);
    return data ? JSON.parse(data) : getDefaultTags();
  } catch (error) {
    console.error('Error getting tags:', error);
    return getDefaultTags();
  }
};

export const addTag = async (tag: string): Promise<void> => {
  try {
    const tags = await getTags();
    if (!tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      await AsyncStorage.setItem(KEYS.TAGS, JSON.stringify(updatedTags));
    }
  } catch (error) {
    console.error('Error adding tag:', error);
  }
};

const getDefaultTags = (): string[] => {
  return [
    'printemps',
    'été',
    'automne',
    'hiver',
    'végétarien',
    'végétalien',
    'sans gluten',
    'entrée',
    'plat',
    'dessert',
    'rapide',
    'difficile',
  ];
};