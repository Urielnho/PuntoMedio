import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen';
import { AppText } from '../../../components/AppText';
import { HomeHeader } from '../components/HomeHeader';
import { ServiceCard } from '../components/ServiceCard';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { meetingService } from '../../../services/meetingService';
import { jobService } from '../../../services/jobService';
import { ListRow } from '../../../components/ListRow';
import { AppButton } from '../../../components/AppButton';
import { useAuth } from '../../../hooks/useAuth';

type ActivityItem = { id: string; kind: 'meeting' | 'job'; title: string; status: string; updatedAt: string };
const statusLabels: Record<string, string> = {
  created: 'Creado', invited: 'Invitación pendiente', accepted: 'Aceptado', point_selected: 'Punto acordado', in_progress: 'En curso',
  published: 'Publicado', bidding: 'Recibiendo propuestas', assigned: 'Asignado', test_payment_confirmed: 'Pago confirmado', pickup_in_progress: 'Recogida en curso', picked_up: 'Recogido', delivery_in_progress: 'Entrega en curso', delivered: 'Entregado', disputed: 'En revisión',
};

export function HomeScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [activity, setActivity] = useState<readonly ActivityItem[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Awaited<ReturnType<typeof jobService.list>>>([]);
  useEffect(() => {
    void Promise.all([meetingService.list(), jobService.listMine(), jobService.list()]).then(([meetings, jobs, publicJobs]) => {
      const current: ActivityItem[] = [
        ...meetings.filter((item) => !['completed', 'cancelled'].includes(item.status)).map((item) => ({ id: item.id, kind: 'meeting' as const, title: item.title, status: item.status, updatedAt: item.updated_at })),
        ...jobs.filter((item) => !['completed', 'cancelled'].includes(item.status)).map((item) => ({ id: item.id, kind: 'job' as const, title: item.title, status: item.status, updatedAt: item.updated_at })),
      ];
      setActivity(current.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3));
      setAvailableJobs(publicJobs.filter((job) => ['published', 'bidding'].includes(job.status) && job.requester_id !== user?.id).slice(0, 3));
    }).catch(() => { setActivity([]); setAvailableJobs([]); });
  }, [user?.id]);
  return (
    <Screen inTab header={<HomeHeader />} headerVariant="plain">
      <View style={styles.hero}>
        <AppText variant="heading">¿Qué necesitas hacer?</AppText>
        <AppText variant="small" tone="secondary">Reúnete en un lugar justo para ambos o solicita que recojan algo por ti.</AppText>
      </View>
      <View style={styles.actions}>
        <ServiceCard kind="meeting" onPress={() => navigation.navigate('ServicePreview', { kind: 'meeting' })} />
        <ServiceCard kind="job" onPress={() => navigation.navigate('ServicePreview', { kind: 'job' })} />
      </View>
      <View style={styles.activity}>
        <AppText variant="title">Recogidas disponibles</AppText>
        <AppText variant="small" tone="secondary">Solicitudes públicas que puedes recoger y entregar.</AppText>
        {availableJobs.length === 0 ? <AppText variant="small" tone="secondary">No hay nuevas recogidas cerca por ahora.</AppText> : availableJobs.map((job) => <ListRow key={job.id} title={job.title} subtitle={`${job.pickup_label} → ${job.delivery_label}`} metadata={job.category} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />)}
        <AppButton title="Ver todas las recogidas" kind="text" onPress={() => navigation.navigate('JobMarket')} />
      </View>
      <View style={styles.activity}>
        <AppText variant="title">Tu actividad</AppText>
        {activity.length === 0 ? <AppText variant="small" tone="secondary">No tienes actividad pendiente.</AppText> : activity.map((item) => <ListRow key={`${item.kind}-${item.id}`} title={item.title} subtitle={statusLabels[item.status] ?? item.status} metadata={`Actualizado ${new Date(item.updatedAt).toLocaleString()}`} onPress={() => item.kind === 'meeting' ? navigation.navigate('MeetingDetail', { meetingId: item.id }) : navigation.navigate('JobDetail', { jobId: item.id })} />)}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: spacing.sm },
  actions: { gap: spacing.sm },
  activity: { gap: spacing.xs, paddingTop: spacing.sm },
});
