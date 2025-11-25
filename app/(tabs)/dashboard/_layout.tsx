// app/(tabs)/dashboard/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: 'Dashboard',
        drawerType: 'front',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="pending"
        options={{
          title: 'Pending Tasks',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="completed"
        options={{
          title: 'Completed Tasks',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="incomplete"
        options={{
          title: 'Incomplete Tasks',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="deleted"
        options={{
          title: 'Deleted Tasks',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trash-can-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
