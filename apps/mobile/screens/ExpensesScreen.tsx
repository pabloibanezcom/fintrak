import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useExpenses } from '../context/ExpenseContext';
import { Expense, ExpenseCategory } from '@fintrak/types';
import AddExpenseForm from '../components/AddExpenseForm';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const { colors } = useTheme();

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case 'food': return '#FF6B6B';
      case 'transport': return '#4ECDC4';
      case 'entertainment': return '#45B7D1';
      case 'utilities': return '#96CEB4';
      case 'shopping': return '#FFEAA7';
      case 'healthcare': return '#DDA0DD';
      case 'other': return '#95A3B3';
      default: return '#95A3B3';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.expenseItem, { backgroundColor: colors.card }]}
      onLongPress={handleDelete}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={[styles.expenseTitle, { color: colors.text }]}>{expense.title}</Text>
          {expense.description && (
            <Text style={[styles.expenseDescription, { color: colors.textSecondary }]}>
              {expense.description}
            </Text>
          )}
        </View>
        <View style={styles.expenseRight}>
          <Text style={[styles.expenseAmount, { color: colors.danger }]}>
            -{formatCurrency(expense.amount)}
          </Text>
          <Text style={[styles.expenseDate, { color: colors.textSecondary }]}>
            {formatDate(expense.date)}
          </Text>
        </View>
      </View>
      <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(expense.category) }]}>
        <Text style={styles.categoryText}>{expense.category.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExpensesScreen() {
  const { colors } = useTheme();
  const { state, fetchExpenses, deleteExpense } = useExpenses();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d;
  };

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = state.expenses
    .filter(expense => formatDate(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Expenses</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>This Month</Text>
          <Text style={[styles.summaryValue, { color: colors.danger }]}>
            -{formatCurrency(monthlyExpenses)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Expenses</Text>
          <Text style={[styles.summaryValue, { color: colors.danger }]}>
            -{formatCurrency(totalExpenses)}
          </Text>
        </View>
      </View>

      {state.loading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Loading...</Text>
        </View>
      ) : state.error ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.danger }]}>Error</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {state.error}
          </Text>
        </View>
      ) : state.expenses.length > 0 ? (
        <FlatList
          data={state.expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItem expense={item} onDelete={handleDeleteExpense} />}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No expenses yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Start tracking your expenses
          </Text>
        </View>
      )}

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddForm(false)}
      >
        <AddExpenseForm onClose={() => setShowAddForm(false)} />
      </Modal>
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
  expenseItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 12,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDate: {
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