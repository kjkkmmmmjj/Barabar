import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { GroupsProvider } from '@/context/GroupsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Platform, View } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'InterRegular': require('@/assets/fonts/Inter-Regular.ttf'),
    'InterMedium': require('@/assets/fonts/Inter-Medium.ttf'),
    'InterSemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'InterBold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded or if there was an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Still loading fonts
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ThemeProvider>
        <AuthProvider>
          <GroupsProvider>
            <Stack screenOptions={{ 
              headerShown: false,
              ...Platform.select({
                ios: {
                  contentStyle: { backgroundColor: '#fff' }
                }
              })
            }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
            </Stack>
            <StatusBar style="auto" />
          </GroupsProvider>
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}