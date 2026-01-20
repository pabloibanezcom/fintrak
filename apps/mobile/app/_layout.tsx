import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../context/ThemeContext';
import { UserProvider } from '../context/UserContext';
import { SessionProvider } from '../context/SessionContext';
import { colors } from '../styles';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <SessionProvider>
            <StatusBar style="light" />
            <Slot />
          </SessionProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
