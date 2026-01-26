/**
 * App.tsx
 *
 * Point d'entrée principal de l'application RecipeBookManager.
 *
 * Cette application permet de gérer une collection de livres de recettes
 * et des recettes associées à ces livres. L'utilisateur peut :
 * - Ajouter, modifier et supprimer des livres de recettes
 * - Ajouter, modifier et supprimer des recettes
 * - Organiser les recettes par tags (saison, type de plat, régime alimentaire, etc.)
 * - Marquer des recettes comme favorites
 * - Basculer entre un thème clair et un thème sombre
 *
 * Architecture de l'application :
 * - Utilise React Context API pour la gestion d'état globale
 * - ThemeProvider : gère le thème de l'application (clair/sombre)
 * - AppProvider : gère les données de l'application (livres, recettes, tags)
 * - AppNavigator : gère la navigation entre les différents écrans
 */

import React from 'react';
import { AppProvider } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Composant principal de l'application
 *
 * Organise la hiérarchie des providers Context :
 * 1. ThemeProvider (niveau le plus haut) - fournit le thème à toute l'application
 * 2. AppProvider - fournit les données et fonctions métier
 * 3. AppNavigator - gère la navigation entre les écrans
 *
 * @returns {JSX.Element} L'application complète avec tous les providers
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </ThemeProvider>
  );
}