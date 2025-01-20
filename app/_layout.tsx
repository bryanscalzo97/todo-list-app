import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initializeDatabase } from '@/db/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  // Hide the splash screen when the app is loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize the database when the app is loaded
  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDatabase();
    };

    if (loaded) setupDatabase();
  }, [loaded]);

  // Check if the user is authenticated when the app is loaded
  useEffect(() => {
    const checkAuthentication = async () => {
      const session = await SecureStore.getItemAsync('user_session');
      const isAuth = !!session;

      setIsAuthenticated(isAuth);

      if (!isAuth && segments[0] === '(auth)') {
        router.replace('/');
      }
    };

    checkAuthentication();
  }, [segments, router]);

  if (!loaded || isAuthenticated === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
