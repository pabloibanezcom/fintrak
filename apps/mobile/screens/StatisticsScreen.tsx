import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { componentStyles } from '../styles';

interface StatisticsScreenProps {
  onLogout: () => void;
}

export default function StatisticsScreen({ onLogout }: StatisticsScreenProps) {
  return (
    <View style={componentStyles.homeContainer}>
      <ScrollView
        style={componentStyles.homeScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={componentStyles.homeContent}>
          {/* Header Section */}
          <View style={componentStyles.homeHeader}>
            <Text style={componentStyles.homeTitle}>Statistics</Text>
          </View>

          {/* Spending by Category */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Spending by Category</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Food & Dining</Text>
              <Text style={componentStyles.homeCardAmount}>€450.20</Text>
              <Text style={componentStyles.homeCardSubtext}>32% of total expenses</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Transportation</Text>
              <Text style={componentStyles.homeCardAmount}>€280.50</Text>
              <Text style={componentStyles.homeCardSubtext}>20% of total expenses</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Shopping</Text>
              <Text style={componentStyles.homeCardAmount}>€340.80</Text>
              <Text style={componentStyles.homeCardSubtext}>24% of total expenses</Text>
            </View>
          </View>

          {/* Monthly Overview */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Monthly Overview</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Average Daily Spending</Text>
              <Text style={componentStyles.homeCardAmount}>€75.90</Text>
              <Text style={componentStyles.homeCardSubtext}>Based on last 30 days</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}