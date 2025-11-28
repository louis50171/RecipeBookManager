// src/theme/colors.ts

export const lightTheme = {
  background: '#F5F5F0', // Beige clair
  surface: '#FFFFFF',
  surfaceSecondary: '#F0EBE3', // Beige pour les cartes
  primary: '#D4A574', // Orange/corail clair comme l'image
  primaryDark: '#C89563',
  accent: '#E6B88A',
  text: {
    primary: '#2C2C2C',
    secondary: '#666666',
    tertiary: '#999999',
  },
  card: {
    background: '#F0EBE3',
    border: '#E5DFD6',
  },
  button: {
    primary: '#D4A574',
    text: '#FFFFFF',
  },
  tag: {
    background: '#FBF2E9',
    text: '#C89563',
  },
  favorite: '#D4A574',
  error: '#C76B6B',
  divider: '#E0E0E0',
};

export const darkTheme = {
  background: '#1A1F1A', // Vert très foncé
  surface: '#2A3A2A',
  surfaceSecondary: '#3A4A3A',
  primary: '#D4A574', // Même orange/corail en mode sombre
  primaryDark: '#C89563',
  accent: '#E6B88A',
  text: {
    primary: '#E5E5E5',
    secondary: '#B0B0B0',
    tertiary: '#808080',
  },
  card: {
    background: '#2F3F2F',
    border: '#3F4F3F',
  },
  button: {
    primary: '#D4A574',
    text: '#1A1F1A',
  },
  tag: {
    background: '#3A4A3A',
    text: '#E6B88A',
  },
  favorite: '#D4A574',
  error: '#E89B9B',
  divider: '#3F4F3F',
};

export type Theme = typeof lightTheme;