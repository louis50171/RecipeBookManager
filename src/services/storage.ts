/**
 * Service de stockage
 *
 * Fournit les fonctions nécessaires pour la gestion des données de l'application.
 */

import { Book, Recipe, Collection } from '../models/types';

export const getBooks = async (): Promise<Book[]> => {
  return [];
};

export const saveBook = async (book: Book): Promise<void> => {};

export const updateBook = async (book: Book): Promise<void> => {};

export const deleteBook = async (bookId: string): Promise<number> => {
  return 0;
};

export const getRecipes = async (): Promise<Recipe[]> => {
  return [];
};

export const saveRecipe = async (recipe: Recipe): Promise<void> => {};

export const updateRecipe = async (recipe: Recipe): Promise<void> => {};

export const deleteRecipe = async (recipeId: string): Promise<void> => {};

export const toggleFavorite = async (recipeId: string): Promise<void> => {};

export const getTags = async (): Promise<string[]> => {
  return [];
};

export const addTag = async (tag: string): Promise<void> => {};

export const getCollections = async (): Promise<Collection[]> => {
  return [];
};

export const saveCollection = async (collection: Collection): Promise<void> => {};

export const updateCollection = async (collection: Collection): Promise<void> => {};

export const deleteCollection = async (collectionId: string): Promise<void> => {};
