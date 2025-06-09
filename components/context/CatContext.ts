// components/context/CatContext.ts
import { createContext } from 'react';
import React from 'react';

export interface Cat {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  origin?: string;
  favorite?: boolean;
}

export interface CatContextType {
  cats: Cat[];
  addCat: (cat: Omit<Cat, 'id'>) => Promise<Cat | null>;
  removeCat: (cat: Cat) => void; // ✅ изменено
  updateCat: (updated: Cat) => void;
  selectedCat: Cat | null;
  setSelectedCat: (cat: Cat | null) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export const CatContext = createContext<CatContextType>({
  cats: [],
  addCat: async () => null,
  removeCat: () => {},
  updateCat: () => {},
  selectedCat: null,
  setSelectedCat: () => {},
  favorites: [],
  toggleFavorite: () => {},
});