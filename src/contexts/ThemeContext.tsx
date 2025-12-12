/**
 * src/contexts/ThemeContext.tsx
 *
 * Contexte React pour la gestion du thème de l'application.
 *
 * Ce contexte gère le thème visuel (clair/sombre) de l'application et permet
 * de basculer entre les deux modes. Le thème choisi est persisté dans AsyncStorage
 * pour être conservé entre les sessions.
 *
 * Fonctionnalités :
 * - Détection du thème système au premier lancement
 * - Sauvegarde et restauration de la préférence utilisateur
 * - Bascule entre thème clair et thème sombre
 * - Fournit l'objet thème complet à tous les composants enfants
 *
 * Utilisation :
 * - Wrapper l'application avec <ThemeProvider>
 * - Utiliser le hook useTheme() dans les composants pour accéder au thème
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, modernCuisineTheme, Theme } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface définissant la structure du contexte de thème
 */
interface ThemeContextType {
  /** Objet thème actuel contenant toutes les couleurs */
  theme: Theme;

  /** Indicateur si le mode sombre est activé */
  isDark: boolean;

  /** Fonction pour basculer entre thème clair et sombre */
  toggleTheme: () => void;
}

/**
 * Contexte React pour le thème de l'application
 * Initialisation avec undefined, sera rempli par le ThemeProvider
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provider pour le contexte de thème
 *
 * Gère l'état du thème et fournit les fonctions de manipulation aux composants enfants.
 *
 * Fonctionnement :
 * 1. Au montage, détecte le thème système de l'appareil
 * 2. Charge la préférence utilisateur sauvegardée (si elle existe)
 * 3. Permet de basculer le thème et sauvegarde automatiquement la préférence
 *
 * @param children - Les composants enfants qui auront accès au contexte
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  /** Récupère le thème système de l'appareil (clair ou sombre) */
  const systemColorScheme = useColorScheme();

  /** État indiquant si le mode sombre est activé (initialisé avec le thème système) */
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  /**
   * Effet exécuté au montage du composant
   * Charge la préférence de thème sauvegardée de l'utilisateur
   */
  useEffect(() => {
    loadThemePreference();
  }, []);

  /**
   * Charge la préférence de thème depuis AsyncStorage
   *
   * Si une préférence est trouvée, elle remplace le thème système par défaut.
   * En cas d'erreur, conserve le thème système initial.
   */
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  /**
   * Bascule entre le thème clair et le thème sombre
   *
   * Inverse l'état actuel du thème et sauvegarde la nouvelle préférence
   * dans AsyncStorage pour la persistance entre les sessions.
   */
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  /** Sélectionne l'objet thème approprié en fonction de l'état isDark */
  const theme = isDark ? darkTheme : modernCuisineTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder au contexte de thème
 *
 * Doit être utilisé uniquement dans des composants qui sont descendants de ThemeProvider.
 * Lance une erreur explicite si utilisé en dehors du provider.
 *
 * @returns {ThemeContextType} Le contexte de thème contenant theme, isDark et toggleTheme
 * @throws {Error} Si utilisé en dehors d'un ThemeProvider
 *
 * @example
 * const { theme, isDark, toggleTheme } = useTheme();
 * const backgroundColor = theme.background;
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};