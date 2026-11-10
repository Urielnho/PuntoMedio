import { Info } from 'lucide-react-native';
import { View } from 'react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from './AppText';
import { useAuth } from '../hooks/useAuth';

export function PreviewNotice() {
  const { integration } = useAuth();
  if (integration === 'ready') return null;
  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' }} accessibilityRole="text">
      <Info size={15} color={colors.accent} />
      <AppText variant="caption" tone="secondary" style={{ flex: 1 }}>
        {integration === 'invalid' ? 'No pudimos conectar con el servicio. Inténtalo más tarde.' : 'El servicio no está disponible en este momento.'}
      </AppText>
    </View>
  );
}
