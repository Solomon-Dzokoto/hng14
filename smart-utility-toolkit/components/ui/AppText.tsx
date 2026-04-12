import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { colors, typography } from '@/lib/design/tokens';

type ColorKey = keyof typeof colors;

export interface AppTextProps extends RNTextProps {
  variant?: keyof typeof typography.sizes;
  weight?: keyof typeof typography.weights;
  color?: ColorKey;
  align?: 'auto' | 'left' | 'right' | 'center';
}

export function AppText({
  style,
  variant = 'md',
  weight = 'regular',
  color = 'text',
  align,
  ...props
}: AppTextProps) {
  return (
    <RNText
      style={[
        {
          fontSize: typography.sizes[variant],
          fontWeight: typography.weights[weight],
          color: colors[color],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    />
  );
}
