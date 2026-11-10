import { Image, Pressable, View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from '../../../components/AppText';
import { Avatar } from '../../../components/Avatar';
import { useAppNavigation } from '../../../navigation/useAppNavigation';

export function HomeHeader() {
  const navigation = useAppNavigation();
  return (
    <View style={styles.row}>
      <Image source={require('../../../../assets/puntomedio-icon.png')} style={styles.mark} accessibilityLabel="PuntoMedio" />
      <View style={styles.title}><AppText variant="title">PuntoMedio</AppText></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Notificaciones" onPress={() => navigation.navigate('Notifications')} style={styles.action}><Bell size={20} color={colors.primary} strokeWidth={1.7} /></Pressable>
      <Avatar size={36} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', maxWidth: 430, alignSelf: 'center', flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  mark: { width: 34, height: 34, borderRadius: 9 },
  title: { flex: 1 },
  action: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
