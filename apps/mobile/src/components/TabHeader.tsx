import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';

export function TabHeader({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <View style={styles.row}>
      <AppText variant="title" style={styles.title}>{title}</AppText>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', maxWidth: 430, minHeight: 40, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
});
