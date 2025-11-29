// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, logout, setCurrentUser, subscribeAuth } from '../../src/state/auth';
import { useTasks } from '../../src/state/tasks';

export default function ProfileScreen() {
  const router = useRouter();
  const { tasks, deleteTask } = useTasks();

  // reactive user state via subscription
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const unsubscribe = subscribeAuth((u) => setUser(u));
    return () => {
      unsubscribe();
    };
  }, []);

  const nameFromEmail = useMemo(() => {
    const local = user?.name ?? user?.email?.split('@')[0] ?? '';
    return local ? local.replace(/[._\-]/g, ' ') : 'Unknown';
  }, [user]);

  const initial = useMemo(() => {
    const n = nameFromEmail.trim();
    return n.length ? n.charAt(0).toUpperCase() : '?';
  }, [nameFromEmail]);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const [displayName, setDisplayName] = useState(nameFromEmail);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'due'>('due');

  useEffect(() => {
    setDisplayName(nameFromEmail);
  }, [nameFromEmail]);

  const confirmClearCompleted = () => {
    if (completedCount === 0) {
      Alert.alert('Nothing to clear', 'You have no completed tasks to remove.');
      return;
    }
    Alert.alert(
      'Clear completed',
      `Remove ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const completedTasks = tasks.filter(t => t.status === 'completed');
            completedTasks.forEach(t => {
              if (t.id) deleteTask(t.id);
            });
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ],
    );
  };

  const saveDisplayName = () => {
    setCurrentUser({ name: displayName });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{user?.email ?? 'No email provided'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your tasks</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={confirmClearCompleted}>
            <Text style={styles.actionText}>Clear completed tasks</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: '#4ade80', false: '#e5e7eb' }}
              thumbColor={Platform.OS === 'android' ? (notificationsEnabled ? '#16a34a' : '#fff') : undefined}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Default sort (local view)</Text>
            <View style={styles.sortRow}>
              <TouchableOpacity
                style={[styles.sortBtn, sort === 'due' ? styles.sortActive : null]}
                onPress={() => setSort('due')}
              >
                <Text style={[styles.sortText, sort === 'due' ? styles.sortTextActive : null]}>Due date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortBtn, sort === 'newest' ? styles.sortActive : null]}
                onPress={() => setSort('newest')}
              >
                <Text style={[styles.sortText, sort === 'newest' ? styles.sortTextActive : null]}>Newest</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortBtn, sort === 'oldest' ? styles.sortActive : null]}
                onPress={() => setSort('oldest')}
              >
                <Text style={[styles.sortText, sort === 'oldest' ? styles.sortTextActive : null]}>Oldest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>

          <Text style={styles.label}>Display name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            style={styles.input}
            onBlur={saveDisplayName}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7fafc' },
  container: { padding: 20, paddingBottom: 40 },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: '#e11d48',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },

  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  email: { color: '#64748b', marginTop: 4 },

  card: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#0f172a' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  statLabel: { color: '#64748b', marginTop: 4 },

  actionBtn: {
    marginTop: 12, backgroundColor: '#f97316', paddingVertical: 10, borderRadius: 10, alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: '700' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#475569', fontSize: 14 },

  sortRow: { flexDirection: 'row', marginTop: 8 },
  sortBtn: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  sortActive: { backgroundColor: '#0ea5a4' },
  sortText: { color: '#0f172a', fontWeight: '600' },
  sortTextActive: { color: '#fff' },

  input: {
    marginTop: 8, borderWidth: 1, borderColor: '#e6eef2', padding: 10, borderRadius: 8, backgroundColor: '#fff',
  },

  logoutButton: { marginTop: 14, backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
});
