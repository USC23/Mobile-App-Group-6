// app/(auth)/sign-up.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { login } from '../../src/state/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = () => {
    if (!email || !password || password !== confirm) return;
    login({ email }); // mock signup -> logged in
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword}
        secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={confirm} onChangeText={setConfirm}
        secureTextEntry style={styles.input} />
      <Button title="Sign Up" onPress={handleSignUp} />
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8 },
  link: { marginTop: 20, color: '#007AFF', textAlign: 'center', fontSize: 16 },
});
