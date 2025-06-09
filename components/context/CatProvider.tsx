// Simplified CatProvider.tsx (no React Query)
import React, { useState, useEffect, ReactNode } from 'react';
import { CatContext, Cat } from './CatContext';
import { supabase } from '../../lib/supabase';
import { deleteCatWithImage } from '../../lib/deleteCatWithImage'; // ✅ импорт функции

type CatProviderProps = { children: ReactNode };

export const CatProvider = ({ children }: CatProviderProps) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    const { data, error } = await supabase.from('cats').select('*');
    if (!error && data) {
      setCats(data);
      const favIds = data.filter((cat) => cat.favorite).map((cat) => cat.id!);
      setFavorites(favIds);
    }
  };

  const addCat = async (catData: Omit<Cat, 'id'>): Promise<Cat | null> => {
    const { data, error } = await supabase.from('cats').insert(catData).select().single();
    if (!error && data) {
      setCats((prev) => [...prev, data]);
      return data;
    }
    return null;
  };

  const updateCat = async (updatedCat: Cat) => {
    const { error } = await supabase.from('cats').update(updatedCat).eq('id', updatedCat.id);
    if (!error) {
      setCats((prev) => prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));
    }
  };

  const removeCat = async (cat: Cat) => {
    const success = await deleteCatWithImage(cat); // ✅ удаление и из storage, и из базы
    if (success && cat.id) {
      setCats((prev) => prev.filter((c) => c.id !== cat.id));
      setFavorites((prev) => prev.filter((favId) => favId !== cat.id));
      setSelectedCat(null);
    }
  };

  const toggleFavorite = async (id: string) => {
    const isNowFavorite = !favorites.includes(id);
    const { error } = await supabase.from('cats').update({ favorite: isNowFavorite }).eq('id', id);
    if (!error) {
      setFavorites((prev) =>
        isNowFavorite ? [...prev, id] : prev.filter((favId) => favId !== id),
      );
      setCats((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, favorite: isNowFavorite } : cat)),
      );
    }
  };

  return (
    <CatContext.Provider
      value={{
        cats,
        favorites,
        selectedCat,
        setSelectedCat,
        addCat,
        updateCat,
        removeCat, // ✅ уже обновлён
        toggleFavorite,
      }}
    >
      {children}
    </CatContext.Provider>
  );
};




































































