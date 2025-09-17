import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function Input({
  label,
  error,
  hint,
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const styles = createStyles(theme);

  const inputStyles = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    textInputProps.editable === false && styles.inputDisabled,
    inputStyle,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={inputStyles}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        placeholderTextColor={theme.colors.text.disabled}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.base,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  labelError: {
    color: theme.colors.error[500],
  },
  input: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
    textAlignVertical: 'center',
  },
  inputFocused: {
    borderColor: theme.colors.primary[500],
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.error[500],
  },
  inputDisabled: {
    backgroundColor: theme.colors.background.tertiary,
    color: theme.colors.text.disabled,
    opacity: 0.6,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error[500],
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  hintText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});