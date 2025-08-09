import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Income, IncomeCategory } from '@fintrak/shared-types';

interface IncomeItemProps {
  income: Income;
}

function IncomeItem({ income }: IncomeItemProps) {
  const { colors } = useTheme();

  const getCategoryColor = (category: IncomeCategory) => {
    switch (category) {
      case 'salary': return '#2ECC71';
      case 'freelance': return '#3498DB';
      case 'investment': return '#9B59B6';
      case 'business': return '#E67E22';
      case 'bonus': return '#F39C12';
      case 'other': return '#95A5A6';
      default: return '#95A5A6';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.incomeItem, { backgroundColor: colors.card }]}>
      <View style={styles.incomeHeader}>
        <View style={styles.incomeInfo}>
          <Text style={[styles.incomeTitle, { color: colors.text }]}>{income.title}</Text>
          {income.description && (
            <Text style={[styles.incomeDescription, { color: colors.textSecondary }]}>
              {income.description}
            </Text>
          )}
          {income.recurring && (
            <Text style={[styles.recurringLabel, { color: colors.primary }]}>Recurring</Text>
          )}
        </View>
        <View style={styles.incomeRight}>
          <Text style={[styles.incomeAmount, { color: colors.success }]}>
            +{formatCurrency(income.amount)}
          </Text>
          <Text style={[styles.incomeDate, { color: colors.textSecondary }]}>
            {formatDate(income.date)}
          </Text>
        </View>
      </View>
      <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(income.category) }]}>
        <Text style={styles.categoryText}>{income.category.toUpperCase()}</Text>
      </View>
    </View>
  );
}

export default function IncomesScreen() {
  const { colors } = useTheme();
  const [incomes] = useState<Income[]>([
    {
      id: '1',
      title: 'Monthly Salary',
      amount: 5000.00,
      category: 'salary',
      date: new Date(2024, 0, 1),
      recurring: true,
    },
    {
      id: '2',
      title: 'Freelance Project',
      amount: 1200.00,
      category: 'freelance',
      date: new Date(2024, 0, 10),
      description: 'Web development project',
    },
    {
      id: '3',
      title: 'Dividend Payment',
      amount: 85.50,
      category: 'investment',
      date: new Date(2024, 0, 15),
      description: 'Quarterly dividends',
    },
  ]);

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyIncome = incomes
    .filter(income => income.date.getMonth() === new Date().getMonth())
    .reduce((sum, income) => sum + income.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Income</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>This Month</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            +{formatCurrency(monthlyIncome)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Income</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            +{formatCurrency(totalIncome)}
          </Text>
        </View>
      </View>

      {incomes.length > 0 ? (
        <FlatList
          data={incomes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <IncomeItem income={item} />}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No income records yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Start tracking your income sources
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  incomeItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  incomeInfo: {
    flex: 1,
    marginRight: 12,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  recurringLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  incomeRight: {
    alignItems: 'flex-end',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeDate: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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