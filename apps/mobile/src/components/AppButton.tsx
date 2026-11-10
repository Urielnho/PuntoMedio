import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

type Props = {
  title: string;
  onPress?: () => void;
  kind?: 'primary' | 'secondary' | 'text';
  icon?: ReactNode;
  disabled?: boolean;
  hint?: string;
  compact?: boolean;
};

export function AppButton({ title, onPress, kind = 'primary', icon, disabled = false, hint, compact = false }: Props) {
  const inactive = disabled || !onPress;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={hint}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [styles.base, compact && styles.compact, kind === 'primary' ? styles.primary : kind === 'secondary' ? styles.secondary : styles.text, pressed && !inactive && styles.pressed, inactive && styles.disabled]}
    >
      <AppText variant="label" style={{ color: kind === 'primary' ? '#FFFFFF' : colors.primary, textAlign: 'center' }}>{title}</AppText>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.md, flexDirection: 'row', gap: spacing.xs, alignItems: 'center', justifyContent: 'center' },
  compact: { minHeight: 36, paddingHorizontal: spacing.xs, paddingVertical: spacing.xxs },
  primary: { backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  text: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.46 },
});
