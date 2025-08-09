import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { Investment } from '@fintrak/shared-types';

interface InvestmentItemProps {
  investment: Investment;
  onPress: (investment: Investment) => void;
}

function InvestmentItem({ investment, onPress }: InvestmentItemProps) {
  const { colors } = useTheme();
  const currentValue = investment.currentPrice * investment.quantity;
  const costBasis = investment.purchasePrice * investment.quantity;
  const gainLoss = currentValue - costBasis;
  const gainLossPercentage = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto': return '₿';
      case 'index_fund': return '📊';
      case 'stock': return '📈';
      case 'etf': return '🏦';
      default: return '💼';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crypto': return '#F7931A';
      case 'index_fund': return '#007AFF';
      case 'stock': return '#34C759';
      case 'etf': return '#AF52DE';
      default: return '#8E8E93';
    }
  };

  return (
    <TouchableOpacity style={[styles.investmentItem, { backgroundColor: colors.card }]} onPress={() => onPress(investment)}>
      <View style={styles.coinRow}>
        <View style={styles.leftSection}>
          <View style={[styles.coinIcon, { backgroundColor: getTypeColor(investment.type) }]}>
            <Text style={styles.coinIconText}>{getTypeIcon(investment.type)}</Text>
          </View>
          <View style={styles.coinInfo}>
            <Text style={[styles.coinName, { color: colors.text }]}>{investment.name}</Text>
            <Text style={[styles.coinSymbol, { color: colors.textSecondary }]}>{investment.symbol.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.centerSection}>
          <View style={styles.miniChart}>
            <Text style={styles.chartPlaceholder}>{'▂▃▅▂▄▃▅▄'}</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={[styles.coinPrice, { color: colors.text }]}>{formatCurrency(investment.currentPrice)}</Text>
          <Text style={[
            styles.coinChange,
            { color: gainLoss >= 0 ? colors.success : colors.danger }
          ]}>
            {formatPercentage(gainLossPercentage)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface InvestmentListProps {
  onInvestmentPress: (investment: Investment) => void;
}

export default function InvestmentList({ onInvestmentPress }: InvestmentListProps) {
  const { state } = usePortfolio();
  const { portfolio } = state;
  const { colors } = useTheme();

  if (portfolio.investments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No investments yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Add your first investment to get started</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={portfolio.investments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <InvestmentItem investment={item} onPress={onInvestmentPress} />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  investmentItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinIconText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  coinInfo: {
    flex: 1,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  coinSymbol: {
    fontSize: 14,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  miniChart: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: 16,
    color: '#00D09C',
    letterSpacing: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  coinPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  coinChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});