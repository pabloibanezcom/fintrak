import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import PortfolioOverview from '../components/PortfolioOverview';
import InvestmentList from '../components/InvestmentList';
import InvestmentTabs, { InvestmentTab } from '../components/InvestmentTabs';
import AddInvestmentForm from '../components/AddInvestmentForm';
import { Investment } from '@fintrak/shared-types';

export default function InvestmentsScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<InvestmentTab>('all');

  const handleInvestmentPress = (investment: Investment) => {
    console.log('Investment pressed:', investment.name);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.time, { color: colors.text }]}>9:41</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.searchButton]}
            onPress={() => console.log('Search pressed')}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: colors.card }]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PortfolioOverview />
      
      <View style={styles.coinsSection}>
        <View style={styles.coinsSectionHeader}>
          <Text style={[styles.coinsTitle, { color: colors.text }]}>Coins</Text>
          <TouchableOpacity style={styles.marketSelector}>
            <Text style={[styles.marketSelectorText, { color: colors.textSecondary }]}>Market- INR ▼</Text>
          </TouchableOpacity>
        </View>
        
        <InvestmentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <InvestmentList onInvestmentPress={handleInvestmentPress} />
      </View>

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddInvestmentForm onClose={() => setShowAddForm(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 18,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  coinsSection: {
    flex: 1,
  },
  coinsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  coinsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  marketSelector: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  marketSelectorText: {
    fontSize: 14,
  },
});