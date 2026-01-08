# RecipeBookManager

Application mobile de gestion de livres de recettes personnelles.
Projet personnel visant à concevoir une application complète, de la structuration du code à l'expérience utilisateur.

## Fonctionnalités

### Disponibles
- **Gestion des livres** : Ajout, modification, suppression avec photo de couverture
- **Gestion des recettes** : Association aux livres, système de favoris, tags personnalisés
- **Interface moderne** : Dashboard avec statistiques, thème clair/sombre, navigation drawer
- **Stockage local** : Persistance des données avec AsyncStorage

### En cours
- Optimisation de l'organisation par catégories

### En études
- intégration d'une IA

## Stack technique

- **React Native** (0.81.5) avec **Expo** (54.0.25)
- **TypeScript** (5.9.2)
- **React Navigation** (7.x) - Navigation native-stack et drawer
- **React Native Paper** (5.14.5) - Composants Material Design
- **AsyncStorage** - Stockage local
- **Expo Camera & Image Picker** - Gestion des images

## État du projet

Projet en cours de développement actif.
Ce projet sert de support pour démontrer mes compétences en développement mobile, en structuration de projet et en gestion de l'état applicatif.

**Choix de conception** : Application locale et privée, sans synchronisation cloud, pour garantir le contrôle total des données et le respect de la vie privée et des droits d'auteurs.

## Ce que ce projet m'a apporté

- Structuration complète d'une application mobile React Native
- Gestion de l'état global avec Context API (AppContext, ThemeContext)
- Architecture modulaire avec séparation des responsabilités (services, contextes, écrans)
- Implémentation de la persistance locale avec AsyncStorage
- Gestion de la navigation complexe (stack + drawer)
- Design responsive avec thème clair/sombre
- Organisation du travail via GitHub (commits structurés, gestion de projet)

## Installation

### Prérequis

- Node.js (version 18+)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Émulateur Android/iOS ou Expo Go sur smartphone

### Commandes

```bash
# Installation
npx expo install

# Démarrer l'application
npx expo start

# Lancer sur Android/iOS
npm run android
npm run ios
```

## Architecture

### Structure du projet

```
src/
├── components/     # Composants réutilisables
├── contexts/       # AppContext, ThemeContext
├── screens/        # Écrans de l'application
├── services/       # storage.ts (AsyncStorage)
└── types/          # Types TypeScript
```

### Contextes React

- **AppContext** : Gestion de l'état global (livres, recettes, tags) et fonctions CRUD
- **ThemeContext** : Gestion du thème (clair/sombre)

### Service de stockage

Le fichier [storage.ts](src/services/storage.ts) encapsule AsyncStorage pour :
- Sauvegarder et récupérer les livres/recettes
- Gérer les tags personnalisés
- Basculer le statut favori

## Notes importantes

### Respect du droit d'auteur

Cette application respecte le droit d'auteur des recettes. Elle ne permet pas de scanner ou copier automatiquement le contenu des livres, mais simplement de référencer et organiser vos recettes personnelles avec des notes.

### Données locales

Toutes les données sont stockées localement via AsyncStorage (pas de cloud). Pensez à sauvegarder vos données avant de désinstaller l'application.

## Licence

Ce projet est sous licence MIT.

## Auteur

Développé par [louis50171](https://github.com/louis50171)

---

*Application conçue pour les passionnés de cuisine souhaitant organiser leur collection de recettes de manière moderne et privée.*
