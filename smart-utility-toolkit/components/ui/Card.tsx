import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing } from '@/lib/design/tokens';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outline' | 'ghost';
}

export function Card({ style, variant = 'elevated', ...props }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  elevated: {
    ...shadows.sm,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});
