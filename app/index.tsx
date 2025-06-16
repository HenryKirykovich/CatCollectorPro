// app/index.tsx
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Инициализация сессии
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // Подписка на изменения auth
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Очистка подписки
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) return null;

  return <Redirect href={session ? '/(tabs)' : '/login'} />;
}





















