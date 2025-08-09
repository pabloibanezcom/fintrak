import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type InvestmentTab = 'all' | 'gainer' | 'loser' | 'favourites';

interface InvestmentTabsProps {
  activeTab: InvestmentTab;
  onTabChange: (tab: InvestmentTab) => void;
}

const tabs: { id: InvestmentTab; title: string }[] = [
  { id: 'all', title: 'All' },
  { id: 'gainer', title: 'Gainer' },
  { id: 'loser', title: 'Loser' },
  { id: 'favourites', title: 'Favourites' },
];

export default function InvestmentTabs({ activeTab, onTabChange }: InvestmentTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && { borderBottomColor: colors.primary }
              ]}
              onPress={() => onTabChange(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginRight: 32,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
  },
});