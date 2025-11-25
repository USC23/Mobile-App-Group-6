// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getCurrentUser } from '../src/state/auth';

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // show UI immediately and run navigation without blocking render
    setReady(true);
    const t = setTimeout(() => {
      const user = getCurrentUser();
      if (user) {
        // navigate to dashboard
        router.replace('/dashboard');
      } else {
        // navigate to auth landing
        router.replace('/');
      }
    }, 50);
    return () => clearTimeout(t);
  }, []);

  if (!ready)
    return (
      <View style={styles.loading}>
        <Text>Loading…</Text>
      </View>
    );

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
