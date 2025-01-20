import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const session = await SecureStore.getItemAsync('user_session');
      setIsAuthenticated(!!session);

      if (!session) {
        router.replace('/');
      }
    };

    checkAuthentication();
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="todos/index" />
      <Stack.Screen name="todos/addTask" />
      <Stack.Screen name="todos/editTask" />
    </Stack>
  );
}
