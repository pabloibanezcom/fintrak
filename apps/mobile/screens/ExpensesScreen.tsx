import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Expense } from '@fintrak/types';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import TransactionList from '../components/TransactionList';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import { commonStyles, componentStyles, colors } from '../styles';

interface ExpensesScreenProps {
  onLogout?: () => void;
  onNavigateHome?: () => void;
}

export default function ExpensesScreen({ onLogout, onNavigateHome }: ExpensesScreenProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await apiService.getExpenses({
        limit: 50,
        sortBy: 'date',
        sortOrder: 'desc',
      });
      setExpenses(response.expenses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load expenses';
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
    loadExpenses(true);
  };


  const handleTransactionPress = (transaction: Expense) => {
    setSelectedExpense(transaction);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedExpense(null);
  };



  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} testID="activity-indicator" />
        <Text style={commonStyles.loadingText}>Loading expenses...</Text>
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
          <Text style={componentStyles.headerTitle}>Expenses</Text>
          <View style={componentStyles.headerButton} />
        </View>
        <View style={commonStyles.errorContainer}>
          <Text style={commonStyles.errorText}>Unable to load expenses</Text>
          <Text style={commonStyles.errorHint}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => loadExpenses()}
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
        <Text style={componentStyles.headerTitle}>Expenses</Text>
        <View style={componentStyles.headerButton} />
      </View>

      <TransactionList
        transactions={expenses}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onTransactionPress={handleTransactionPress}
      />

      <ExpenseDetailModal
        visible={showDetailModal}
        expense={selectedExpense}
        onClose={handleCloseDetailModal}
      />
    </View>
  );
}

