import { View, Pressable, StyleSheet } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from '../../../components/AppText';

export function SettingsRow({ title, subtitle, icon: Icon, onPress }: { title: string; subtitle?: string; icon: LucideIcon; onPress?: () => void }) {
  return <Pressable onPress={onPress} disabled={!onPress} accessibilityRole="button" accessibilityState={{ disabled: !onPress }} style={styles.row}><Icon size={21} color={colors.textSecondary} /><View style={styles.text}><AppText variant="small">{title}</AppText>{subtitle ? <AppText variant="caption" tone="secondary">{subtitle}</AppText> : null}</View><ChevronRight size={18} color={colors.textSecondary} /></Pressable>;
}

const styles = StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  text: { flex: 1, gap: spacing.xxs },
});
