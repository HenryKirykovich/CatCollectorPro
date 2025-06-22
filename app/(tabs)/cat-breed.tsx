// This component is part of the Cat Breeds app.
// It allows users to take or select a photo of a cat,
// sends it to a backend server for AI analysis,
// and displays the detected breed, description, and origin.

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CatContext } from '../../components/context/CatContext';

export default function CatBreedScreen() {
  // Stores the selected image URI
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Indicates whether the app is loading the AI result
  const [loading, setLoading] = useState(false);

  // Stores the AI analysis result
  const [aiResult, setAiResult] = useState<{
    title: string;
    description: string;
    origin: string;
  } | null>(null);

  const router = useRouter();
  const { setSelectedCat } = useContext(CatContext);

  // Request permissions for camera and media access
  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Sends base64 image to backend for AI analysis
  const callAI = async (base64Image: string) => {
    setLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('http://44.230.52.71:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${base64Image}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.title || !data.description || !data.origin)
        throw new Error('Incomplete data from backend.');

      setAiResult({
        title: data.title.trim(),
        description: data.description.trim(),
        origin: data.origin.trim(),
      });
    } catch (e) {
      console.error('❌ Backend AI error:', e);
      Alert.alert(
        'Image Not Recognized',
        'Sorry, the image is too blurry or unclear. Please try again with a clearer photo of the cat.'
      );
    }
    setLoading(false);
  };

  // Opens camera or gallery to select an image and sends it for analysis
  const pickImage = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setImageUri(result.assets[0].uri);
      await callAI(result.assets[0].base64);
    }
  };

  // Sets the selected cat data in global context and navigates to the form
  const handleFillForm = () => {
    if (aiResult && imageUri) {
      setSelectedCat({
        title: aiResult.title,
        description: aiResult.description,
        origin: aiResult.origin,
        image: imageUri,
      });
      router.push('/(tabs)/new-item');
    }
  };

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
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Cat Breed Detector Powered by AI</Text>

            {/* Photo picker buttons */}
            <View style={styles.buttonSpacing}>
              <Button title="📷 Take Photo" onPress={() => pickImage(true)} />
            </View>
            <View style={styles.buttonSpacing}>
              <Button title="🖼️ Choose from Gallery" onPress={() => pickImage(false)} />
            </View>

            {/* Display selected image with rounded corners and shadow */}
            {imageUri && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Loading indicator */}
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

            {/* AI result display */}
            {aiResult && (
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Breed:</Text>
                <Text style={styles.resultText}>{aiResult.title}</Text>

                <Text style={styles.resultLabel}>Description:</Text>
                <Text style={styles.resultText}>{aiResult.description}</Text>

                <Text style={styles.resultLabel}>Origin:</Text>
                <Text style={styles.resultText}>{aiResult.origin}</Text>

                <TouchableOpacity style={styles.fillButton} onPress={handleFillForm}>
                  <Text style={styles.fillButtonText}>Fill New Cat Card</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
  buttonSpacing: {
    marginVertical: 6,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  fillButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  fillButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    borderRadius: 20,
    height: '100%',
    width: '100%', // Must match imageWrapper to round
  },
  imageWrapper: {
    alignSelf: 'center',
    width: '90%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    overflow: 'hidden', // Required to clip corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: '#fff',
    marginVertical: 16,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 15,
  },
  resultBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginTop: 16,
    padding: 12,
  },
  resultLabel: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 32,
    textAlign: 'center',
  },
});
