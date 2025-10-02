import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, ActivityIndicator, View, Animated } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import MonthlySummaryScreen from './screens/MonthlySummaryScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';
import BottomNavigation from './components/BottomNavigation';
import AddModal from './components/AddModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { authStorage } from './utils/authStorage';
import { apiService } from './services/api';
import { colors, commonStyles } from './styles';

type TabName = 'home' | 'expenses' | 'statistics' | 'settings';
type ScreenName = TabName | 'profile';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(1000));
  const [editFadeAnim] = useState(new Animated.Value(0));
  const [showAddModal, setShowAddModal] = useState(false);
  const { theme, isDark } = useTheme();
  const { fetchUser, clearUser } = useUser();

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
        // Fetch user data after setting token
        await fetchUser();
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
      apiService.setToken(authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      // Fetch user data after login
      await fetchUser();
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
      clearUser();
      setToken(null);
      setIsAuthenticated(false);
      setActiveTab('home'); // Reset to home tab when logging out
    } catch (error) {
      console.error('Error clearing auth token:', error);
      clearUser();
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

      setTimeout(() => {
        setActiveTab(tab);
        setCurrentScreen(tab);
      }, 150);
    }
  };

  const handleNavigateToProfile = () => {
    // Slide up animation
    slideAnim.setValue(1000);
    setShowProfile(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const handleBackFromProfile = () => {
    // Slide down animation
    setShowProfile(false);
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigateToEditProfile = () => {
    // Fade in animation for edit profile
    setShowEditProfile(true);
    Animated.timing(editFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBackFromEditProfile = () => {
    // Fade out animation
    Animated.timing(editFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowEditProfile(false);
    });
  };

  const handleSaveProfile = async (userData: { name: string; lastName: string; email: string }) => {
    try {
      await apiService.updateUserProfile(userData);
      await fetchUser(); // Refresh user data
      handleBackFromEditProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      // TODO: Show error message to user
    }
  };

  const renderActiveScreen = () => {
    const handleNavigateHome = () => handleTabPress('home');

    switch (activeTab) {
      case 'home':
        return <HomeScreen onLogout={handleLogout} onNavigateToProfile={handleNavigateToProfile} />;
      case 'expenses':
        return <MonthlySummaryScreen onLogout={handleLogout} onNavigateHome={handleNavigateHome} onNavigateToProfile={handleNavigateToProfile} />;
      case 'statistics':
        return <StatisticsScreen onLogout={handleLogout} onNavigateToProfile={handleNavigateToProfile} />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} onNavigateToProfile={handleNavigateToProfile} />;
      default:
        return <HomeScreen onLogout={handleLogout} onNavigateToProfile={handleNavigateToProfile} />;
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

            <Animated.View
              pointerEvents={showProfile ? 'auto' : 'none'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: [{ translateY: slideAnim }]
              }}
            >
              <ProfileScreen
                onLogout={handleLogout}
                onBack={handleBackFromProfile}
                onEditProfile={handleNavigateToEditProfile}
              />
            </Animated.View>

            {showEditProfile && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: editFadeAnim,
                }}
              >
                <EditProfileScreen
                  onBack={handleBackFromEditProfile}
                  onSave={handleSaveProfile}
                />
              </Animated.View>
            )}

            {!showProfile && !showEditProfile && (
              <BottomNavigation
                activeTab={activeTab}
                onTabPress={handleTabPress}
                onAddPress={() => setShowAddModal(true)}
              />
            )}
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
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

