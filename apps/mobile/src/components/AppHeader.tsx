import type { ReactNode } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

type Props = { title: string; onBack?: () => void; trailing?: ReactNode; step?: string };

export function AppHeader({ title, onBack, trailing, step }: Props) {
  return (
    <View style={styles.row}>
      {onBack ? <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Volver" style={styles.back}><ArrowLeft size={20} color={colors.primary} /></Pressable> : null}
      <View style={styles.title}>
        <AppText variant="label">{title}</AppText>
        {step ? <AppText variant="caption" tone="secondary">{step}</AppText> : null}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', maxWidth: 430, alignSelf: 'center' },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, gap: spacing.xxs },
});
