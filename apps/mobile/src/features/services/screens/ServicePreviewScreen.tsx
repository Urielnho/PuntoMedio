import { View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppText } from '../../../components/AppText';
import { AppButton } from '../../../components/AppButton';
import type { RootStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'ServicePreview'>;

export function ServicePreviewScreen({ navigation, route }: Props) {
  const { readiness } = useAuth();
  const meeting = route.params.kind === 'meeting';
  return (
    <Screen header={<AppHeader title={meeting ? 'Punto medio' : 'Recogida'} onBack={() => navigation.goBack()} />}>
      <AppText variant="heading">{meeting ? 'Encuentra dónde reunirse' : 'Pide que recojan algo por ti'}</AppText>
      <AppText tone="secondary">{meeting ? 'Invita a otra persona y PuntoMedio propondrá lugares públicos convenientes para ambos.' : 'Indica qué deben recoger, el origen y el destino. Después podrás elegir quién realizará la entrega.'}</AppText>
      <View style={styles.summary}>
        <AppText variant="label">{meeting ? '¿Cómo funciona?' : 'Antes de comenzar'}</AppText>
        <AppText variant="small" tone="secondary">{meeting ? '1. Crea la invitación.  2. La otra persona la acepta.  3. Ambos eligen un lugar y confirman su llegada.' : '1. Publica el encargo.  2. Revisa las propuestas.  3. Elige a una persona y sigue el avance.'}</AppText>
        {!meeting ? <AppText variant="small" tone="secondary">El precio del servicio se muestra antes de aceptar. La persona que entrega nunca debe adelantar el costo del producto.</AppText> : null}
      </View>
      <AppText variant="small" tone="secondary">El teléfono se usa para crear y administrar. El reloj permite consultar actividad y avisos de forma rápida.</AppText>
      <AppButton title={meeting ? 'Crear una invitación' : 'Solicitar recogida'} disabled={readiness?.completion !== 'complete'} hint={readiness?.completion === 'complete' ? (meeting ? 'Crear una invitación para encontrar un punto medio.' : 'Crear una solicitud de recogida y entrega.') : 'Completa tu perfil para continuar.'} {...(readiness?.completion === 'complete' ? { onPress: () => navigation.navigate(meeting ? 'MeetingCreate' : 'JobCreate') } : {})} />
      {meeting && readiness?.completion === 'complete' ? <AppButton title="Aceptar una invitación" kind="secondary" onPress={() => navigation.navigate('MeetingJoin')} /> : null}
      {!meeting && readiness?.completion === 'complete' ? <AppButton title="Ver entregas disponibles" kind="secondary" onPress={() => navigation.navigate('JobMarket')} /> : null}
      {readiness?.completion !== 'complete' ? <AppButton title="Completar mi perfil" kind="secondary" onPress={() => navigation.navigate('Main', { screen: 'Profile' })} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ summary: { gap: spacing.xs, paddingVertical: spacing.sm } });
