import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Expense } from '@fintrak/types';
import { componentStyles } from '../styles';
import { formatExpenseAmount } from '../utils/currency';

interface ExpenseDetailModalProps {
  visible: boolean;
  expense: Expense | null;
  onClose: () => void;
}

export default function ExpenseDetailModal({ visible, expense, onClose }: ExpenseDetailModalProps) {
  if (!expense) return null;

  const getCategoryIcon = (category?: { name: string }) => {
    if (!category) return '💰';

    const categoryName = category.name.toLowerCase();
    if (categoryName.includes('grocery') || categoryName.includes('food')) return '🛒';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return '🎵';
    if (categoryName.includes('entertainment') || categoryName.includes('apple')) return '🍎';
    if (categoryName.includes('transport')) return '🚗';
    return '💰';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={componentStyles.modalOverlay} onPress={onClose}>
        <View style={componentStyles.expenseDetailModalContainer}>
          <Pressable onPress={() => {}}>
            {/* Modal Header */}
            <View style={componentStyles.modalHeader}>
              <Text style={componentStyles.modalTitle}>Expense Details</Text>
              <TouchableOpacity onPress={onClose} style={componentStyles.modalCloseButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView style={componentStyles.expenseDetailContent}>
              {/* Main Info */}
              <View style={componentStyles.expenseDetailMainInfo}>
                <View style={componentStyles.expenseDetailIconContainer}>
                  <Text style={componentStyles.expenseDetailIcon}>{getCategoryIcon(expense.category)}</Text>
                </View>
                <View style={componentStyles.expenseDetailTitleSection}>
                  <Text style={componentStyles.expenseDetailTitle}>{expense.title}</Text>
                  <Text style={componentStyles.expenseDetailAmount}>
                    {formatExpenseAmount(expense.amount, expense.currency)}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View style={componentStyles.expenseDetailSection}>
                <View style={componentStyles.expenseDetailRow}>
                  <Text style={componentStyles.expenseDetailLabel}>Category</Text>
                  <Text style={componentStyles.expenseDetailValue}>
                    {expense.category?.name || 'General'}
                  </Text>
                </View>

                <View style={componentStyles.expenseDetailRow}>
                  <Text style={componentStyles.expenseDetailLabel}>Date</Text>
                  <Text style={componentStyles.expenseDetailValue}>
                    {formatDate(expense.date.toString())}
                  </Text>
                </View>

                <View style={componentStyles.expenseDetailRow}>
                  <Text style={componentStyles.expenseDetailLabel}>Tags</Text>
                  <Text style={componentStyles.expenseDetailValue}>
                    {expense.tags && expense.tags.length > 0 ? expense.tags.join(', ') : 'None'}
                  </Text>
                </View>

                <View style={componentStyles.expenseDetailRow}>
                  <Text style={componentStyles.expenseDetailLabel}>Periodicity</Text>
                  <Text style={componentStyles.expenseDetailValue}>
                    {expense.periodicity || 'One-time'}
                  </Text>
                </View>

                {expense.description && (
                  <View style={componentStyles.expenseDetailRow}>
                    <Text style={componentStyles.expenseDetailLabel}>Description</Text>
                    <Text style={componentStyles.expenseDetailValue}>
                      {expense.description}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}