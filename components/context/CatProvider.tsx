// Simplified CatProvider.tsx (no React Query)

import React, { useState, useEffect, ReactNode } from 'react';
import { CatContext, Cat } from './CatContext';
import { supabase } from '../../lib/supabase';
import { deleteCatWithImage } from '../../lib/deleteCatWithImage';

type CatProviderProps = { children: ReactNode };

export const CatProvider = ({ children }: CatProviderProps) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔁 Загружаем userId и обновляем список котов при каждом изменении userId
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setCats([]);
        setFavorites([]);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser(); // ⚡ когда сменился пользователь — загружаем нового и котов
    });

    loadUser();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      loadCats(userId);
    }
  }, [userId]);

  const loadCats = async (uid: string) => {
    const { data, error } = await supabase.from('cats').select('*').eq('user_id', uid);
    if (!error && data) {
      setCats(data);
      const favIds = data.filter((cat) => cat.favorite).map((cat) => cat.id!);
      setFavorites(favIds);
    }
  };

  const addCat = async (catData: Omit<Cat, 'id'>): Promise<Cat | null> => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('cats')
      .insert({ ...catData, user_id: userId })
      .select()
      .single();
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
    const success = await deleteCatWithImage(cat);
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
        removeCat,
        toggleFavorite,
      }}
    >
      {children}
    </CatContext.Provider>
  );
};




































































































