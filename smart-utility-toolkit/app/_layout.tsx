import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from '@/providers/QueryProvider';
import { DatabaseProvider } from '@/providers/DatabaseProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <DatabaseProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notes/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="helpers/split" options={{ presentation: 'card' }} />
          <Stack.Screen name="helpers/tip" options={{ presentation: 'card' }} />
          <Stack.Screen name="helpers/fuel" options={{ presentation: 'card' }} />
          <Stack.Screen name="helpers/percentage" options={{ presentation: 'card' }} />
        </Stack>
      </DatabaseProvider>
    </QueryProvider>
  );
}
