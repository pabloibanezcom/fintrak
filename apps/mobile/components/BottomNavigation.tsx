import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../styles';

type TabName = 'home' | 'expenses' | 'statistics' | 'settings';

interface BottomNavigationProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onAddPress?: () => void;
}

interface TabConfig {
  name: TabName;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const tabs: TabConfig[] = [
  { name: 'home', icon: 'home-outline', label: 'Home' },
  { name: 'expenses', icon: 'wallet-outline', label: 'Expenses' },
  { name: 'statistics', icon: 'bar-chart-outline', label: 'Statistics' },
  { name: 'settings', icon: 'settings-outline', label: 'Settings' },
];

export default function BottomNavigation({ activeTab, onTabPress, onAddPress }: BottomNavigationProps) {
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View style={componentStyles.bottomNavContainer}>
      {leftTabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={componentStyles.bottomNavTab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              style={isActive ? componentStyles.bottomNavIconActive : componentStyles.bottomNavIconInactive}
            />
            <Text style={isActive ? componentStyles.bottomNavLabelActive : componentStyles.bottomNavLabel}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Add Button */}
      <TouchableOpacity
        style={componentStyles.bottomNavAddButton}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name="add"
          style={componentStyles.bottomNavAddIcon}
        />
      </TouchableOpacity>

      {rightTabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={componentStyles.bottomNavTab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              style={isActive ? componentStyles.bottomNavIconActive : componentStyles.bottomNavIconInactive}
            />
            <Text style={isActive ? componentStyles.bottomNavLabelActive : componentStyles.bottomNavLabel}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}