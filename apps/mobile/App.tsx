import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import ExpensesScreen from './screens/ExpensesScreen';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (authToken: string) => {
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated ? (
        <ExpensesScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});