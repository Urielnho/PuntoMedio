import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  metadata?: string;
  onPress?: () => void;
};

export function ListRow({ title, subtitle, metadata, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.copy}>
        <AppText variant="label">{title}</AppText>
        {subtitle ? <AppText variant="small" tone="secondary">{subtitle}</AppText> : null}
        {metadata ? <AppText variant="caption" tone="secondary">{metadata}</AppText> : null}
      </View>
      {onPress ? <ChevronRight size={18} color={colors.textSecondary} strokeWidth={1.7} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  copy: { flex: 1, gap: spacing.xxs },
  pressed: { opacity: 0.65 },
});
