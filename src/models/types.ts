/**
 * src/models/types.ts
 *
 * Définitions des types TypeScript pour les modèles de données de l'application.
 *
 * Ce fichier centralise toutes les interfaces qui représentent les entités
 * métier de l'application : livres de recettes et recettes culinaires.
 */

/**
 * Interface représentant un livre de recettes
 *
 * Un livre de recettes contient des informations bibliographiques
 * et peut être associé à plusieurs recettes.
 *
 * @interface Book
 */
export interface Book {
  /** Identifiant unique du livre (UUID généré à la création) */
  id: string;

  /** Titre du livre de recettes */
  title: string;

  /** Nom de l'auteur du livre */
  author: string;

  /** Pseudonyme ou nom de scène de l'auteur (optionnel) */
  pseudonym?: string;

  /** Nom de la maison d'édition (optionnel) */
  editor?: string;

  /** Année de publication du livre (optionnel) */
  year?: number;

  /**
   * URL ou chemin vers l'image de couverture du livre (optionnel)
   * Peut être une URI locale (ex: file://) ou une URL distante
   */
  coverImage?: string;

  /** Catégorie ou genre du livre (ex: "Cuisine française", "Pâtisserie") (optionnel) */
  category?: string;

  /** Date de création de l'entrée au format ISO 8601 */
  createdAt: string;
}

/**
 * Interface représentant une recette culinaire
 *
 * Une recette peut être associée à un livre ou être indépendante.
 * Elle contient des tags pour faciliter la recherche et le filtrage,
 * et peut être marquée comme favorite.
 *
 * @interface Recipe
 */
export interface Recipe {
  /** Identifiant unique de la recette (UUID généré à la création) */
  id: string;

  /** Nom de la recette */
  name: string;

  /**
   * Identifiant du livre auquel appartient cette recette (optionnel)
   * Si non défini, la recette est considérée comme indépendante (sans livre)
   */
  bookId?: string;

  /**
   * Liste de tags associés à la recette pour faciliter la recherche et le filtrage
   * Exemples de tags : saisons (printemps, été), types (entrée, plat, dessert),
   * régimes alimentaires (végétarien, sans gluten), difficulté (rapide, difficile)
   */
  tags: string[];

  /**
   * Notes personnelles sur la recette
   * Peut contenir des modifications, des astuces, des commentaires, etc.
   */
  notes: string;

  /**
   * Indicateur de favori
   * true si la recette est marquée comme favorite, false sinon
   */
  isFavorite: boolean;

  /**
   * URL ou chemin vers l'image de la recette (optionnel)
   * Peut être une URI locale (ex: file://) pour une photo prise avec l'appareil
   * ou une capture d'écran d'une recette trouvée sur internet
   */
  recipeImage?: string;

  /** Date de création de l'entrée au format ISO 8601 */
  createdAt: string;
}

/**
 * Interface représentant une collection de recettes
 *
 * Une collection est une recherche sauvegardée basée sur des tags.
 * Elle permet de regrouper des recettes selon des critères personnalisés
 * sans avoir à refaire la même recherche à chaque fois.
 *
 * @interface Collection
 */
export interface Collection {
  /** Identifiant unique de la collection (UUID généré à la création) */
  id: string;

  /** Nom de la collection (ex: "Desserts rapides", "Plats d'hiver") */
  name: string;

  /**
   * Liste des tags qui définissent cette collection
   * Les recettes affichées dans la collection seront celles qui contiennent
   * AU MOINS UN de ces tags (union logique OR)
   */
  tags: string[];

  /** Date de création de l'entrée au format ISO 8601 */
  createdAt: string;
}
