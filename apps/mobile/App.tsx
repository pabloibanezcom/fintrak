import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, ActivityIndicator, View, Animated } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import BottomNavigation from './components/BottomNavigation';
import AddModal from './components/AddModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { authStorage } from './utils/authStorage';
import { apiService } from './services/api';
import { colors, commonStyles } from './styles';

type TabName = 'home' | 'expenses' | 'statistics' | 'settings';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showAddModal, setShowAddModal] = useState(false);
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
      setActiveTab('home'); // Reset to home tab when logging out
    } catch (error) {
      console.error('Error clearing auth token:', error);
      setToken(null);
      setIsAuthenticated(false);
      setActiveTab('home');
    }
  };

  const handleTabPress = (tab: TabName) => {
    if (tab !== activeTab) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => setActiveTab(tab), 150);
    }
  };

  const renderActiveScreen = () => {
    const handleNavigateHome = () => handleTabPress('home');

    switch (activeTab) {
      case 'home':
        return <HomeScreen onLogout={handleLogout} />;
      case 'expenses':
        return <ExpensesScreen onLogout={handleLogout} onNavigateHome={handleNavigateHome} />;
      case 'statistics':
        return <StatisticsScreen onLogout={handleLogout} />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      default:
        return <HomeScreen onLogout={handleLogout} />;
    }
  };

  if (isLoading) {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background.primary}
        />
        <SafeAreaView style={commonStyles.screenContainer}>
          <View style={commonStyles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.primary}
      />
      <SafeAreaView style={commonStyles.screenContainer}>
        {isAuthenticated ? (
          <>
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
              {renderActiveScreen()}
            </Animated.View>
            <BottomNavigation
              activeTab={activeTab}
              onTabPress={handleTabPress}
              onAddPress={() => setShowAddModal(true)}
            />
            <AddModal
              visible={showAddModal}
              onClose={() => setShowAddModal(false)}
              onAddExpense={() => {
                setShowAddModal(false);
                console.log('Add expense pressed');
              }}
              onAddIncome={() => {
                setShowAddModal(false);
                console.log('Add income pressed');
              }}
            />
          </>
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

