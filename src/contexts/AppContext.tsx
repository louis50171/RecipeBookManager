/**
 * src/contexts/AppContext.tsx
 *
 * Contexte React pour la gestion de l'état global de l'application.
 *
 * Ce contexte centralise toutes les données de l'application (livres, recettes, tags)
 * et fournit les fonctions pour les manipuler. Il fait le lien entre les composants
 * de l'interface utilisateur et le service de stockage.
 *
 * Fonctionnalités :
 * - Chargement initial des données depuis AsyncStorage
 * - CRUD complet pour les livres (Create, Read, Update, Delete)
 * - CRUD complet pour les recettes avec gestion automatique des tags
 * - Gestion des favoris
 * - Gestion des tags personnalisés
 * - Synchronisation automatique de l'état après chaque modification
 *
 * Architecture :
 * - État local avec useState pour books, recipes et tags
 * - Toutes les mutations passent par le service storage
 * - Rechargement des données après chaque modification pour garantir la cohérence
 *
 * Utilisation :
 * - Wrapper l'application avec <AppProvider>
 * - Utiliser le hook useApp() dans les composants pour accéder aux données et fonctions
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Recipe } from '../models/types';
import * as storage from '../services/storage';

/**
 * Interface définissant la structure du contexte de l'application
 */
interface AppContextType {
  /** Liste de tous les livres */
  books: Book[];

  /** Liste de toutes les recettes */
  recipes: Recipe[];

  /** Liste de tous les tags disponibles */
  tags: string[];

  /** Recharge toutes les données depuis le stockage */
  loadData: () => Promise<void>;

  /** Ajoute un nouveau livre */
  addBook: (book: Book) => Promise<void>;

  /** Met à jour un livre existant */
  updateBook: (book: Book) => Promise<void>;

  /** Supprime un livre */
  deleteBook: (bookId: string) => Promise<void>;

  /** Ajoute une nouvelle recette */
  addRecipe: (recipe: Recipe) => Promise<void>;

  /** Met à jour une recette existante */
  updateRecipe: (recipe: Recipe) => Promise<void>;

  /** Supprime une recette */
  deleteRecipe: (recipeId: string) => Promise<void>;

  /** Bascule le statut favori d'une recette */
  toggleFavorite: (recipeId: string) => Promise<void>;

  /** Ajoute un nouveau tag à la liste */
  addTag: (tag: string) => Promise<void>;
}

/**
 * Contexte React pour l'état global de l'application
 * Initialisation avec undefined, sera rempli par le AppProvider
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider pour le contexte de l'application
 *
 * Gère l'état global et fournit toutes les fonctions métier aux composants enfants.
 *
 * @param children - Les composants enfants qui auront accès au contexte
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  /** État local contenant tous les livres */
  const [books, setBooks] = useState<Book[]>([]);

  /** État local contenant toutes les recettes */
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  /** État local contenant tous les tags disponibles */
  const [tags, setTags] = useState<string[]>([]);

  /**
   * Charge toutes les données depuis le stockage
   *
   * Utilise Promise.all pour charger en parallèle les livres, recettes et tags,
   * puis met à jour l'état local avec les données récupérées.
   */
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

  /**
   * Effet exécuté au montage du composant
   * Charge les données initiales depuis le stockage
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Ajoute un nouveau livre
   *
   * Sauvegarde le livre dans le stockage puis recharge toutes les données
   * pour synchroniser l'état.
   *
   * @param book - Le livre à ajouter
   */
  const addBook = async (book: Book) => {
    await storage.saveBook(book);
    await loadData();
  };

  /**
   * Met à jour un livre existant
   *
   * @param book - Le livre avec les nouvelles données
   */
  const updateBook = async (book: Book) => {
    await storage.updateBook(book);
    await loadData();
  };

  /**
   * Supprime un livre
   *
   * Note : Cette fonction ne supprime pas automatiquement les recettes associées.
   * Les recettes peuvent rester dans la base avec un bookId orphelin.
   *
   * @param bookId - L'identifiant du livre à supprimer
   */
  const deleteBook = async (bookId: string) => {
    await storage.deleteBook(bookId);
    await loadData();
  };

  /**
   * Ajoute une nouvelle recette
   *
   * Sauvegarde la recette puis parcourt ses tags pour ajouter automatiquement
   * les nouveaux tags à la liste globale. Cela permet à l'utilisateur de créer
   * de nouveaux tags simplement en les utilisant dans une recette.
   *
   * @param recipe - La recette à ajouter
   */
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

  /**
   * Met à jour une recette existante
   *
   * Comme pour addRecipe, gère automatiquement l'ajout de nouveaux tags.
   *
   * @param recipe - La recette avec les nouvelles données
   */
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

  /**
   * Supprime une recette
   *
   * @param recipeId - L'identifiant de la recette à supprimer
   */
  const deleteRecipe = async (recipeId: string) => {
    await storage.deleteRecipe(recipeId);
    await loadData();
  };

  /**
   * Bascule le statut favori d'une recette
   *
   * Si la recette est favorite, elle ne le sera plus, et vice-versa.
   *
   * @param recipeId - L'identifiant de la recette
   */
  const toggleFavorite = async (recipeId: string) => {
    await storage.toggleFavorite(recipeId);
    await loadData();
  };

  /**
   * Ajoute un nouveau tag manuellement
   *
   * Cette fonction peut être utilisée pour créer des tags avant de les utiliser,
   * bien que les tags soient aussi créés automatiquement lors de l'ajout/modification
   * de recettes.
   *
   * @param tag - Le nouveau tag à ajouter
   */
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

/**
 * Hook personnalisé pour accéder au contexte de l'application
 *
 * Doit être utilisé uniquement dans des composants qui sont descendants de AppProvider.
 * Lance une erreur explicite si utilisé en dehors du provider.
 *
 * @returns {AppContextType} Le contexte contenant toutes les données et fonctions
 * @throws {Error} Si utilisé en dehors d'un AppProvider
 *
 * @example
 * const { books, recipes, addBook, deleteRecipe } = useApp();
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};