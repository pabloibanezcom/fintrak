import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
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

export default function InvestmentsScreen({ onLogout, onNavigateToProfile }: InvestmentsScreenProps) {
  const [products, setProducts] = useState<UserProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getUserProducts();
      setProducts(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load investments';
      console.error('Error loading products:', err);
      setError(errorMessage);
      if (!isRefresh) {
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
            </View>
          </View>

          {/* Holdings */}
          {products && (
            <View style={componentStyles.homeSection}>
              <Text style={componentStyles.homeSectionTitle}>Holdings</Text>

              {/* Cash Accounts */}
              {products.items.cashAccounts.items.length > 0 && (
                <View style={componentStyles.homeCard}>
                  <Text style={componentStyles.homeCardTitle}>Cash Accounts</Text>
                  <Text style={componentStyles.homeCardAmount}>
                    {formatCurrency(products.items.cashAccounts.value, 'EUR')}
                  </Text>
                  <Text style={componentStyles.homeCardSubtext}>
                    {products.items.cashAccounts.percentage}% of portfolio
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
