// src/models/types.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  editor?: string;
  year?: number;
  coverImage?: string; // URL de l'image de couverture
  category?: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  bookId?: string; // Optionnel, peut être null si recette sans livre
  tags: string[];
  notes: string;
  isFavorite: boolean;
  createdAt: string;
}
