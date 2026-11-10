import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@puntomedio/design-tokens';
import { PreviewNotice } from './PreviewNotice';

type Props = PropsWithChildren<{ header?: ReactNode; inTab?: boolean; headerVariant?: 'surface' | 'plain' }>;

export function Screen({ children, header, inTab = false, headerVariant = 'surface' }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={inTab ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}>
      {header ? <View style={[styles.header, headerVariant === 'plain' && styles.headerPlain]}>{header}</View> : null}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, inTab && styles.tabContent]}>
          <PreviewNotice />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },
  header: { width: '100%', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerPlain: { backgroundColor: colors.background, borderBottomWidth: 0, paddingTop: spacing.md, paddingBottom: spacing.xs },
  content: { flexGrow: 1, width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.xl },
  tabContent: { paddingBottom: 112 },
});
