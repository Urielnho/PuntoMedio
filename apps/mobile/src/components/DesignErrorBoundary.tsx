import { Component, type PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

export class DesignErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.fallback}>
        <AppText variant="title">No se pudo mostrar la pantalla</AppText>
        <AppText tone="secondary">Puedes volver a intentar abrir la vista de diseño.</AppText>
        <AppButton title="Volver a intentar" onPress={() => this.setState({ failed: false })} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fallback: { flex: 1, padding: spacing.xl, justifyContent: 'center', gap: spacing.md, backgroundColor: colors.background },
});
