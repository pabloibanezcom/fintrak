import React, { useEffect, useState, memo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Alert, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import type { UserProducts } from '@fintrak/types';
import UserProfile from '../components/UserProfile';
import { componentStyles, commonStyles, colors, spacing, typography } from '../styles';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/currency';
import Button from '../components/Button';

interface InvestmentsScreenProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

type ComparisonPeriod = '1d' | '7d' | '1m' | '3m' | '1y';

interface PeriodSelectorProps {
  selectedPeriod: ComparisonPeriod;
  onPeriodSelect: (period: ComparisonPeriod) => void;
}

const PeriodSelector = memo(({ selectedPeriod, onPeriodSelect }: PeriodSelectorProps) => {
  const periods: { value: ComparisonPeriod; label: string }[] = [
    { value: '1d', label: '1D' },
    { value: '7d', label: '7D' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '1y', label: '1Y' },
  ];

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    }}>
      {periods.map((period) => {
        const isSelected = period.value === selectedPeriod;
        return (
          <TouchableOpacity
            key={period.value}
            onPress={() => onPeriodSelect(period.value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: isSelected ? colors.accent.primary : 'transparent',
              borderWidth: 1,
              borderColor: isSelected ? colors.accent.primary : colors.border.light,
              minWidth: 60,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: isSelected ? '600' : '400',
                color: isSelected ? colors.text.inverse : colors.text.secondary,
              }}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

// Helper component to display comparison change
const ComparisonBadge = ({ value, percentage }: { value: number; percentage: number }) => {
  if (value === 0 && percentage === 0) return null;

  const isPositive = value >= 0;
  const color = isPositive ? '#4CAF50' : colors.accent.error; // Green for positive, red for negative
  const sign = isPositive ? '+' : '';

  return (
    <Text style={{ color, fontSize: typography.sizes.sm, fontWeight: '600', marginTop: spacing.xs }}>
      {sign}{formatCurrency(value, 'EUR')} ({sign}{percentage}%)
    </Text>
  );
};

export default function InvestmentsScreen({ onLogout, onNavigateToProfile }: InvestmentsScreenProps) {
  const [products, setProducts] = useState<UserProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<ComparisonPeriod>('1d');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [selectedPeriod]);

  const loadProducts = async (isRefresh = false) => {
    try {
      // Only show loading spinner on initial load, not when changing periods
      if (isRefresh) {
        setRefreshing(true);
      } else if (!initialLoadDone) {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getUserProducts(selectedPeriod);

      // Animate content change when switching periods (after initial load)
      if (initialLoadDone) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }

      setProducts(response);

      if (!initialLoadDone) {
        setInitialLoadDone(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load investments';
      console.error('Error loading products:', err);
      setError(errorMessage);
      if (!isRefresh && !initialLoadDone) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadProducts(true);
  };

  if (loading) {
    return (
      <View style={componentStyles.homeContainer}>
        <View style={componentStyles.headerContainer}>
          <View style={{ width: 42 }} />
          <Text style={componentStyles.headerTitle}>Investments</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={commonStyles.loadingText}>Loading investments...</Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={componentStyles.homeContainer}>
        <View style={componentStyles.headerContainer}>
          <View style={{ width: 42 }} />
          <Text style={componentStyles.headerTitle}>Investments</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={commonStyles.errorContainer}>
          <Text style={commonStyles.errorText}>Unable to load investments</Text>
          <Text style={commonStyles.errorHint}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => loadProducts()}
            style={commonStyles.retryButton}
            size="md"
          />
        </View>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={componentStyles.homeContent}>

          {/* Portfolio Overview */}
          <View style={componentStyles.homeSection}>
            <Text style={componentStyles.homeSectionTitle}>Portfolio Overview</Text>
            <View style={componentStyles.homeCard}>
              <Text style={componentStyles.homeCardTitle}>Total Value</Text>
              <Text style={componentStyles.homeCardAmount}>
                {formatCurrency(products?.totalValue || 0, 'EUR')}
              </Text>
              {(products as any)?.comparison?.available && (
                <ComparisonBadge
                  value={(products as any).comparison.valueDifference}
                  percentage={(products as any).comparison.percentageDifference}
                />
              )}
            </View>
          </View>

          {/* Period Selector */}
          <View style={{ marginTop: spacing.md, marginBottom: spacing.xl }}>
            <PeriodSelector selectedPeriod={selectedPeriod} onPeriodSelect={setSelectedPeriod} />
          </View>

          {/* Holdings */}
          {products && (
            <View style={componentStyles.homeSection}>
              <Text style={componentStyles.homeSectionTitle}>Holdings</Text>

              {/* Bank Accounts */}
              {products.items.bankAccounts.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>Bank Accounts</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.bankAccounts.value, 'EUR')}
                  </Text>
                  {(products.items.bankAccounts as any).comparison && (
                    <ComparisonBadge
                      value={(products.items.bankAccounts as any).comparison.valueDifference}
                      percentage={(products.items.bankAccounts as any).comparison.percentageDifference}
                    />
                  )}
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.bankAccounts.percentage}% of portfolio
                  </Text>
                </View>
              )}

              {/* Deposits */}
              {products.items.deposits.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>Deposits</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.deposits.value, 'EUR')}
                  </Text>
                  {(products.items.deposits as any).comparison && (
                    <ComparisonBadge
                      value={(products.items.deposits as any).comparison.valueDifference}
                      percentage={(products.items.deposits as any).comparison.percentageDifference}
                    />
                  )}
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.deposits.percentage}% of portfolio
                  </Text>
                </View>
              )}

              {/* Indexed Funds */}
              {products.items.indexedFunds.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>Indexed Funds</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.indexedFunds.value, 'EUR')}
                  </Text>
                  {(products.items.indexedFunds as any).comparison && (
                    <ComparisonBadge
                      value={(products.items.indexedFunds as any).comparison.valueDifference}
                      percentage={(products.items.indexedFunds as any).comparison.percentageDifference}
                    />
                  )}
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.indexedFunds.percentage}% of portfolio
                  </Text>
                </View>
              )}

              {/* ETCs */}
              {products.items.etcs.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>ETCs</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.etcs.value, 'EUR')}
                  </Text>
                  {(products.items.etcs as any).comparison && (
                    <ComparisonBadge
                      value={(products.items.etcs as any).comparison.valueDifference}
                      percentage={(products.items.etcs as any).comparison.percentageDifference}
                    />
                  )}
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.etcs.percentage}% of portfolio
                  </Text>
                </View>
              )}

              {/* Crypto Assets */}
              {products.items.cryptoAssets.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>Crypto</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.cryptoAssets.value, 'EUR')}
                  </Text>
                  {(products.items.cryptoAssets as any).comparison && (
                    <ComparisonBadge
                      value={(products.items.cryptoAssets as any).comparison.valueDifference}
                      percentage={(products.items.cryptoAssets as any).comparison.percentageDifference}
                    />
                  )}
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.cryptoAssets.percentage}% of portfolio
                  </Text>
                </View>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
