// app/index.tsx
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Получить текущую сессию
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return null;

  // Если сессия есть — в (tabs), иначе — на регистрацию
  return <Redirect href={session ? '/(tabs)' : '/register'} />;
}














