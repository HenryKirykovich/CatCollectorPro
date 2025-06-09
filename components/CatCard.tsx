// components/CatCard.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CatContext } from './context/CatContext';
import {FC } from 'react'; // ✅ include FC here if needed


// Define Cat type (adjust if you already have it elsewhere)
type Cat = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

type CatCardProps = {
  cat: Cat;
  onPress: () => void;
  showActions?: boolean;
};

const CatCard: React.FC<CatCardProps> = ({ cat, onPress, showActions = false }) => {
  const { favorites, toggleFavorite, removeCat, setSelectedCat } = useContext(CatContext);
  const isFavorite = favorites.includes(cat.id);
  const router = useRouter();

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.card}>
          {/* Circle image preview */}
          {cat.image && (
            <Image source={{ uri: cat.image }} style={styles.thumbnail} resizeMode="cover" />
          )}

          {/* Title and description */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>{cat.title}</Text>
            {cat.description ? <Text style={styles.description}>{cat.description}</Text> : null}
          </View>

          {/* Favorite icon */}
          <TouchableOpacity onPress={() => toggleFavorite(cat.id)}>
            <Ionicons
              testID="favorite-icon"
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? 'red' : 'gray'}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Action buttons: Delete & Edit */}
      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => removeCat(cat)}>
            <Ionicons name="trash-outline" size={20} color="gray" />
            <Text style={styles.iconText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSelectedCat(cat);
              router.push('/(tabs)/new-item');
            }}
          >
            <Ionicons name="create-outline" size={20} color="gray" />
            <Text style={styles.iconText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginTop: 8,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  description: {
    color: '#555',
    fontSize: 14,
    marginTop: 4,
  },
  heartIcon: {
    marginLeft: 10,
  },
  iconButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 24, // replaces unsupported "gap"
  },
  iconText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 4,
  },
  textBlock: {
    flex: 1,
  },
  thumbnail: {
    backgroundColor: '#eee',
    borderColor: '#ccc',
    borderRadius: 40,
    borderWidth: 1,
    height: 80,
    marginRight: 12,
    width: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CatCard;
