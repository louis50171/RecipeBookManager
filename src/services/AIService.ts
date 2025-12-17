import { Book, Recipe, Collection } from '../models/types';

/**
 * Service d'IA locale pour analyser les données et fournir des suggestions intelligentes
 */

export interface CategorySuggestion {
  category: string;
  confidence: number; // 0-1
  reason: string;
}

export interface BookRecommendation {
  suggestedCategory: string;
  reason: string;
  relatedTags: string[];
}

export interface DiscoverInsights {
  yourBooks: Book[];
  suggestions: CategorySuggestion[];
  stats: {
    totalBooks: number;
    totalRecipes: number;
    favoriteCount: number;
    topTags: Array<{ tag: string; count: number }>;
    topCategories: Array<{ category: string; count: number }>;
  };
}

export class AIService {
  /**
   * Analyse les recettes favorites pour identifier les préférences de l'utilisateur
   */
  static analyzeFavoritePreferences(recipes: Recipe[]): {
    topTags: Array<{ tag: string; count: number }>;
    preferences: string[];
  } {
    const favoriteRecipes = recipes.filter((r) => r.isFavorite);

    if (favoriteRecipes.length === 0) {
      return { topTags: [], preferences: [] };
    }

    // Compter les tags dans les recettes favorites
    const tagCounts: Record<string, number> = {};
    favoriteRecipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Trier par fréquence
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // Extraire les préférences principales (tags avec plus de 2 occurrences ou top 5)
    const preferences = topTags
      .filter((t) => t.count >= 2)
      .slice(0, 5)
      .map((t) => t.tag);

    return { topTags, preferences };
  }

  /**
   * Suggère une catégorie pour un livre basée sur son titre, auteur et pseudonyme
   */
  static suggestCategory(title: string, author: string, existingBooks: Book[], pseudonym?: string): CategorySuggestion[] {
    const suggestions: CategorySuggestion[] = [];
    const lowerTitle = title.toLowerCase();
    const lowerAuthor = author.toLowerCase();
    const lowerPseudonym = pseudonym?.toLowerCase() || '';

    // Base de connaissances pour la catégorisation
    const categoryKeywords: Record<string, string[]> = {
      'Pâtisserie': ['pâtisserie', 'pâtissier', 'gâteau', 'gâteaux', 'dessert', 'desserts', 'cake', 'baking', 'boulangerie', 'tarte', 'tartes', 'cookie', 'macaron'],
      'Cuisine française': ['français', 'france', 'bistrot', 'gastronomie française', 'escoffier', 'bocuse', 'robuchon'],
      'Cuisine italienne': ['italien', 'italie', 'pasta', 'pizza', 'risotto', 'italia'],
      'Cuisine asiatique': ['asiatique', 'chinois', 'japonais', 'thai', 'vietnam', 'coréen', 'sushi', 'wok', 'ramen'],
      'Cuisine végétarienne': ['végétarien', 'végétalien', 'vegan', 'veggie', 'légumes', 'sans viande'],
      'Cuisine santé': ['santé', 'healthy', 'minceur', 'diététique', 'équilibré', 'nutrition', 'bien-être'],
      'Cuisine rapide': ['rapide', 'quick', 'express', '15 minutes', '20 minutes', '30 minutes', 'facile'],
      'Cuisine du monde': ['monde', 'world', 'voyage', 'exotique'],
      'Cuisine régionale': ['terroir', 'régional', 'provence', 'bretagne', 'alsace', 'savoie'],
      'Cuisine de saison': ['saison', 'seasonal', 'printemps', 'été', 'automne', 'hiver'],
      'Barbecue et grillades': ['barbecue', 'bbq', 'grillade', 'plancha', 'fumoir'],
      'Cuisine de fête': ['fête', 'réception', 'cocktail', 'apéritif', 'buffet', 'noël', 'réveillon'],
    };

    // Auteurs célèbres et leurs spécialités (nom réel ou pseudonyme)
    const famousChefs: Record<string, { category: string; confidence: number }> = {
      // Pâtisserie
      'pierre hermé': { category: 'Pâtisserie', confidence: 0.95 },
      'christophe michalak': { category: 'Pâtisserie', confidence: 0.95 },
      'philippe conticini': { category: 'Pâtisserie', confidence: 0.9 },
      'claire heitzler': { category: 'Pâtisserie', confidence: 0.9 },

      // Cuisine française
      'cyril lignac': { category: 'Cuisine française', confidence: 0.85 },
      'gordon ramsay': { category: 'Cuisine française', confidence: 0.75 },
      'alain ducasse': { category: 'Cuisine française', confidence: 0.9 },
      'paul bocuse': { category: 'Cuisine française', confidence: 0.95 },
      'philippe etchebest': { category: 'Cuisine française', confidence: 0.85 },

      // Cuisine végétarienne & santé
      'yotam ottolenghi': { category: 'Cuisine végétarienne', confidence: 0.85 },

      // Cuisine rapide & accessible
      'jamie oliver': { category: 'Cuisine rapide', confidence: 0.8 },

      // Pseudonymes célèbres
      'gastronogeek': { category: 'Cuisine de fête', confidence: 0.9 },
      'thibault villanova': { category: 'Cuisine de fête', confidence: 0.9 },
      'chef damien': { category: 'Cuisine française', confidence: 0.75 },
      'hervé cuisine': { category: 'Cuisine rapide', confidence: 0.8 },
    };

    // Vérifier les auteurs célèbres (par nom réel ou pseudonyme)
    for (const [chef, info] of Object.entries(famousChefs)) {
      if (lowerAuthor.includes(chef) || lowerPseudonym.includes(chef)) {
        const matchedBy = lowerPseudonym.includes(chef) ? 'pseudonyme' : 'nom';
        suggestions.push({
          category: info.category,
          confidence: info.confidence,
          reason: `Auteur reconnu pour la ${info.category} (${matchedBy})`,
        });
      }
    }

    // Analyser le titre pour trouver des mots-clés
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matchedKeywords = keywords.filter(
        (keyword) => lowerTitle.includes(keyword) || lowerAuthor.includes(keyword)
      );

      if (matchedKeywords.length > 0) {
        const confidence = Math.min(0.7 + matchedKeywords.length * 0.1, 0.95);
        suggestions.push({
          category,
          confidence,
          reason: `Mots-clés détectés: ${matchedKeywords.join(', ')}`,
        });
      }
    }

    // Analyser les livres existants pour détecter des patterns
    if (existingBooks.length > 0) {
      const categoryCounts: Record<string, number> = {};
      existingBooks.forEach((book) => {
        if (book.category) {
          categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
        }
      });

      const totalBooks = existingBooks.length;
      const mostCommonCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0];

      if (mostCommonCategory && suggestions.length === 0) {
        // Si aucune suggestion trouvée, suggérer la catégorie la plus commune
        suggestions.push({
          category: mostCommonCategory[0],
          confidence: 0.3,
          reason: `Catégorie fréquente dans votre bibliothèque (${mostCommonCategory[1]}/${totalBooks} livres)`,
        });
      }
    }

    // Trier par confiance décroissante
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Génère des recommandations basées sur les préférences de l'utilisateur
   */
  static getBookRecommendations(
    recipes: Recipe[],
    books: Book[]
  ): BookRecommendation[] {
    const { preferences, topTags } = this.analyzeFavoritePreferences(recipes);

    if (preferences.length === 0) {
      return [];
    }

    const recommendations: BookRecommendation[] = [];

    // Mapper les tags vers des catégories de livres
    const tagToCategoryMapping: Record<string, string[]> = {
      'dessert': ['Pâtisserie', 'Cuisine de fête'],
      'végétarien': ['Cuisine végétarienne', 'Cuisine santé'],
      'végétalien': ['Cuisine végétarienne', 'Cuisine santé'],
      'rapide': ['Cuisine rapide', 'Cuisine du quotidien'],
      'difficile': ['Pâtisserie', 'Cuisine française'],
      'sans gluten': ['Cuisine santé', 'Cuisine végétarienne'],
      'entrée': ['Cuisine française', 'Cuisine du monde'],
      'plat': ['Cuisine française', 'Cuisine du monde', 'Cuisine régionale'],
      'printemps': ['Cuisine de saison'],
      'été': ['Cuisine de saison', 'Barbecue et grillades'],
      'automne': ['Cuisine de saison'],
      'hiver': ['Cuisine de saison', 'Cuisine de fête'],
    };

    // Catégories déjà possédées
    const ownedCategories = new Set(
      books.map((b) => b.category).filter((c): c is string => !!c)
    );

    // Pour chaque préférence, suggérer des catégories
    const suggestedCategories = new Set<string>();
    preferences.forEach((tag) => {
      const categories = tagToCategoryMapping[tag] || [];
      categories.forEach((cat) => {
        if (!ownedCategories.has(cat)) {
          suggestedCategories.add(cat);
        }
      });
    });

    // Créer les recommandations
    suggestedCategories.forEach((category) => {
      const relatedTags = preferences.filter((tag) => {
        const cats = tagToCategoryMapping[tag] || [];
        return cats.includes(category);
      });

      recommendations.push({
        suggestedCategory: category,
        reason: `Basé sur vos recettes favorites avec les tags: ${relatedTags.join(', ')}`,
        relatedTags,
      });
    });

    return recommendations;
  }

  /**
   * Génère des insights pour l'écran "Découvrir"
   */
  static getDiscoverInsights(
    books: Book[],
    recipes: Recipe[],
    searchQuery?: string
  ): DiscoverInsights {
    // Analyser les préférences
    const { topTags, preferences } = this.analyzeFavoritePreferences(recipes);

    // Statistiques globales
    const favoriteCount = recipes.filter((r) => r.isFavorite).length;

    // Top catégories
    const categoryCounts: Record<string, number> = {};
    books.forEach((book) => {
      if (book.category) {
        categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Livres correspondant à la recherche
    let yourBooks = books;
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      yourBooks = books.filter(
        (book) =>
          book.category?.toLowerCase().includes(query) ||
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.pseudonym && book.pseudonym.toLowerCase().includes(query))
      );
    }

    // Générer des suggestions basées sur la recherche ou les préférences
    let suggestions: CategorySuggestion[] = [];

    if (searchQuery && searchQuery.trim()) {
      // Suggestions basées sur la recherche
      const allCategories = [
        'Pâtisserie',
        'Cuisine française',
        'Cuisine italienne',
        'Cuisine asiatique',
        'Cuisine végétarienne',
        'Cuisine santé',
        'Cuisine rapide',
        'Cuisine du monde',
        'Cuisine régionale',
        'Cuisine de saison',
        'Barbecue et grillades',
        'Cuisine de fête',
      ];

      const query = searchQuery.toLowerCase();
      const ownedCategories = new Set(books.map((b) => b.category).filter((c): c is string => !!c));

      suggestions = allCategories
        .filter((cat) => !ownedCategories.has(cat) && cat.toLowerCase().includes(query))
        .map((cat) => ({
          category: cat,
          confidence: 0.8,
          reason: `Correspond à votre recherche "${searchQuery}"`,
        }));
    } else {
      // Suggestions basées sur les préférences
      const recommendations = this.getBookRecommendations(recipes, books);
      suggestions = recommendations.map((rec) => ({
        category: rec.suggestedCategory,
        confidence: 0.75,
        reason: rec.reason,
      }));
    }

    return {
      yourBooks,
      suggestions,
      stats: {
        totalBooks: books.length,
        totalRecipes: recipes.length,
        favoriteCount,
        topTags: topTags.slice(0, 5),
        topCategories,
      },
    };
  }

  /**
   * Analyse conversationnelle simple pour comprendre les intentions
   */
  static parseIntent(query: string): {
    intent: 'search_category' | 'search_generic' | 'get_suggestions';
    category?: string;
    keywords: string[];
  } {
    const lowerQuery = query.toLowerCase().trim();

    // Détecter les mots clés d'intention
    const suggestionKeywords = ['suggère', 'suggérer', 'recommande', 'idée', 'découvrir', 'nouveau'];
    const isSuggestionIntent = suggestionKeywords.some((kw) => lowerQuery.includes(kw));

    if (isSuggestionIntent) {
      return {
        intent: 'get_suggestions',
        keywords: lowerQuery.split(/\s+/),
      };
    }

    // Extraire les catégories mentionnées
    const categoryKeywords = [
      'pâtisserie', 'dessert', 'végétarien', 'français', 'italien',
      'asiatique', 'rapide', 'santé', 'saison', 'barbecue', 'fête'
    ];

    const detectedCategory = categoryKeywords.find((cat) => lowerQuery.includes(cat));

    if (detectedCategory) {
      return {
        intent: 'search_category',
        category: detectedCategory,
        keywords: [detectedCategory],
      };
    }

    return {
      intent: 'search_generic',
      keywords: lowerQuery.split(/\s+/),
    };
  }
}
