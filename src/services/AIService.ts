import { Book } from '../models/types';

/**
 * Service d'IA locale pour suggérer des catégories de livres
 */

export interface CategorySuggestion {
  category: string;
  confidence: number; // 0-1
  reason: string;
}

export class AIService {
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
}
