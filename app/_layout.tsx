import 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';
import { StatsProvider } from '@/lib/StatsContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/lib/ThemeContext';
import { soundManager } from '@/lib/sounds';

import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

// Custom theme will be created dynamically in StackWithTheme

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    // FontAwesome icons don't need font loading in newer versions
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initialize sound manager
      soundManager.init().catch(console.error);
    }
  }, [loaded]);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      soundManager.cleanup().catch(console.error);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <StatsProvider>
            <BackgroundWrapper>
              <StackWithTheme />
            </BackgroundWrapper>
          </StatsProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
}

function StackWithTheme() {
  const { colors, theme } = useTheme();
  
  // Create dynamic navigation theme
  const navigationTheme = {
    ...DefaultTheme,
    dark: theme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.textLight,
      notification: colors.primary,
    },
  };
  
  return (
    <ThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right',
            gestureEnabled: true,
            contentStyle: { backgroundColor: colors.background },
            animationDuration: Platform.OS === 'android' ? 150 : 200,
            cardStyle: { backgroundColor: colors.background },
            cardOverlayEnabled: false,
            cardShadowEnabled: false,
          }}>
          <Stack.Screen 
            name="onboarding"
            options={{
              cardStyle: { backgroundColor: colors.background },
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="index"
            options={{
              cardStyle: { backgroundColor: colors.background },
              contentStyle: { backgroundColor: colors.background },
            }}
          />
          <Stack.Screen 
            name="activities"
            options={{
              cardStyle: { backgroundColor: colors.background },
              contentStyle: { backgroundColor: colors.background },
            }}
          />
          <Stack.Screen 
            name="timer"
            options={{
              cardStyle: { backgroundColor: colors.background },
              contentStyle: { backgroundColor: colors.background },
            }}
          />
          <Stack.Screen 
            name="complete"
            options={{
              cardStyle: { backgroundColor: colors.background },
              contentStyle: { backgroundColor: colors.background },
            }}
          />
          <Stack.Screen
            name="add-activity"
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              contentStyle: { backgroundColor: 'transparent' },
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
