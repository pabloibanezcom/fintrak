import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import UserProfile from '../components/UserProfile';
import { componentStyles } from '../styles';

interface InvestmentsScreenProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

export default function InvestmentsScreen({ onLogout, onNavigateToProfile }: InvestmentsScreenProps) {
  return (
    <View style={componentStyles.homeContainer}>
      {/* Header with User Profile */}
      <View style={componentStyles.headerContainer}>
        <View style={{ width: 42 }} />
        <Text style={componentStyles.headerTitle}>Investments</Text>
        <UserProfile onPress={onNavigateToProfile} />
      </View>

      <ScrollView
        style={componentStyles.homeScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={componentStyles.homeContent}>

          {/* Portfolio Overview */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Portfolio Overview</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Total Value</Text>
              <Text style={componentStyles.homeCardAmount}>€25,430.50</Text>
              <Text style={componentStyles.homeCardSubtext}>+€1,234.50 (5.1%) this month</Text>
            </View>
          </View>

          {/* Holdings */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Holdings</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Stocks</Text>
              <Text style={componentStyles.homeCardAmount}>€15,200.00</Text>
              <Text style={componentStyles.homeCardSubtext}>60% of portfolio</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Bonds</Text>
              <Text style={componentStyles.homeCardAmount}>€6,100.00</Text>
              <Text style={componentStyles.homeCardSubtext}>24% of portfolio</Text>
            </View>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Crypto</Text>
              <Text style={componentStyles.homeCardAmount}>€4,130.50</Text>
              <Text style={componentStyles.homeCardSubtext}>16% of portfolio</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
