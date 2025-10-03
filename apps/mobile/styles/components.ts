import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";

export const componentStyles = StyleSheet.create({
  // Header styles
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base, // SafeAreaView handles status bar
    paddingBottom: spacing.base,
    backgroundColor: colors.background.primary,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    textAlign: "center",
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonIcon: {
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },

  // Section header styles
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.accent.primary,
  },

  // Transaction list styles
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },

  // Transaction item styles
  transactionItemWrapper: {
    flexDirection: "row",
    marginBottom: spacing.base,
  },
  transactionColorAccent: {
    width: 8,
    backgroundColor: colors.text.secondary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  transactionItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  transactionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  transactionIcon: {
    fontSize: spacing.base,
  },
  transactionContent: {
    flex: 1,
    marginRight: spacing.base,
  },
  transactionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionSubtitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  transactionCategorySeparator: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  transactionCategoryName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  transactionCategory: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  transactionAmount: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    minWidth: 80,
    textAlign: "right",
  },
  transactionAmountExpense: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.expense,
    minWidth: 80,
    textAlign: "right",
  },

  // Login screen styles
  loginContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loginScrollView: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loginContentContainer: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: colors.background.primary,
    minHeight: "100%",
  },
  loginBackButton: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    zIndex: 1,
  },
  loginBackButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: 50,
    textAlign: "left",
  },
  loginInputContainer: {
    marginBottom: 30,
  },
  loginInputLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  loginInputContainerOverride: {
    marginBottom: 0,
  },
  loginCustomInput: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    backgroundColor: "transparent",
    paddingVertical: spacing.sm,
  },
  loginSignInButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    paddingVertical: spacing.base,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    width: "100%",
  },
  loginSignInButtonDisabled: {
    opacity: 0.5,
  },
  loginSignInButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  loginDividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  loginDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  loginDividerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginHorizontal: 16,
  },
  loginGoogleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    paddingVertical: spacing.base,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  loginGoogleIcon: {
    marginRight: 12,
  },
  loginGoogleButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },

  // Bottom navigation styles
  bottomNavContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.secondary,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base, // Reduced padding for safe area
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  bottomNavIconActive: {
    fontSize: 20,
    marginBottom: 2,
    color: colors.accent.primary,
  },
  bottomNavIconInactive: {
    fontSize: 20,
    marginBottom: 2,
    color: colors.text.secondary,
  },
  bottomNavLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  bottomNavLabelActive: {
    fontSize: 10,
    color: colors.accent.primary,
    fontWeight: typography.weights.medium,
  },
  bottomNavAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24, // Center of button at top border level
    marginHorizontal: spacing.sm,
  },
  bottomNavAddIcon: {
    fontSize: 24,
    color: colors.text.primary,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.base,
  },
  modalButtonIconContainer: {
    marginRight: spacing.base,
  },
  modalButtonContent: {
    flex: 1,
  },
  modalButtonTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  modalButtonSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },

  // Expense Detail Modal styles
  expenseDetailModalContainer: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: spacing.xl,
    maxHeight: "80%",
  },
  expenseDetailContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
  },
  expenseDetailMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  expenseDetailIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.background.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.base,
  },
  expenseDetailIcon: {
    fontSize: 32,
  },
  expenseDetailTitleSection: {
    flex: 1,
  },
  expenseDetailTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  expenseDetailAmount: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semiBold,
    color: colors.text.expense,
  },
  expenseDetailSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
  },
  expenseDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  expenseDetailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  expenseDetailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    flex: 2,
    textAlign: "right",
  },

  // Home screen styles
  homeContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingBottom: 70, // Reduced space for smaller bottom navigation
  },
  homeScrollView: {
    flex: 1,
  },
  homeContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  homeHeader: {
    marginBottom: spacing.xl,
  },
  homeGreeting: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeSubtext: {
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    letterSpacing: -0.18,
  },
  homeSection: {
    marginBottom: spacing.xl,
  },
  homeSectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.base,
  },
  homeCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.base,
  },
  homeCardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  homeCardAmount: {
    fontSize: 24,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  homeCardSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
