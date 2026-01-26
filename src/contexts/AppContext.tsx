/**
 * Contexte global de l'application
 *
 * Gère l'état global incluant :
 * - Liste des livres de recettes
 * - Liste des recettes
 * - Tags disponibles
 * - Collections personnalisées
 * - Opérations CRUD pour toutes les entités
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Recipe, Collection } from '../models/types';

export interface CategorySuggestion {
  category: string;
  confidence: number;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Simplissime',
    author: 'Jean-François Mallet',
    editor: 'Hachette Pratique',
    year: 2015,
    category: 'Cuisine rapide',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'La Pâtisserie',
    author: 'Christophe Felder',
    editor: 'La Martinière',
    year: 2019,
    category: 'Pâtisserie',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: '3',
    title: 'Veggie',
    author: 'Alice Hart',
    editor: 'Marabout',
    year: 2018,
    category: 'Végétarien',
    createdAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: '4',
    title: 'Le Grand Livre de la Cuisine',
    author: 'Alain Ducasse',
    editor: 'Ducasse Édition',
    year: 2020,
    category: 'Gastronomie',
    createdAt: new Date('2024-04-20').toISOString(),
  },
];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Poulet rôti aux herbes',
    bookId: '1',
    tags: ['plat', 'viande', 'facile'],
    notes: 'Excellent ! Ajouter plus de thym la prochaine fois.',
    isFavorite: true,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '2',
    name: 'Tarte au citron meringuée',
    bookId: '2',
    tags: ['dessert', 'pâtisserie', 'agrumes'],
    notes: 'La meringue doit être bien dorée.',
    isFavorite: true,
    createdAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: '3',
    name: 'Buddha Bowl coloré',
    bookId: '3',
    tags: ['plat', 'végétarien', 'santé'],
    notes: 'Parfait pour le déjeuner, très frais.',
    isFavorite: false,
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: '4',
    name: 'Risotto aux champignons',
    bookId: '4',
    tags: ['plat', 'italien', 'végétarien'],
    notes: 'Remuer constamment pour un résultat crémeux.',
    isFavorite: true,
    createdAt: new Date('2024-04-25').toISOString(),
  },
  {
    id: '5',
    name: 'Crêpes maison',
    bookId: '1',
    tags: ['dessert', 'facile', 'gourmand'],
    notes: 'Recette familiale testée et approuvée.',
    isFavorite: false,
    createdAt: new Date('2024-05-01').toISOString(),
  },
];

const INITIAL_TAGS = [
  'plat',
  'dessert',
  'entrée',
  'viande',
  'poisson',
  'végétarien',
  'pâtisserie',
  'facile',
  'rapide',
  'santé',
  'gourmand',
  'italien',
  'français',
  'agrumes',
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: '1',
    name: 'Mes Favoris',
    tags: ['favoris'],
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'Repas Rapides',
    tags: ['facile', 'rapide'],
    createdAt: new Date('2024-01-05').toISOString(),
  },
];

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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);

  const loadData = async () => {
    // Les données sont déjà initialisées en mémoire
  };

  useEffect(() => {
    // Initialisation au démarrage
  }, []);

  const addBook = async (book: Book) => {
    setBooks(prevBooks => [...prevBooks, book]);
  };

  const updateBook = async (book: Book) => {
    setBooks(prevBooks => prevBooks.map(b => b.id === book.id ? book : b));
  };

  const deleteBook = async (bookId: string): Promise<number> => {
    setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));

    let detachedCount = 0;
    setRecipes(prevRecipes => prevRecipes.map(r => {
      if (r.bookId === bookId) {
        detachedCount++;
        return { ...r, bookId: undefined };
      }
      return r;
    }));

    return detachedCount;
  };

  const addRecipe = async (recipe: Recipe) => {
    setRecipes(prevRecipes => [...prevRecipes, recipe]);

    const newTags = recipe.tags.filter(tag => !tags.includes(tag));
    if (newTags.length > 0) {
      setTags(prevTags => [...prevTags, ...newTags]);
    }
  };

  const updateRecipe = async (recipe: Recipe) => {
    setRecipes(prevRecipes => prevRecipes.map(r => r.id === recipe.id ? recipe : r));

    const newTags = recipe.tags.filter(tag => !tags.includes(tag));
    if (newTags.length > 0) {
      setTags(prevTags => [...prevTags, ...newTags]);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
  };

  const toggleFavorite = async (recipeId: string) => {
    setRecipes(prevRecipes => prevRecipes.map(r =>
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const addTag = async (tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prevTags => [...prevTags, tag]);
    }
  };

  const addCollection = async (collection: Collection) => {
    setCollections(prevCollections => [...prevCollections, collection]);
  };

  const updateCollection = async (collection: Collection) => {
    setCollections(prevCollections => prevCollections.map(c => c.id === collection.id ? collection : c));
  };

  const deleteCollection = async (collectionId: string) => {
    setCollections(prevCollections => prevCollections.filter(c => c.id !== collectionId));
  };

  const suggestBookCategory = (title: string, author: string, pseudonym?: string): CategorySuggestion[] => {
    const suggestions: CategorySuggestion[] = [
      { category: 'Cuisine générale', confidence: 0.7 },
      { category: 'Pâtisserie', confidence: 0.5 },
      { category: 'Gastronomie', confidence: 0.4 },
    ];
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pâtisserie') || lowerTitle.includes('dessert') || lowerTitle.includes('gâteau')) {
      suggestions[0] = { category: 'Pâtisserie', confidence: 0.9 };
    } else if (lowerTitle.includes('végé') || lowerTitle.includes('vegan')) {
      suggestions[0] = { category: 'Végétarien', confidence: 0.9 };
    } else if (lowerTitle.includes('rapide') || lowerTitle.includes('simple')) {
      suggestions[0] = { category: 'Cuisine rapide', confidence: 0.9 };
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
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