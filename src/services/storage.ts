/**
 * src/services/storage.ts
 *
 * Service de gestion de la persistance des données de l'application.
 *
 * Ce module fournit toutes les fonctions nécessaires pour interagir avec
 * le stockage local (AsyncStorage) de React Native. Il gère la sauvegarde,
 * la récupération, la mise à jour et la suppression des livres, recettes et tags.
 *
 * Architecture :
 * - Utilise AsyncStorage pour un stockage persistant et asynchrone
 * - Stocke les données au format JSON
 * - Gère les erreurs de manière gracieuse avec des valeurs par défaut
 * - Toutes les fonctions sont asynchrones et retournent des Promises
 *
 * Clés de stockage :
 * - @storage/books : liste de tous les livres
 * - @storage/recipes : liste de toutes les recettes
 * - @storage/tags : liste de tous les tags personnalisés
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Recipe, Collection } from '../models/types';

/**
 * Clés utilisées pour le stockage dans AsyncStorage
 *
 * Ces clés sont préfixées par @storage/ pour éviter les conflits
 * avec d'autres données potentiellement stockées dans AsyncStorage.
 */
const KEYS = {
  /** Clé pour la liste des livres */
  BOOKS: '@storage/books',
  /** Clé pour la liste des recettes */
  RECIPES: '@storage/recipes',
  /** Clé pour la liste des tags */
  TAGS: '@storage/tags',
  /** Clé pour la liste des collections */
  COLLECTIONS: '@storage/collections',
};

/**
 * ============================================================================
 * FONCTIONS DE GESTION DES LIVRES
 * ============================================================================
 */

/**
 * Récupère la liste de tous les livres depuis le stockage
 *
 * @returns {Promise<Book[]>} Tableau de tous les livres stockés, ou tableau vide si erreur
 *
 * @example
 * const books = await getBooks();
 * console.log(`Vous avez ${books.length} livres`);
 */
export const getBooks = async (): Promise<Book[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting books:', error);
    return [];
  }
};

/**
 * Sauvegarde un nouveau livre dans le stockage
 *
 * Ajoute le livre à la fin de la liste existante sans vérifier
 * les doublons (l'ID unique doit être géré en amont).
 *
 * @param {Book} book - Le livre à sauvegarder
 * @returns {Promise<void>}
 *
 * @example
 * const newBook = {
 *   id: 'uuid-123',
 *   title: 'La cuisine française',
 *   author: 'Jean Dupont',
 *   createdAt: new Date().toISOString()
 * };
 * await saveBook(newBook);
 */
export const saveBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks();
    const updatedBooks = [...books, book];
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error saving book:', error);
  }
};

/**
 * Met à jour un livre existant dans le stockage
 *
 * Recherche le livre par son ID et remplace ses données par les nouvelles.
 * Si le livre n'existe pas, aucune modification n'est effectuée.
 *
 * @param {Book} book - Le livre avec les données mises à jour (doit contenir l'ID existant)
 * @returns {Promise<void>}
 *
 * @example
 * const updatedBook = {
 *   ...existingBook,
 *   title: 'Nouveau titre'
 * };
 * await updateBook(updatedBook);
 */
export const updateBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks();
    const updatedBooks = books.map(b => b.id === book.id ? book : b);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error updating book:', error);
  }
};

/**
 * Supprime un livre du stockage et détache les recettes associées
 *
 * Retire le livre de la liste en se basant sur son ID.
 * Les recettes associées à ce livre voient leur bookId mis à undefined,
 * devenant ainsi des "recettes personnelles".
 *
 * @param {string} bookId - L'identifiant unique du livre à supprimer
 * @returns {Promise<number>} Le nombre de recettes détachées
 *
 * @example
 * const detachedCount = await deleteBook('uuid-123');
 * console.log(`${detachedCount} recettes détachées`);
 */
export const deleteBook = async (bookId: string): Promise<number> => {
  try {
    // Supprimer le livre
    const books = await getBooks();
    const updatedBooks = books.filter(b => b.id !== bookId);
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(updatedBooks));

    // Détacher les recettes associées (mettre bookId à undefined)
    const recipes = await getRecipes();
    const updatedRecipes = recipes.map(recipe =>
      recipe.bookId === bookId
        ? { ...recipe, bookId: undefined }
        : recipe
    );
    const detachedCount = recipes.filter(r => r.bookId === bookId).length;
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));

    return detachedCount;
  } catch (error) {
    console.error('Error deleting book:', error);
    return 0;
  }
};

/**
 * ============================================================================
 * FONCTIONS DE GESTION DES RECETTES
 * ============================================================================
 */

/**
 * Récupère la liste de toutes les recettes depuis le stockage
 *
 * @returns {Promise<Recipe[]>} Tableau de toutes les recettes stockées, ou tableau vide si erreur
 *
 * @example
 * const recipes = await getRecipes();
 * const favorites = recipes.filter(r => r.isFavorite);
 */
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

/**
 * Sauvegarde une nouvelle recette dans le stockage
 *
 * Ajoute la recette à la fin de la liste existante.
 * L'ID unique doit être généré en amont.
 *
 * @param {Recipe} recipe - La recette à sauvegarder
 * @returns {Promise<void>}
 *
 * @example
 * const newRecipe = {
 *   id: 'uuid-456',
 *   name: 'Tarte aux pommes',
 *   bookId: 'uuid-123',
 *   tags: ['dessert', 'automne'],
 *   notes: 'Délicieuse avec de la cannelle',
 *   isFavorite: false,
 *   createdAt: new Date().toISOString()
 * };
 * await saveRecipe(newRecipe);
 */
export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = [...recipes, recipe];
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

/**
 * Met à jour une recette existante dans le stockage
 *
 * Recherche la recette par son ID et remplace ses données.
 * Utile pour modifier le nom, les tags, les notes, le statut favori, etc.
 *
 * @param {Recipe} recipe - La recette avec les données mises à jour
 * @returns {Promise<void>}
 *
 * @example
 * const updatedRecipe = {
 *   ...existingRecipe,
 *   tags: [...existingRecipe.tags, 'rapide']
 * };
 * await updateRecipe(updatedRecipe);
 */
export const updateRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? recipe : r);
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error updating recipe:', error);
  }
};

/**
 * Supprime une recette du stockage
 *
 * Retire la recette de la liste en se basant sur son ID.
 *
 * @param {string} recipeId - L'identifiant unique de la recette à supprimer
 * @returns {Promise<void>}
 *
 * @example
 * await deleteRecipe('uuid-456');
 */
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.filter(r => r.id !== recipeId);
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

/**
 * Bascule le statut favori d'une recette
 *
 * Inverse la valeur du champ isFavorite pour la recette spécifiée.
 * Si elle était favorite, elle ne l'est plus, et vice-versa.
 *
 * @param {string} recipeId - L'identifiant unique de la recette
 * @returns {Promise<void>}
 *
 * @example
 * // Marquer/démarquer comme favori
 * await toggleFavorite('uuid-456');
 */
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

/**
 * ============================================================================
 * FONCTIONS DE GESTION DES TAGS
 * ============================================================================
 */

/**
 * Récupère la liste de tous les tags disponibles
 *
 * Si aucun tag personnalisé n'a été sauvegardé, retourne la liste des tags par défaut.
 * Les tags servent à catégoriser et filtrer les recettes.
 *
 * @returns {Promise<string[]>} Tableau de tous les tags, ou tags par défaut si erreur/vide
 *
 * @example
 * const tags = await getTags();
 * // ['printemps', 'été', 'automne', 'hiver', 'végétarien', ...]
 */
export const getTags = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.TAGS);
    return data ? JSON.parse(data) : getDefaultTags();
  } catch (error) {
    console.error('Error getting tags:', error);
    return getDefaultTags();
  }
};

/**
 * Ajoute un nouveau tag à la liste
 *
 * Vérifie que le tag n'existe pas déjà avant de l'ajouter (pas de doublons).
 * Le tag est ajouté à la fin de la liste.
 *
 * @param {string} tag - Le nouveau tag à ajouter
 * @returns {Promise<void>}
 *
 * @example
 * await addTag('pâtisserie');
 * await addTag('cuisine italienne');
 */
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

/**
 * Retourne la liste des tags par défaut de l'application
 *
 * Ces tags couvrent les catégories principales :
 * - Saisons : printemps, été, automne, hiver
 * - Régimes alimentaires : végétarien, végétalien, sans gluten
 * - Types de plats : entrée, plat, dessert
 * - Niveau de difficulté : rapide, difficile
 *
 * @returns {string[]} Tableau des tags par défaut
 */
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

/**
 * ============================================================================
 * FONCTIONS DE GESTION DES COLLECTIONS
 * ============================================================================
 */

/**
 * Récupère la liste de toutes les collections depuis le stockage
 *
 * @returns {Promise<Collection[]>} Tableau de toutes les collections stockées, ou tableau vide si erreur
 *
 * @example
 * const collections = await getCollections();
 * console.log(`Vous avez ${collections.length} collections`);
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.COLLECTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};

/**
 * Sauvegarde une nouvelle collection dans le stockage
 *
 * Ajoute la collection à la fin de la liste existante.
 * L'ID unique doit être généré en amont.
 *
 * @param {Collection} collection - La collection à sauvegarder
 * @returns {Promise<void>}
 *
 * @example
 * const newCollection = {
 *   id: 'uuid-789',
 *   name: 'Desserts rapides',
 *   tags: ['dessert', 'rapide'],
 *   createdAt: new Date().toISOString()
 * };
 * await saveCollection(newCollection);
 */
export const saveCollection = async (collection: Collection): Promise<void> => {
  try {
    const collections = await getCollections();
    const updatedCollections = [...collections, collection];
    await AsyncStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(updatedCollections));
  } catch (error) {
    console.error('Error saving collection:', error);
  }
};

/**
 * Met à jour une collection existante dans le stockage
 *
 * Recherche la collection par son ID et remplace ses données.
 *
 * @param {Collection} collection - La collection avec les données mises à jour
 * @returns {Promise<void>}
 *
 * @example
 * const updatedCollection = {
 *   ...existingCollection,
 *   name: 'Nouveau nom'
 * };
 * await updateCollection(updatedCollection);
 */
export const updateCollection = async (collection: Collection): Promise<void> => {
  try {
    const collections = await getCollections();
    const updatedCollections = collections.map(c => c.id === collection.id ? collection : c);
    await AsyncStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(updatedCollections));
  } catch (error) {
    console.error('Error updating collection:', error);
  }
};

/**
 * Supprime une collection du stockage
 *
 * Retire la collection de la liste en se basant sur son ID.
 *
 * @param {string} collectionId - L'identifiant unique de la collection à supprimer
 * @returns {Promise<void>}
 *
 * @example
 * await deleteCollection('uuid-789');
 */
export const deleteCollection = async (collectionId: string): Promise<void> => {
  try {
    const collections = await getCollections();
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    await AsyncStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(updatedCollections));
  } catch (error) {
    console.error('Error deleting collection:', error);
  }
};