// app/(tabs)/index.tsx

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { CatContext } from '../../components/context/CatContext';
import CatCard from '../../components/CatCard';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [fullName, setFullName] = useState<string | null>(null);
  const { cats, setSelectedCat } = useContext(CatContext);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setFullName(data.full_name);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/login');
    } else {
      Alert.alert('Logout Error', error.message);
    }
  };

  const filteredItems = cats.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ImageBackground
      source={require('../../assets/images/Cat_images/Splash_cat.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logout}>← Logout</Text>
            </TouchableOpacity>
            {fullName && (
              <Text style={styles.username}>👤 {fullName}</Text>
            )}
          </View>

          <View style={styles.innerContainer}>
            <Text style={styles.header}>Cat&#39;s breed</Text>

            <TextInput
              style={styles.input}
              placeholder="Search cat's breed..."
              value={search}
              onChangeText={setSearch}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => console.log('Search:', search)}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => item.id ?? index.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 20 }}>
                  <CatCard
                    cat={item}
                    onPress={() => {
                      setSelectedCat(item);
                      router.push('/(tabs)/cat-details');
                    }}
                    showActions={true}
                  />
                </View>
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 15,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logout: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  username: {
    fontSize: 14,
    color: '#333',
  },
  innerContainer: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 600,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: '#999',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  searchButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
