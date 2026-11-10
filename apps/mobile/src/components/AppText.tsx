import type { ReactNode } from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, typography } from '@puntomedio/design-tokens';
import { useFontFamily, type FontWeight } from '../theme/FontProvider';

const variants = {
  display: { ...typography.display, weight: 'bold' },
  heading: { ...typography.displayMobile, weight: 'bold' },
  headline: { ...typography.headline, weight: 'semibold' },
  title: { ...typography.section, weight: 'semibold' },
  body: { ...typography.body, weight: 'regular' },
  small: { ...typography.bodySmall, weight: 'regular' },
  label: { ...typography.label, weight: 'semibold' },
  caption: { ...typography.caption, weight: 'medium' },
} as const;

type Props = TextProps & {
  children: ReactNode;
  variant?: keyof typeof variants;
  tone?: 'primary' | 'secondary' | 'accent' | 'error' | 'success';
  weight?: FontWeight;
  align?: TextStyle['textAlign'];
};

export function AppText({ children, variant = 'body', tone = 'primary', weight, align, style, ...rest }: Props) {
  const token = variants[variant];
  const fontFamily = useFontFamily(weight ?? token.weight);
  const color = { primary: colors.textPrimary, secondary: colors.textSecondary, accent: colors.accent, error: colors.error, success: colors.success }[tone];
  return (
    <Text {...rest} style={[{ fontSize: token.fontSize, lineHeight: token.lineHeight, fontFamily, color, ...(align ? { textAlign: align } : {}) }, style]}>
      {children}
    </Text>
  );
}
