// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { getCurrentUser, logout } from '../../src/state/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user?.email || 'Unknown'}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 12 },
  label: { fontSize: 14, color: '#555' },
  value: { fontSize: 16, marginBottom: 20 },
});
