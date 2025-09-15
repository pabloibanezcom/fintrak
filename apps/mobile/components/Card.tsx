import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'elevated',
  padding = 'base',
  style,
}: CardProps) {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  const cardStyles = [
    styles.base,
    styles[variant],
    { padding: theme.spacing[padding] },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
}

const createStyles = (theme: any) => StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.primary,
  },
  elevated: {
    ...theme.shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filled: {
    backgroundColor: theme.colors.background.secondary,
  },
});