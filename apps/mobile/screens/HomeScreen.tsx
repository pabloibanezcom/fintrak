import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { componentStyles } from '../styles';

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  return (
    <View style={componentStyles.homeContainer}>
      <ScrollView
        style={componentStyles.homeScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={componentStyles.homeContent}>
          {/* Header Section */}
          <View style={componentStyles.homeHeader}>
            <Text style={componentStyles.homeGreeting}>Good morning</Text>
            <Text style={componentStyles.homeTitle}>Welcome back!</Text>
          </View>

          {/* Balance Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Total Balance</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Current Balance</Text>
              <Text style={componentStyles.homeCardAmount}>€2,847.50</Text>
              <Text style={componentStyles.homeCardSubtext}>+€127.30 this month</Text>
            </View>
          </View>

          {/* Quick Stats Section */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>This Month</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Income</Text>
              <Text style={componentStyles.homeCardAmount}>€3,200.00</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Expenses</Text>
              <Text style={componentStyles.homeCardAmount}>€2,352.70</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}