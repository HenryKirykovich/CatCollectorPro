import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Alert.alert('Registration Error', signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from('users').insert({
        id: userId,
        email,
        full_name: fullName,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('❌ Error inserting data:', insertError.message);
        Alert.alert('User Insert Error', insertError.message);
        return;
      }
    }

    Alert.alert('Success', 'Check your email to confirm your registration.');
    router.replace('/login');
  };

  return (
    <ImageBackground
      source={require('../assets/images/Cat_images/Splash_cat.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Project title */}
          <View style={styles.projectTitleContainer}>
            <Text style={styles.projectTitle}>Catalyze</Text>
          </View>

          {/* Register form */}
          <View style={styles.container}>
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Display Name (optional)"
              value={displayName}
              onChangeText={setDisplayName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerVersion}>v1.0</Text>
            <Text style={styles.footerCredits}>
              © All rights reserved. Created by Henadzi (Henry) Kirykovich
            </Text>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  projectTitleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#B22222',
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto',
  },
  container: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: '100%',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  footerVersion: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 12,
    color: '#777',
  },
  footerCredits: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
});
