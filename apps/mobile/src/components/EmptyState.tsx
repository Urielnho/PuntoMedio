import type { LucideIcon } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

export function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <View style={styles.empty}>
      <Icon size={22} color={colors.accent} strokeWidth={1.7} />
      <View style={styles.copy}>
        <AppText variant="label">{title}</AppText>
        <AppText variant="small" tone="secondary">{description}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { paddingVertical: spacing.sm, gap: spacing.sm, flexDirection: 'row', alignItems: 'flex-start' },
  copy: { flex: 1, gap: spacing.xxs },
});
