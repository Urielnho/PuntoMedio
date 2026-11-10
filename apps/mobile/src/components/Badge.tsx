import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'accent' | 'warning' | 'success' | 'error' }) {
  const color = tone === 'accent' ? colors.accent : tone === 'warning' ? colors.warning : tone === 'success' ? colors.success : tone === 'error' ? colors.error : colors.textSecondary;
  return <View style={styles.badge}><View style={[styles.dot, { backgroundColor: color }]} /><AppText variant="caption" style={{ color }}>{label}</AppText></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
