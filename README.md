# RecipeBookManager

Une application mobile React Native pour gérer votre collection de livres de recettes et retrouver facilement vos plats préférés.

## À propos du projet

RecipeBookManager est une alternative moderne aux classeurs de recettes traditionnels et aux fichiers Excel peu pratiques. Cette application vous permet d'organiser numériquement vos livres de cuisine et de retrouver instantanément n'importe quelle recette grâce à un système de tags et de favoris.

### Pourquoi cette application ?

- **Organisation simplifiée** : Remplacement des post-its/excel difficile ou long à mettre en place, et gestion optimisé des recettes dans différents livres
- **Recherche rapide** : Retrouvez une recette par saison, type de plat, ou difficulté en quelques secondes
- **Données locales** : Toutes vos données restent sur votre appareil (utilisation d'AsyncStorage)
- **Interface moderne** : Design épuré avec support du mode sombre

## Fonctionnalités

### Gestion des livres de recettes

- Ajout de livres avec titre, auteur, éditeur, année et photo de couverture
- Catégorisation des livres (cuisine française, pâtisserie, etc.)
- Modification et suppression des livres
- Affichage de la liste complète de votre bibliothèque

### Gestion des recettes

- Ajout de recettes avec nom, tags personnalisés et notes
- Association des recettes à un livre ou création de recettes indépendantes
- Système de favoris pour retrouver rapidement vos meilleures recettes
- Filtrage par tags (saison, type de plat, régime alimentaire, difficulté, etc.)
- Modification et suppression des recettes

### Interface utilisateur

- Dashboard avec statistiques en temps réel (nombre de livres, recettes, favoris)
- Navigation par drawer (menu burger)
- Thème clair et sombre avec basculement instantané
- Design responsive et moderne

## Technologies utilisées

### Framework et langage

- **React Native** (0.81.5) - Framework mobile multi-plateforme
- **Expo** (54.0.25) - Plateforme de développement React Native
- **TypeScript** (5.9.2) - Typage statique pour un code plus robuste

### Navigation

- **React Navigation** (7.x) - Navigation native-stack et drawer
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/drawer`

### UI et design

- **React Native Paper** (5.14.5) - Composants Material Design
- **React Native Gesture Handler** - Gestion des gestes tactiles
- **React Native Reanimated** - Animations fluides

### Stockage

- **AsyncStorage** - Persistance locale des données (livres, recettes, tags)

### Autres dépendances

- **Expo Camera** - Capture de photos pour les couvertures de livres
- **Expo Image Picker** - Sélection d'images depuis la galerie

## Limitations et considérations

### Scan automatique de recettes

Le scan et l'ajout automatique de recettes à partir d'une table des matières **ne sont pas implémentés** pour des raisons de droits d'auteur. Les recettes de livres publiés sont protégées par le droit d'auteur et il n'est pas légal de les reproduire automatiquement sans autorisation.

À la place, l'application permet de :
- Référencer les recettes avec leur nom et leur emplacement dans le livre
- Ajouter des notes personnelles sur vos modifications et astuces
- Organiser vos recettes par tags pour les retrouver facilement

### Données persistantes

Toutes les données sont stockées localement sur l'appareil via AsyncStorage. Il n'y a pas de synchronisation cloud ou de sauvegarde automatique. Pensez à :
- Sauvegarder régulièrement les données de l'application
- Ne pas désinstaller l'application sans avoir exporté vos données

## Installation

### Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un émulateur Android/iOS ou l'application Expo Go sur votre smartphone

### Installation des dépendances

```bash
npm install
```

## Utilisation en mode développement

### Démarrer l'application

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Lancer sur le web
npm run web
```

### Scanner le QR code

Après avoir lancé `npm start`, scannez le QR code avec :
- **Android** : L'application Expo Go
- **iOS** : L'appareil photo natif (qui ouvrira Expo Go)



### Contextes React

- **AppContext** : Gère l'état global (livres, recettes, tags) et fournit les fonctions CRUD
- **ThemeContext** : Gère le thème de l'application (clair/sombre)

### Stockage

Le service `storage.ts` encapsule AsyncStorage et fournit des fonctions pour :
- Sauvegarder et récupérer les livres
- Sauvegarder et récupérer les recettes
- Gérer les tags personnalisés
- Basculer le statut favori des recettes

## Choix techniques

### Pourquoi pas de synchronisation cloud ?

Cette application est conçue comme une alternative **locale et privée** aux classeurs Excel. L'absence de synchronisation cloud garantit :
- Contrôle total sur vos données
- Aucun coût d'infrastructure
- Respect de la vie privée

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## Auteur

Développé par **louis50171** - Une solution moderne pour les passionnés de cuisine qui souhaitent organiser leur collection de recettes.


---

**Note importante** : Cette application respecte le droit d'auteur des recettes. Elle ne permet pas de scanner ou copier automatiquement le contenu des livres, mais simplement de référencer et organiser vos recettes personnelles.
