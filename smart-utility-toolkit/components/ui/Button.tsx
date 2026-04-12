import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, spacing } from '@/lib/design/tokens';
import { AppText } from './AppText';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const textColor =
    variant === 'primary' ? colors.textInverse : colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        size === 'sm' && styles.sm,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.75}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <AppText weight="semibold" style={{ color: textColor }}>
          {label}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});
