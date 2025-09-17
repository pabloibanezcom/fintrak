import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import ExpensesScreen from './screens/ExpensesScreen';
import LoginScreen from './screens/LoginScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { authStorage } from './utils/authStorage';
import { apiService } from './services/api';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await authStorage.getToken();
      if (storedToken) {
        apiService.setToken(storedToken);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (authToken: string) => {
    try {
      await authStorage.setToken(authToken);
      setToken(authToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing auth token:', error);
      setToken(authToken);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    try {
      await authStorage.removeToken();
      apiService.setToken(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth token:', error);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background.primary}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background.primary}
      />
      <SafeAreaView style={[styles.container, !isAuthenticated && styles.loginContainer]}>
        {isAuthenticated ? (
          <ExpensesScreen onLogout={handleLogout} />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </SafeAreaView>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loginContainer: {
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});