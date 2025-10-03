import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService, type PeriodSummaryResponse } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import UserProfile from '../components/UserProfile';
import { commonStyles, componentStyles, colors, spacing, typography } from '../styles';
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';

interface MonthSelectorProps {
  selectedDate: Date;
  onMonthSelect: (date: Date) => void;
}

const MonthSelector = memo(({ selectedDate, onMonthSelect }: MonthSelectorProps) => {
  const monthScrollRef = useRef<ScrollView>(null);

  const monthsList = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = [];

    // Show last 24 months (2 years)
    for (let i = 23; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const isFuture = monthDate > now;
      const monthYear = monthDate.getFullYear();

      // Format: "Jan" or "Jan 24" for previous years
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const label = monthYear === currentYear
        ? monthName
        : `${monthName} ${monthYear.toString().slice(-2)}`;

      months.push({
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        label,
        date: monthDate,
        isFuture,
      });
    }

    return months;
  }, []);

  useEffect(() => {
    const selectedIndex = monthsList.findIndex(
      (m) => m.date.getMonth() === selectedDate.getMonth() &&
             m.date.getFullYear() === selectedDate.getFullYear()
    );

    if (selectedIndex > -1 && monthScrollRef.current) {
      const buttonWidth = 72;
      const screenWidth = 375;
      const scrollPosition = Math.max(0, (selectedIndex * buttonWidth) - (screenWidth / 2) + (buttonWidth / 2));

      setTimeout(() => {
        monthScrollRef.current?.scrollTo({ x: scrollPosition, animated: false });
      }, 50);
    }
  }, [selectedDate, monthsList]);

  return (
    <View style={{ height: 40, marginVertical: spacing.sm, paddingHorizontal: spacing.lg }}>
      <ScrollView
        ref={monthScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        {monthsList.map((month, index) => {
          const isSelected = month.date.getMonth() === selectedDate.getMonth() &&
                            month.date.getFullYear() === selectedDate.getFullYear();
          return (
            <TouchableOpacity
              key={month.key}
              onPress={() => onMonthSelect(month.date)}
              disabled={month.isFuture}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: isSelected ? colors.accent.primary : 'transparent',
                opacity: month.isFuture ? 0.3 : 1,
                marginRight: index < monthsList.length - 1 ? 8 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: typography.weights.regular,
                  color: isSelected ? colors.text.inverse : colors.text.secondary,
                }}
              >
                {month.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if the month/year changed
  return prevProps.selectedDate.getMonth() === nextProps.selectedDate.getMonth() &&
         prevProps.selectedDate.getFullYear() === nextProps.selectedDate.getFullYear();
});

interface MonthlySummaryScreenProps {
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigateToProfile: () => void;
}

export default function MonthlySummaryScreen({
  onLogout,
  onNavigateHome,
  onNavigateToProfile
}: MonthlySummaryScreenProps) {
  const [summary, setSummary] = useState<PeriodSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const { theme } = useTheme();

  useEffect(() => {
    loadSummary();
  }, [selectedDate]);

  const getCurrentMonthDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Create dates in local timezone
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Format as YYYY-MM-DD in local timezone
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      dateFrom: formatDate(firstDay),
      dateTo: formatDate(lastDay),
    };
  };

  const goToPreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    // Don't allow going beyond current month
    if (nextMonth <= now) {
      setSelectedDate(nextMonth);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedDate.getMonth() === now.getMonth() &&
           selectedDate.getFullYear() === now.getFullYear();
  };

  const loadSummary = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const { dateFrom, dateTo } = getCurrentMonthDates();
      console.log('Fetching period summary:', { dateFrom, dateTo });

      const response = await apiService.getPeriodSummary({
        dateFrom,
        dateTo,
        latestCount: 5,
      });

      console.log('Period summary response:', response);
      setSummary(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load summary';
      console.error('Error loading summary:', err);
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
    loadSummary(true);
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, 'EUR');
  };

  const getMonthName = () => {
    return selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={commonStyles.screenContainer}>
        <View style={componentStyles.headerContainer}>
          <TouchableOpacity
            style={componentStyles.headerButton}
            onPress={onNavigateHome}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={componentStyles.headerTitle}>Summary</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} testID="activity-indicator" />
          <Text style={commonStyles.loadingText}>Loading summary...</Text>
        </View>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={commonStyles.screenContainer}>
        <View style={componentStyles.headerContainer}>
          <TouchableOpacity
            style={componentStyles.headerButton}
            onPress={onNavigateHome}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={componentStyles.headerTitle}>Monthly Summary</Text>
          <UserProfile onPress={onNavigateToProfile} />
        </View>
        <View style={commonStyles.errorContainer}>
          <Text style={commonStyles.errorText}>Unable to load summary</Text>
          <Text style={commonStyles.errorHint}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => loadSummary()}
            style={commonStyles.retryButton}
            size="md"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <View style={componentStyles.headerContainer}>
        <TouchableOpacity
          style={componentStyles.headerButton}
          onPress={onNavigateHome}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={componentStyles.headerTitle}>Summary</Text>
        <UserProfile onPress={onNavigateToProfile} />
      </View>

      {/* Month Selector */}
      <MonthSelector selectedDate={selectedDate} onMonthSelect={setSelectedDate} />

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {summary && (
          <View style={{ padding: 16 }}>
            {/* Balance Card */}
            <View style={{
              backgroundColor: summary.balance >= 0 ? '#10b981' : '#ef4444',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}>
              <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
                Balance
              </Text>
              <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>

            {/* Income & Expenses Summary */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 }}>
                <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Income</Text>
                <Text style={{ color: '#10b981', fontSize: 20, fontWeight: 'bold' }}>
                  {formatCurrency(summary.incomes.total)}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 16 }}>
                <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Expenses</Text>
                <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold' }}>
                  {formatCurrency(summary.expenses.total)}
                </Text>
              </View>
            </View>

            {/* Expenses by Category */}
            {summary.expenses.byCategory.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                  Expenses by Category
                </Text>
                {summary.expenses.byCategory.map((category) => (
                  <View
                    key={category.categoryId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      backgroundColor: 'white',
                      borderRadius: 8,
                      marginBottom: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: category.categoryColor,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {category.categoryName}
                      </Text>
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        {category.count} transaction{category.count !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>
                      {formatCurrency(category.total)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Incomes by Category */}
            {summary.incomes.byCategory.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                  Incomes by Category
                </Text>
                {summary.incomes.byCategory.map((category) => (
                  <View
                    key={category.categoryId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      backgroundColor: 'white',
                      borderRadius: 8,
                      marginBottom: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: category.categoryColor,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {category.categoryName}
                      </Text>
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        {category.count} transaction{category.count !== 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#10b981' }}>
                      {formatCurrency(category.total)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Latest Transactions */}
            {summary.latestTransactions.length > 0 && (
              <View>
                <Text style={componentStyles.sectionTitle}>
                  Latest Transactions
                </Text>
                {summary.latestTransactions.map((transaction, index) => {
                  const getCategoryColor = () => {
                    if (transaction.type === 'income') return colors.accent.primary;
                    return colors.text.secondary;
                  };

                  const getCategoryIcon = () => {
                    if (transaction.type === 'income') return '💰';
                    return '💸';
                  };

                  const hasLogo = transaction.payee?.logo;

                  return (
                    <View key={transaction._id || index} style={componentStyles.transactionItemWrapper}>
                      <View style={[componentStyles.transactionColorAccent, { backgroundColor: getCategoryColor() }]} />
                      <View style={componentStyles.transactionItem}>
                        <View style={componentStyles.transactionIconContainer}>
                          {hasLogo ? (
                            <Image
                              source={{ uri: transaction.payee.logo }}
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 21,
                              }}
                              resizeMode="cover"
                            />
                          ) : (
                            <Text style={componentStyles.transactionIcon}>{getCategoryIcon()}</Text>
                          )}
                        </View>
                        <View style={componentStyles.transactionContent}>
                          <Text style={componentStyles.transactionTitle} numberOfLines={1}>
                            {transaction.title}
                          </Text>
                          <Text style={componentStyles.transactionDate}>
                            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                        </View>
                        <Text
                          style={[
                            componentStyles.transactionAmount,
                            { color: transaction.type === 'income' ? colors.accent.primary : colors.text.primary }
                          ]}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
