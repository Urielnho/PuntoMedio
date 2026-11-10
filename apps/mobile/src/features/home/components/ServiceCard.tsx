import { Pressable, View, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@puntomedio/design-tokens';
import { AppText } from '../../../components/AppText';

type Props = { kind: 'meeting' | 'job'; onPress?: () => void; compact?: boolean };

export function ServiceCard({ kind, onPress, compact = false }: Props) {
  const meeting = kind === 'meeting';
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={meeting ? 'Encontrar un punto medio para reunirme con alguien' : 'Pedir una recogida y entrega'} onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.action, meeting ? styles.primary : styles.secondary, pressed && styles.pressed]}>
      <View style={styles.content}>
        <AppText variant={compact ? 'label' : 'title'} style={meeting && styles.onPrimary}>{meeting ? 'Encontrar punto medio' : 'Pedir una recogida'}</AppText>
        {!compact ? <AppText variant="small" style={meeting ? styles.onPrimaryMuted : styles.secondaryText}>{meeting ? 'Elige un lugar conveniente para ambos.' : 'Alguien recoge y entrega por ti.'}</AppText> : null}
      </View>
      <ArrowRight size={18} color={meeting ? '#FFFFFF' : colors.primary} strokeWidth={1.8} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: { minHeight: 76, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8 },
  content: { flex: 1, gap: spacing.xxs },
  onPrimary: { color: '#FFFFFF' },
  onPrimaryMuted: { color: '#DAD6E8' },
  secondaryText: { color: colors.textSecondary },
});
