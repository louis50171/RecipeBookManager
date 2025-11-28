// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Recipe } from '../models/types';
import * as storage from '../services/storage';

interface AppContextType {
  books: Book[];
  recipes: Recipe[];
  tags: string[];
  loadData: () => Promise<void>;
  addBook: (book: Book) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  toggleFavorite: (recipeId: string) => Promise<void>;
  addTag: (tag: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const loadData = async () => {
    const [loadedBooks, loadedRecipes, loadedTags] = await Promise.all([
      storage.getBooks(),
      storage.getRecipes(),
      storage.getTags(),
    ]);
    setBooks(loadedBooks);
    setRecipes(loadedRecipes);
    setTags(loadedTags);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addBook = async (book: Book) => {
    await storage.saveBook(book);
    await loadData();
  };

  const updateBook = async (book: Book) => {
    await storage.updateBook(book);
    await loadData();
  };

  const deleteBook = async (bookId: string) => {
    await storage.deleteBook(bookId);
    await loadData();
  };

  const addRecipe = async (recipe: Recipe) => {
    await storage.saveRecipe(recipe);
    // Ajouter les nouveaux tags automatiquement
    for (const tag of recipe.tags) {
      if (!tags.includes(tag)) {
        await storage.addTag(tag);
      }
    }
    await loadData();
  };

  const updateRecipe = async (recipe: Recipe) => {
    await storage.updateRecipe(recipe);
    // Ajouter les nouveaux tags automatiquement
    for (const tag of recipe.tags) {
      if (!tags.includes(tag)) {
        await storage.addTag(tag);
      }
    }
    await loadData();
  };

  const deleteRecipe = async (recipeId: string) => {
    await storage.deleteRecipe(recipeId);
    await loadData();
  };

  const toggleFavorite = async (recipeId: string) => {
    await storage.toggleFavorite(recipeId);
    await loadData();
  };

  const addTag = async (tag: string) => {
    await storage.addTag(tag);
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        books,
        recipes,
        tags,
        loadData,
        addBook,
        updateBook,
        deleteBook,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        addTag,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};