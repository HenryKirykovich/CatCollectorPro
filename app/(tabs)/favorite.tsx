import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { CatContext } from '../../components/context/CatContext';
import CatCard from '../../components/CatCard';

export default function FavoritesScreen() {
  const { cats, favorites, setSelectedCat } = useContext(CatContext);

  const favoriteCats = cats.filter((cat) => favorites.includes(cat.id));

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
          <View style={styles.innerContainer}>
            <Text style={styles.header}>Favorite Cats</Text>

            {favoriteCats.length === 0 ? (
              <Text style={styles.empty}>
                No favorites yet. ❤️ Tap hearts on the home page!
              </Text>
            ) : (
              <FlatList
                data={favoriteCats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <CatCard
                      cat={item}
                      onPress={() => setSelectedCat(item)}
                      showActions={false}
                    />
                  </View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator
              />
            )}
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
  empty: {
    color: '#444',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  innerContainer: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 600,
    paddingHorizontal: 16,
    width: '100%',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
});
