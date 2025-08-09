import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

export default function PortfolioOverview() {
  const { state } = usePortfolio();
  const { portfolio } = state;
  const { colors } = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const isMarketDown = portfolio.totalGainLossPercentage < 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.marketStatus}>
        <Text style={[styles.marketStatusText, { color: colors.text }]}>
          Portfolio is {isMarketDown ? 'down' : 'up'}{' '}
          <Text style={{ color: isMarketDown ? colors.danger : colors.success }}>
            {formatPercentage(Math.abs(portfolio.totalGainLossPercentage))}
          </Text>
        </Text>
        <Text style={[styles.timeframe, { color: colors.textSecondary }]}>
          Total value: {formatCurrency(portfolio.totalValue)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  marketStatus: {
    alignItems: 'flex-start',
  },
  marketStatusText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeframe: {
    fontSize: 16,
  },
});