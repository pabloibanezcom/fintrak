import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const commonStyles = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    marginTop: spacing.base,
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
  },

  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    color: colors.accent.error,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorHint: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.base,
  },

  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyHint: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
});