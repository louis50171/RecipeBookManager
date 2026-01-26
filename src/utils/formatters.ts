/**
 * Utilitaires de formatage pour l'affichage des données
 */

/**
 * Formate l'affichage d'un auteur avec son pseudonyme
 *
 * Règles d'affichage :
 * - Si pseudonyme uniquement : affiche le pseudonyme
 * - Si nom et pseudonyme : affiche "Pseudonyme (Nom Réel)"
 * - Si nom uniquement : affiche le nom
 *
 * @param author - Nom réel de l'auteur
 * @param pseudonym - Pseudonyme de l'auteur (optionnel)
 * @returns Chaîne formatée pour l'affichage
 *
 * @example
 * formatAuthorDisplay("Thibault Villanova", "Gastronogeek")
 * // => "Gastronogeek (Thibault Villanova)"
 *
 * formatAuthorDisplay("Pierre Hermé", undefined)
 * // => "Pierre Hermé"
 *
 * formatAuthorDisplay("", "Chef Damien")
 * // => "Chef Damien"
 */
export function formatAuthorDisplay(author: string, pseudonym?: string): string {
  // Si on a un pseudonyme, on le met en avant
  if (pseudonym && pseudonym.trim()) {
    // Si on a aussi le nom réel, on l'affiche entre parenthèses
    if (author && author.trim()) {
      return `${pseudonym.trim()} (${author.trim()})`;
    }
    // Sinon, juste le pseudonyme
    return pseudonym.trim();
  }

  // Si pas de pseudonyme, on affiche juste le nom
  return author.trim();
}

/**
 * Obtient le nom principal de l'auteur (pseudonyme prioritaire)
 * Utile pour les recherches et le tri
 *
 * @param author - Nom réel de l'auteur
 * @param pseudonym - Pseudonyme de l'auteur (optionnel)
 * @returns Le pseudonyme s'il existe, sinon le nom réel
 *
 * @example
 * getAuthorPrimaryName("Thibault Villanova", "Gastronogeek")
 * // => "Gastronogeek"
 *
 * getAuthorPrimaryName("Pierre Hermé", undefined)
 * // => "Pierre Hermé"
 */
export function getAuthorPrimaryName(author: string, pseudonym?: string): string {
  return (pseudonym && pseudonym.trim()) ? pseudonym.trim() : author.trim();
}
