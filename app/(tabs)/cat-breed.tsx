// (tabs)/cat-breed    powered AI 

import Constants from 'expo-constants';
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
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    title: string;
    description: string;
    origin: string;
  } | null>(null);
  const router = useRouter();
  const { setSelectedCat } = useContext(CatContext);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;
  

  const callAI = async (base64Image: string) => {
    setLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image of a cat. Return the result as a JSON object with three fields:\n{\n  "title": "Breed name in English",\n  "description": "One or two short sentences describing its physical and personality traits.",\n  "origin": "Country or region where this breed originated"\n}`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      });

      const json = await response.json();
      const raw = json.choices?.[0]?.message?.content;
      const extracted = raw?.match(/\{[\s\S]*?\}/);
      if (!extracted) throw new Error('No JSON found.');
      const data = JSON.parse(extracted[0]);

      if (!data.title || !data.description || !data.origin) throw new Error('Incomplete data');
      setAiResult({
        title: data.title.trim(),
        description: data.description.trim(),
        origin: data.origin.trim(),
      });
    } catch (e) {
      console.error('❌ AI error:', e);
      Alert.alert('AI Error', 'Failed to parse AI response.');
    }
    setLoading(false);
  };

  const pickImage = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

    if (!result.canceled && result.assets?.[0]?.base64) {
      setImageUri(result.assets[0].uri);
      await callAI(result.assets[0].base64);
    }
  };

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
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cat Breed Detector Powered by AI 🧠🐾</Text>

            <View style={styles.buttonSpacing}>
              <Button title="📷 Take Photo" onPress={() => pickImage(true)} />
            </View>
            <View style={styles.buttonSpacing}>
              <Button title="🖼️ Choose from Gallery" onPress={() => pickImage(false)} />
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

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
    borderRadius: 8,
    height: 200,
    marginVertical: 10,
    width: '100%',
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
    textAlign: 'center',
  },
});
