import React from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import type { Expense } from '@fintrak/types';
import { useTheme } from '../context/ThemeContext';
import { commonStyles, componentStyles } from '../styles';
import { formatExpenseAmount } from '../utils/currency';

interface TransactionListProps {
  transactions: Expense[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onTransactionPress?: (transaction: Expense) => void;
}

interface WeekSection {
  title: string;
  data: Expense[];
}

export default function TransactionList({
  transactions,
  onRefresh,
  refreshing = false,
  onTransactionPress,
}: TransactionListProps) {
  const { theme } = useTheme();

  const getWeekRange = (date: Date) => {
    // Create a new date and ensure we're working with local time
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const startOfWeek = new Date(localDate);
    const day = startOfWeek.getDay(); // Sunday = 0, Monday = 1, etc.

    // Calculate days to subtract to get to Sunday (start of week)
    const daysToSubtract = day;
    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { start: startOfWeek, end: endOfWeek };
  };

  const formatDateRange = (start: Date, end: Date) => {
    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('en-US', formatOptions)} to ${end.toLocaleDateString('en-US', formatOptions)}`;
  };

  const getWeekTitle = (weekStart: Date) => {
    const now = new Date();
    const currentWeekRange = getWeekRange(now);
    const weekRange = getWeekRange(weekStart);

    const weeksDiff = Math.floor((currentWeekRange.start.getTime() - weekRange.start.getTime()) / (7 * 24 * 60 * 60 * 1000));

    if (weeksDiff === 0) {
      return `This Week (${formatDateRange(weekRange.start, weekRange.end)})`;
    } else if (weeksDiff === 1) {
      return `Last Week (${formatDateRange(weekRange.start, weekRange.end)})`;
    } else if (weeksDiff > 1) {
      return `${weeksDiff} weeks ago (${formatDateRange(weekRange.start, weekRange.end)})`;
    } else {
      // Future weeks
      return `${formatDateRange(weekRange.start, weekRange.end)}`;
    }
  };

  const groupTransactionsByWeek = (transactions: Expense[]): WeekSection[] => {
    const groups: { [key: string]: Expense[] } = {};

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const weekRange = getWeekRange(transactionDate);
      const weekKey = `${weekRange.start.getFullYear()}-${String(weekRange.start.getMonth() + 1).padStart(2, '0')}-${String(weekRange.start.getDate()).padStart(2, '0')}`;

      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(transaction);
    });

    // Convert to sections and sort by week (newest first)
    const sections = Object.entries(groups)
      .map(([weekKey, data]) => ({
        title: getWeekTitle(new Date(weekKey)),
        data: data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      }))
      .sort((a, b) => {
        // Extract week start dates for comparison
        const aDate = new Date(Object.keys(groups).find(key => getWeekTitle(new Date(key)) === a.title) || '');
        const bDate = new Date(Object.keys(groups).find(key => getWeekTitle(new Date(key)) === b.title) || '');
        return bDate.getTime() - aDate.getTime();
      });

    return sections;
  };

  const sections = groupTransactionsByWeek(transactions);


  const getCategoryIcon = (category?: { name: string }) => {
    if (!category) return '💰';

    const categoryName = category.name.toLowerCase();
    if (categoryName.includes('grocery') || categoryName.includes('food')) return '🛒';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return '🎵';
    if (categoryName.includes('entertainment') || categoryName.includes('apple')) return '🍎';
    if (categoryName.includes('transport')) return '🚗';
    return '💰';
  };

  const getCategoryColor = (category?: { name: string }) => {
    if (!category) return '#7E848D';

    const categoryName = category.name.toLowerCase();

    // Food/Grocery - English and Spanish
    if (categoryName.includes('grocery') || categoryName.includes('food') ||
        categoryName.includes('supermercado') || categoryName.includes('comida') ||
        categoryName.includes('alimentación')) return '#4CAF50';

    // Music/Entertainment - English and Spanish
    if (categoryName.includes('music') || categoryName.includes('spotify') ||
        categoryName.includes('entertainment') || categoryName.includes('entretenimiento') ||
        categoryName.includes('apple') || categoryName.includes('música')) return '#9C27B0';

    // Transport - English and Spanish
    if (categoryName.includes('transport') || categoryName.includes('transporte') ||
        categoryName.includes('gasolina') || categoryName.includes('combustible')) return '#2196F3';

    // Others/General - default
    if (categoryName.includes('otros') || categoryName.includes('general')) return '#7E848D';

    return '#FF9800'; // Default orange for any other category
  };

  const renderTransactionItem = ({ item }: { item: Expense }) => {
    // Determine if this is an expense (negative amount)
    const isExpense = item.amount < 0 || true; // In expenses list, all items are expenses
    const hasLogo = item.payee?.logo;

    return (
      <View style={componentStyles.transactionItemWrapper}>
        <View style={[componentStyles.transactionColorAccent, { backgroundColor: getCategoryColor(item.category) }]} />
        <TouchableOpacity
          style={componentStyles.transactionItem}
          activeOpacity={0.7}
          onPress={() => onTransactionPress?.(item)}
        >
          <View style={componentStyles.transactionIconContainer}>
            {hasLogo ? (
              <Image
                source={{ uri: item.payee.logo }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                }}
                resizeMode="cover"
              />
            ) : (
              <Text style={componentStyles.transactionIcon}>{getCategoryIcon(item.category)}</Text>
            )}
          </View>
        <View style={componentStyles.transactionContent}>
          <Text
            style={componentStyles.transactionTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <View style={componentStyles.transactionSubtitle}>
            <Text style={componentStyles.transactionDate}>
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <Text style={componentStyles.transactionCategorySeparator}> • </Text>
            <Text style={componentStyles.transactionCategoryName}>
              {item.category?.name || 'General'}
            </Text>
          </View>
        </View>
        <Text style={isExpense ? componentStyles.transactionAmountExpense : componentStyles.transactionAmount}>
          {formatExpenseAmount(item.amount, item.currency)}
        </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: WeekSection }) => (
    <View style={componentStyles.sectionHeader}>
      <Text style={componentStyles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (transactions.length === 0) {
    return (
      <View style={commonStyles.emptyContainer}>
        <Text style={commonStyles.emptyText}>No transactions found</Text>
        <Text style={commonStyles.emptyHint}>Your transactions will appear here once you add them</Text>
      </View>
    );
  }

  return (
    <View style={componentStyles.listContainer}>
      <SectionList
        sections={sections}
        renderItem={renderTransactionItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: Expense) => item.id}
        style={{flex: 1}}
        contentContainerStyle={componentStyles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary[500]]}
              tintColor={theme.colors.primary[500]}
            />
          ) : undefined
        }
      />
    </View>
  );
}

