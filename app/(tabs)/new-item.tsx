// (tabs)/new-item.tsx

// app/(tabs)/new-item.tsx

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { CatContext } from '../../components/context/CatContext';
import { uploadImageAsync } from '../../lib/uploadToStorage';

export default function NewItemScreen() {
  const { addCat, updateCat, selectedCat, setSelectedCat } = useContext(CatContext);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState({ title: '', description: '', origin: '' });
  const [forceAddNew, setForceAddNew] = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    if (selectedCat && !forceAddNew) {
      setTitle(selectedCat.title || '');
      setDescription(selectedCat.description || '');
      setOrigin(selectedCat.origin || '');
      setImage(selectedCat.image || '');
    } else {
      clearFields();
    }
  }, [selectedCat, forceAddNew]);

  const clearFields = () => {
    setTitle('');
    setDescription('');
    setOrigin('');
    setImage(null);
    setErrors({ title: '', description: '', origin: '' });
    setSelectedCat(null);
    setForceAddNew(false);
  };

  const validateForm = () => {
    const newErrors = { title: '', description: '', origin: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
      isValid = false;
    } else if (title[0] !== title[0].toUpperCase()) {
      newErrors.title = 'Title must start with an uppercase letter.';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
      isValid = false;
    }

    if (!origin.trim()) {
      newErrors.origin = 'Origin is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setImage(null);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let uploadedImageUrl: string | undefined;
    const isNewImageUploaded = image && image.startsWith('file:'); // ✅ Фикс

    if (isNewImageUploaded) {
      try {
        const fileName = `cat_${Date.now()}.jpg`;
        const url = await uploadImageAsync(image, fileName);
        if (!url) {
          Alert.alert('Upload failed');
          return;
        }
        uploadedImageUrl = url;
      } catch (e) {
        console.error('❌ Upload error:', e);
        Alert.alert('Upload error', 'Unable to upload image.');
        return;
      }
    }

    try {
      if (selectedCat?.id && !forceAddNew) {
        await updateCat({
          ...selectedCat,
          title: title.trim(),
          description: description.trim(),
          origin: origin.trim(),
          image: uploadedImageUrl ?? selectedCat.image,
        });
      } else {
        const result = await addCat({
          title: title.trim(),
          description: description.trim(),
          origin: origin.trim(),
          image: uploadedImageUrl,
        });

        if (!result) {
          Alert.alert('Error', 'Failed to save new cat.');
          return;
        }
      }

      Alert.alert('Success', selectedCat?.id && !forceAddNew ? 'Cat updated!' : 'New cat saved!');
      setSelectedCat(null);
      setForceAddNew(false);
      router.replace('/');
    } catch (e) {
      console.error('❌ Submit failed:', e);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  const isEditing = Boolean(selectedCat?.id && !forceAddNew);

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
            <Text style={styles.label}>Cat Name *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="Enter cat name"
            />
            {errors.title ? <Text style={styles.error}>{errors.title}</Text> : null}

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Describe the cat"
            />
            {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

            <Text style={styles.label}>Origin *</Text>
            <TextInput
              style={styles.input}
              value={origin}
              onChangeText={(text) => {
                setOrigin(text);
                setErrors((prev) => ({ ...prev, origin: '' }));
              }}
              placeholder="Enter origin (e.g., Thailand)"
            />
            {errors.origin ? <Text style={styles.error}>{errors.origin}</Text> : null}

            <View style={styles.buttonSpacing}>
              <Button title="📷 Take Photo" onPress={takePhoto} />
            </View>
            <View style={styles.buttonSpacing}>
              <Button title="🖼️ Choose from Gallery" onPress={pickImage} />
            </View>

            {image && (
              <>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.buttonSpacing}>
                  <Button title="Remove Image" onPress={removeImage} color="#d9534f" />
                </View>
              </>
            )}

            <View style={styles.buttonSpacing}>
              <Button title={isEditing ? 'Update Cat' : 'Add Cat'} onPress={handleSubmit} />
            </View>

            <View style={styles.buttonSpacing}>
              <Button title="🧹 Clear Fields" onPress={clearFields} color="#999" />
            </View>
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
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    borderRadius: 8,
    height: 200,
    marginVertical: 10,
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 1,
    marginTop: 4,
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 15,
  },
});
