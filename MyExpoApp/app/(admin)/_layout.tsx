import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const { isAdmin, isAuthenticated } = useAuth();

  // Navigation guard: redirect non-admins
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isAdmin) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isAdmin]);

  // Don't render until auth is verified
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          tabBarIcon: ({ color }) => <MaterialIcons name="article" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarIcon: ({ color }) => <MaterialIcons name="photo-library" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
