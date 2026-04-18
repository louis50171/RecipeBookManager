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
import { Book, Recipe, Collection } from '../models/types';
import * as storage from '../services/storage';
import { AIService, CategorySuggestion } from '../services/AIService';

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

  /** Liste de toutes les collections */
  collections: Collection[];

  /** Recharge toutes les données depuis le stockage */
  loadData: () => Promise<void>;

  /** Ajoute un nouveau livre */
  addBook: (book: Book) => Promise<void>;

  /** Met à jour un livre existant */
  updateBook: (book: Book) => Promise<void>;

  /** Supprime un livre et retourne le nombre de recettes détachées */
  deleteBook: (bookId: string) => Promise<number>;

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

  /** Ajoute une nouvelle collection */
  addCollection: (collection: Collection) => Promise<void>;

  /** Met à jour une collection existante */
  updateCollection: (collection: Collection) => Promise<void>;

  /** Supprime une collection */
  deleteCollection: (collectionId: string) => Promise<void>;

  /** Suggère une catégorie pour un livre basée sur son titre, auteur et pseudonyme */
  suggestBookCategory: (title: string, author: string, pseudonym?: string) => CategorySuggestion[];
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

  /** État local contenant toutes les collections */
  const [collections, setCollections] = useState<Collection[]>([]);

  /**
   * Charge toutes les données depuis le stockage
   *
   * Utilise Promise.all pour charger en parallèle les livres, recettes, tags et collections,
   * puis met à jour l'état local avec les données récupérées.
   */
  const loadData = async () => {
    const [loadedBooks, loadedRecipes, loadedTags, loadedCollections] = await Promise.all([
      storage.getBooks().catch(() => [] as Book[]),
      storage.getRecipes().catch(() => [] as Recipe[]),
      storage.getTags().catch(() => [] as string[]),
      storage.getCollections().catch(() => [] as Collection[]),
    ]);
    setBooks(loadedBooks);
    setRecipes(loadedRecipes);
    setTags(loadedTags);
    setCollections(loadedCollections);
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
    setBooks(prev => [...prev, book]);
  };

  /**
   * Met à jour un livre existant
   *
   * @param book - Le livre avec les nouvelles données
   */
  const updateBook = async (book: Book) => {
    await storage.updateBook(book);
    setBooks(prev => prev.map(b => b.id === book.id ? book : b));
  };

  /**
   * Supprime un livre et détache les recettes associées
   *
   * Les recettes associées au livre supprimé deviennent des recettes personnelles
   * (leur bookId est mis à undefined).
   *
   * @param bookId - L'identifiant du livre à supprimer
   * @returns Le nombre de recettes détachées
   */
  const deleteBook = async (bookId: string): Promise<number> => {
    const detachedCount = await storage.deleteBook(bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    // Les recettes liées ont été détachées dans le storage — on recharge uniquement les recettes
    const loadedRecipes = await storage.getRecipes().catch(() => [] as Recipe[]);
    setRecipes(loadedRecipes);
    return detachedCount;
  };

  /**
   * Ajoute une nouvelle recette
   *
   * Sauvegarde la recette puis parcourt ses tags pour ajouter automatiquement
   * les nouveaux tags à la liste globale.
   *
   * @param recipe - La recette à ajouter
   */
  const addRecipe = async (recipe: Recipe) => {
    await storage.saveRecipe(recipe);
    const newTags: string[] = [];
    for (const tag of recipe.tags) {
      if (tag.trim() && !tags.includes(tag)) {
        await storage.addTag(tag);
        newTags.push(tag);
      }
    }
    setRecipes(prev => [...prev, recipe]);
    if (newTags.length > 0) {
      setTags(prev => [...prev, ...newTags]);
    }
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
    const newTags: string[] = [];
    for (const tag of recipe.tags) {
      if (tag.trim() && !tags.includes(tag)) {
        await storage.addTag(tag);
        newTags.push(tag);
      }
    }
    setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
    if (newTags.length > 0) {
      setTags(prev => [...prev, ...newTags]);
    }
  };

  /**
   * Supprime une recette
   *
   * @param recipeId - L'identifiant de la recette à supprimer
   */
  const deleteRecipe = async (recipeId: string) => {
    await storage.deleteRecipe(recipeId);
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
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
    setRecipes(prev => prev.map(r =>
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  /**
   * Ajoute un nouveau tag manuellement
   *
   * @param tag - Le nouveau tag à ajouter
   */
  const addTag = async (tag: string) => {
    await storage.addTag(tag);
    setTags(prev => [...prev, tag]);
  };

  /**
   * Ajoute une nouvelle collection
   *
   * @param collection - La collection à ajouter
   */
  const addCollection = async (collection: Collection) => {
    await storage.saveCollection(collection);
    setCollections(prev => [...prev, collection]);
  };

  /**
   * Met à jour une collection existante
   *
   * @param collection - La collection avec les nouvelles données
   */
  const updateCollection = async (collection: Collection) => {
    await storage.updateCollection(collection);
    setCollections(prev => prev.map(c => c.id === collection.id ? collection : c));
  };

  /**
   * Supprime une collection
   *
   * @param collectionId - L'identifiant de la collection à supprimer
   */
  const deleteCollection = async (collectionId: string) => {
    await storage.deleteCollection(collectionId);
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  /**
   * Suggère une catégorie pour un livre basée sur son titre, auteur et pseudonyme
   *
   * Utilise l'IA locale pour analyser le titre, l'auteur et le pseudonyme et proposer
   * des catégories pertinentes avec un niveau de confiance.
   *
   * @param title - Le titre du livre
   * @param author - L'auteur du livre
   * @param pseudonym - Le pseudonyme de l'auteur (optionnel)
   * @returns Un tableau de suggestions de catégories triées par confiance décroissante
   */
  const suggestBookCategory = (title: string, author: string, pseudonym?: string): CategorySuggestion[] => {
    return AIService.suggestCategory(title, author, books, pseudonym);
  };

  return (
    <AppContext.Provider
      value={{
        books,
        recipes,
        tags,
        collections,
        loadData,
        addBook,
        updateBook,
        deleteBook,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        addTag,
        addCollection,
        updateCollection,
        deleteCollection,
        suggestBookCategory,
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