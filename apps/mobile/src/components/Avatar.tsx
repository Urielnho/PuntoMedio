import { UserRound } from 'lucide-react-native';
import { Image, View } from 'react-native';
import { colors } from '@puntomedio/design-tokens';

export function Avatar({ size = 48, uri }: { size?: number; uri?: string | null }) {
  return (
    <View accessibilityLabel={uri ? 'Fotografía de perfil' : 'Fotografía de perfil pendiente'} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
      {uri ? <Image source={{ uri }} style={{ width: size, height: size }} accessibilityIgnoresInvertColors /> : <UserRound size={size * 0.46} color={colors.textSecondary} strokeWidth={1.7} />}
    </View>
  );
}
