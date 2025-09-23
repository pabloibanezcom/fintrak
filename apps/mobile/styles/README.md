# Centralized Styles

This directory contains all centralized styles for the mobile app to ensure consistent design and easier maintenance.

## Structure

- **`colors.ts`** - App color palette matching Figma design
- **`typography.ts`** - Font sizes and weights
- **`spacing.ts`** - Consistent spacing values
- **`common.ts`** - Common screen-level styles (containers, loading, error, empty states)
- **`components.ts`** - Reusable component styles (headers, lists, transactions, etc.)
- **`index.ts`** - Central export file

## Usage

```tsx
import { commonStyles, componentStyles, colors, typography, spacing } from '../styles';

// Use predefined styles
<View style={commonStyles.screenContainer}>
  <View style={componentStyles.headerContainer}>
    <Text style={componentStyles.headerTitle}>Title</Text>
  </View>
</View>

// Use design tokens for custom styles
const customStyles = StyleSheet.create({
  customElement: {
    backgroundColor: colors.background.secondary,
    fontSize: typography.sizes.lg,
    padding: spacing.base,
  },
});
```

## Benefits

- **Consistency**: All components use the same design system
- **Maintainability**: Style changes happen in one place
- **DRY**: No duplicate styles across screens
- **Type Safety**: Exported constants are typed
- **Performance**: Styles are created once and reused

## Guidelines

- Always use centralized styles when available
- Keep screen-specific styles minimal
- Use design tokens (colors, typography, spacing) for custom styles
- Add new common patterns to the centralized files