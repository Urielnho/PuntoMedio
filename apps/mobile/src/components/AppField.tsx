import { useState, type ReactNode } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, spacing, radii, typography } from '@puntomedio/design-tokens';
import { AppText } from './AppText';
import { useFontFamily } from '../theme/FontProvider';

type Props = TextInputProps & { label: string; icon?: ReactNode; prefix?: string; trailing?: ReactNode; help?: string; error?: string };

export function AppField({ label, icon, prefix, trailing, help, error, style, onFocus, onBlur, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const fontFamily = useFontFamily();
  return (
    <View style={styles.field}>
      <AppText variant="caption">{label}</AppText>
      <View style={[styles.inputRow, { borderColor: error ? colors.error : focused ? colors.primary : colors.border }]}>
        {icon}
        {prefix ? <AppText variant="small" weight="semibold">{prefix}</AppText> : null}
        <TextInput
          {...input}
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          onFocus={(event) => { setFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); onBlur?.(event); }}
          style={[styles.input, { fontFamily }, style]}
        />
        {trailing}
      </View>
      {error ? <AppText variant="caption" tone="error" accessibilityLiveRegion="polite">{error}</AppText> : help ? <AppText variant="caption" tone="secondary">{help}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  inputRow: { minHeight: 50, paddingHorizontal: spacing.sm, gap: spacing.sm, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radii.md, backgroundColor: colors.surface },
  input: { flex: 1, minWidth: 0, color: colors.textPrimary, ...typography.bodySmall, paddingVertical: spacing.sm },
});
