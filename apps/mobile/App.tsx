import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import InvestmentsScreen from './screens/InvestmentsScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import IncomesScreen from './screens/IncomesScreen';
import MarketScreen from './screens/MarketScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';

function AppContent() {
  const { colors } = useTheme();
  const { activeTab } = useNavigation();

  const renderScreen = () => {
    switch (activeTab) {
      case 'investments':
        return <InvestmentsScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'incomes':
        return <IncomesScreen />;
      case 'market':
        return <MarketScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <InvestmentsScreen />;
    }
  };

  return (
    <PortfolioProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {renderScreen()}
        <BottomNavigation />
      </SafeAreaView>
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
