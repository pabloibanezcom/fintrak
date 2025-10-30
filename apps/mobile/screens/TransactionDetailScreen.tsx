import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Expense } from '@fintrak/types';
import { commonStyles, componentStyles, colors, spacing, typography } from '../styles';
import { formatExpenseAmount } from '../utils/currency';
import UserProfile from '../components/UserProfile';

interface TransactionDetailScreenProps {
  transaction: Expense;
  onBack: () => void;
  onNavigateToProfile: () => void;
}

export default function TransactionDetailScreen({
  transaction,
  onBack,
  onNavigateToProfile,
}: TransactionDetailScreenProps) {
  const getCategoryIcon = (category?: { name: string }) => {
    if (!category) return '💰';

    const categoryName = category.name.toLowerCase();
    if (categoryName.includes('grocery') || categoryName.includes('food')) return '🛒';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return '🎵';
    if (categoryName.includes('entertainment') || categoryName.includes('apple')) return '🍎';
    if (categoryName.includes('transport')) return '🚗';
    return '💰';
  };

  const getCategoryColor = (category?: { name: string; color?: string }) => {
    if (category?.color) return category.color;
    if (!category) return colors.text.secondary;

    const categoryName = category.name.toLowerCase();
    if (categoryName.includes('grocery') || categoryName.includes('food')) return '#4CAF50';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return '#9C27B0';
    if (categoryName.includes('entertainment') || categoryName.includes('apple')) return '#9C27B0';
    if (categoryName.includes('transport')) return '#2196F3';
    return '#FF9800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasLogo = transaction.payee?.logo;
  const categoryColor = getCategoryColor(transaction.category);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={componentStyles.headerContainer}>
        <TouchableOpacity style={componentStyles.headerButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={componentStyles.headerTitle}>Transaction Details</Text>
        <UserProfile onPress={onNavigateToProfile} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Transaction Header Card */}
          <View style={[styles.headerCard, { borderLeftColor: categoryColor }]}>
            <View style={styles.iconSection}>
              {hasLogo ? (
                <Image
                  source={{ uri: transaction.payee.logo }}
                  style={[styles.logoImage, { borderColor: categoryColor }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.iconCircle, { borderColor: categoryColor }]}>
                  <Text style={styles.iconEmoji}>{getCategoryIcon(transaction.category)}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <View style={styles.categoryBadge}>
                <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
                  {transaction.category?.name || 'Uncategorized'}
                </Text>
              </View>
            </View>
            <View style={styles.amountSection}>
              <Text style={styles.amount}>
                {formatExpenseAmount(transaction.amount, transaction.currency)}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Information</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(transaction.date.toString())}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{formatTime(transaction.date.toString())}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="repeat-outline" size={20} color={colors.text.secondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Periodicity</Text>
                <Text style={styles.detailValue}>{transaction.periodicity || 'One-time'}</Text>
              </View>
            </View>

            {transaction.payee && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="business-outline" size={20} color={colors.text.secondary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Payee</Text>
                  <Text style={styles.detailValue}>{transaction.payee.name}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Tags Section */}
          {transaction.tags && transaction.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {transaction.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description Section */}
          {transaction.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{transaction.description}</Text>
            </View>
          )}

          {/* Metadata Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="cash-outline" size={20} color={colors.text.secondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>{transaction.currency}</Text>
              </View>
            </View>

            {transaction.id && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="key-outline" size={20} color={colors.text.secondary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Transaction ID</Text>
                  <Text style={[styles.detailValue, styles.monoText]} numberOfLines={1}>
                    {transaction.id}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  headerCard: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  iconEmoji: {
    fontSize: 40,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  transactionTitle: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  categoryBadge: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: typography.weights.medium,
  },
  amountSection: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  section: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: typography.weights.semiBold,
    color: colors.text.secondary,
    marginBottom: spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  detailIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
    fontWeight: typography.weights.regular,
  },
  detailValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: colors.accent.primary,
    fontWeight: typography.weights.medium,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },
});
