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
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Ionicons } from '@expo/vector-icons';
import { apiService, type PeriodSummaryResponse } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import UserProfile from '../components/UserProfile';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import { commonStyles, componentStyles, colors, spacing, typography } from '../styles';
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';
import type { Expense } from '@fintrak/types';

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
  onNavigateToTransactionDetail?: (transaction: Expense, selectedDate?: Date) => void;
  initialSelectedDate?: Date;
}

export default function MonthlySummaryScreen({
  onLogout,
  onNavigateHome,
  onNavigateToProfile,
  onNavigateToTransactionDetail,
  initialSelectedDate
}: MonthlySummaryScreenProps) {
  const [summary, setSummary] = useState<PeriodSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialSelectedDate) {
      return initialSelectedDate;
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Expense | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
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
      // Only show loading spinner on initial load, not when changing months
      if (isRefresh) {
        setRefreshing(true);
      } else if (!initialLoadDone) {
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

      // Animate content change when switching months (after initial load)
      if (initialLoadDone) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }

      setSummary(response);

      if (!initialLoadDone) {
        setInitialLoadDone(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load summary';
      console.error('Error loading summary:', err);
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
    loadSummary(true);
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, 'EUR');
  };

  const getMonthName = () => {
    return selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleViewDetails = () => {
    if (selectedTransaction && onNavigateToTransactionDetail) {
      // Pass both transaction and current selected date
      onNavigateToTransactionDetail(selectedTransaction, selectedDate);
    }
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
          <View style={{ padding: spacing.lg }}>
            {/* Current Balance */}
            <View style={{
              marginBottom: spacing.xl,
              alignItems: 'center',
            }}>
              <Text style={{
                color: colors.text.secondary,
                fontSize: 16,
                marginBottom: spacing.xs,
                fontWeight: typography.weights.regular,
              }}>
                Current Balance
              </Text>
              <Text style={{
                color: colors.text.primary,
                fontSize: 26,
                fontWeight: typography.weights.medium,
              }}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>

            {/* Expenses by Category */}
            {summary.expenses.byCategory.length > 0 && (
              <View style={{ marginBottom: spacing.lg }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.base,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: typography.weights.medium,
                    color: colors.text.secondary,
                  }}>
                    Expenses
                  </Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: typography.weights.bold,
                    color: colors.text.primary,
                  }}>
                    {formatCurrency(summary.expenses.total)}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={{
                  height: 8,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 4,
                  flexDirection: 'row',
                  overflow: 'hidden',
                  marginBottom: spacing.base,
                }}>
                  {summary.expenses.byCategory.map((category, index) => {
                    const percentage = (category.total / summary.expenses.total) * 100;
                    return (
                      <View
                        key={category.categoryId}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.categoryColor || colors.text.secondary,
                        }}
                      />
                    );
                  })}
                </View>

                {/* Category List */}
                {(showAllExpenses ? summary.expenses.byCategory : summary.expenses.byCategory.slice(0, 3)).map((category) => {
                  return (
                    <View
                      key={category.categoryId}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: spacing.sm,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: 24, alignItems: 'center', marginRight: spacing.sm }}>
                          <Ionicons
                            name={category.categoryIcon as any || 'cash-outline'}
                            size={16}
                            color={category.categoryColor || colors.text.secondary}
                          />
                        </View>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: typography.weights.regular,
                          color: colors.text.primary,
                        }}>
                          {category.categoryName}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: typography.weights.medium,
                        color: colors.text.primary,
                      }}>
                        {formatCurrency(category.total)}
                      </Text>
                    </View>
                  );
                })}

                {/* Show All Link */}
                {summary.expenses.byCategory.length > 3 && (
                  <TouchableOpacity
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setShowAllExpenses(!showAllExpenses);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: typography.weights.medium,
                      color: colors.accent.primary,
                      marginTop: spacing.xs,
                    }}>
                      {showAllExpenses ? 'Show less' : 'Show all'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Incomes by Category */}
            {summary.incomes.byCategory.length > 0 && (
              <View style={{ marginBottom: spacing.xl * 1.5 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.base,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: typography.weights.medium,
                    color: colors.text.secondary,
                  }}>
                    Incomes
                  </Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: typography.weights.bold,
                    color: colors.text.primary,
                  }}>
                    {formatCurrency(summary.incomes.total)}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={{
                  height: 8,
                  backgroundColor: colors.background.secondary,
                  borderRadius: 4,
                  flexDirection: 'row',
                  overflow: 'hidden',
                  marginBottom: spacing.base,
                }}>
                  {summary.incomes.byCategory.map((category, index) => {
                    const percentage = (category.total / summary.incomes.total) * 100;
                    return (
                      <View
                        key={category.categoryId}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category.categoryColor || colors.text.secondary,
                        }}
                      />
                    );
                  })}
                </View>

                {/* Category List */}
                {summary.incomes.byCategory.map((category) => {
                  return (
                    <View
                      key={category.categoryId}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: spacing.sm,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: 24, alignItems: 'center', marginRight: spacing.sm }}>
                          <Ionicons
                            name={category.categoryIcon as any || 'cash-outline'}
                            size={16}
                            color={category.categoryColor || colors.text.secondary}
                          />
                        </View>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: typography.weights.regular,
                          color: colors.text.primary,
                        }}>
                          {category.categoryName}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: typography.weights.medium,
                        color: colors.text.primary,
                      }}>
                        {formatCurrency(category.total)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Latest Transactions */}
            {summary.latestTransactions.length > 0 && (
              <View>
                <View style={componentStyles.sectionHeader}>
                  <Text style={[componentStyles.sectionTitle, { marginBottom: 0 }]}>
                    Latest Transactions
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: typography.weights.medium,
                      color: colors.accent.primary,
                    }}>
                      Show all
                    </Text>
                  </TouchableOpacity>
                </View>
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
                      <TouchableOpacity
                        style={componentStyles.transactionItem}
                        activeOpacity={0.7}
                        onPress={() => handleTransactionPress(transaction)}
                      >
                        <View style={componentStyles.transactionIconContainer}>
                          {hasLogo ? (
                            <Image
                              source={{ uri: transaction.payee.logo }}
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 21,
                                borderWidth: 2,
                                borderColor: transaction.category?.color || colors.text.secondary,
                              }}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{
                              width: 46,
                              height: 46,
                              borderRadius: 23,
                              borderWidth: 2,
                              borderColor: transaction.category?.color || colors.text.secondary,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                              <Text style={componentStyles.transactionIcon}>{getCategoryIcon()}</Text>
                            </View>
                          )}
                        </View>
                        <View style={componentStyles.transactionContent}>
                          <Text style={componentStyles.transactionTitle} numberOfLines={1}>
                            {transaction.title}
                          </Text>
                          <Text style={componentStyles.transactionDate}>
                            {new Date(transaction.date).getDate()} {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' })} | {transaction.category?.name || 'Uncategorized'}
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
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Transaction Detail Modal */}
      <ExpenseDetailModal
        visible={showTransactionModal}
        expense={selectedTransaction}
        onClose={() => setShowTransactionModal(false)}
        onViewDetails={handleViewDetails}
      />
    </View>
  );
}
