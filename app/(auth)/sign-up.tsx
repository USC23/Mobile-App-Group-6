// app/(auth)/sign-up.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextInputField from '../../src/components/TextInputField';
import { signUp } from '../../src/api/auth';
import { login } from '../../src/state/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const canSubmit = email && password && confirm && password === confirm && validEmail(email);

  const handleSignUp = async () => {
    setError('');
    if (!canSubmit) {
      setError('Please fix the errors above.');
      return;
    }
    setLoading(true);
    try {
      const res = await signUp({ email, password });
      login({ email: res.user.email });
      router.replace('/dashboard');
    } catch (e: any) {
      setError(e?.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Account</Text>

          <TextInputField
            label="Your email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            accessibilityLabel="Email"
          />
          {!validEmail(email) && email.length > 0 && <Text style={styles.error}>Enter a valid email</Text>}

          <View style={{ width: '100%' }}>
            <TextInputField
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              textContentType="newPassword"
              accessibilityLabel="Password"
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.toggle}>
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          <TextInputField
            label="Confirm password"
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secure={!showPassword}
            textContentType="password"
            accessibilityLabel="Confirm password"
          />
          {password && confirm && password !== confirm && <Text style={styles.error}>Passwords do not match</Text>}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, !canSubmit || loading ? styles.buttonDisabled : null]}
            onPress={handleSignUp}
            disabled={!canSubmit || loading}
            accessibilityRole="button"
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 16 }}>
            <Text style={styles.link}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  toggle: { position: 'absolute', right: 8, top: 36, padding: 8 },
  toggleText: { color: '#007AFF' },
  button: { backgroundColor: '#0b5fff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 20, color: '#007AFF', textAlign: 'center', fontSize: 16 },
  error: { color: '#b00020', marginTop: 8, textAlign: 'center' },
});
