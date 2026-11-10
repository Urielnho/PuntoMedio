import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, radii, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

export function ChoiceRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.control, selected && styles.controlSelected]}>{selected ? <Check size={14} color="#FFFFFF" strokeWidth={2.4} /> : null}</View>
      <AppText variant="small" style={styles.label}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  control: { width: 22, height: 22, borderRadius: radii.full, borderWidth: 1, borderColor: colors.outlineStrong, alignItems: 'center', justifyContent: 'center' },
  controlSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { flex: 1 },
  pressed: { opacity: 0.65 },
});
