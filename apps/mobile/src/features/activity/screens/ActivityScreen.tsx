import { useCallback, useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react-native';
import { Screen } from '../../../components/Screen';
import { TabHeader } from '../../../components/TabHeader';
import { EmptyState } from '../../../components/EmptyState';
import { AppText } from '../../../components/AppText';
import { AppButton } from '../../../components/AppButton';
import { ListRow } from '../../../components/ListRow';
import { meetingService } from '../../../services/meetingService';
import { jobService } from '../../../services/jobService';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { accountErrorMessage } from '../../../validation/account';
import { useAuth } from '../../../hooks/useAuth';

type Meeting = Awaited<ReturnType<typeof meetingService.list>>[number];
type Job = Awaited<ReturnType<typeof jobService.listMine>>[number];

const statuses: Record<string, string> = {
  created: 'Creado', invited: 'Invitación pendiente', accepted: 'Aceptado', point_selected: 'Punto acordado', in_progress: 'En curso', completed: 'Completado', cancelled: 'Cancelado',
  published: 'Publicado', bidding: 'Recibiendo propuestas', assigned: 'Asignado', test_payment_confirmed: 'Pago confirmado', pickup_in_progress: 'Recogida en curso', picked_up: 'Recogido', delivery_in_progress: 'Entrega en curso', delivered: 'Entregado', disputed: 'En revisión',
};

export function ActivityScreen() {
  const navigation = useAppNavigation();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<readonly Meeting[]>([]);
  const [jobs, setJobs] = useState<readonly Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try {
      const [nextMeetings, nextJobs] = await Promise.all([meetingService.list(), jobService.listMine()]);
      setMeetings(nextMeetings); setJobs(nextJobs); setError(null);
    } catch (reason) { setError(accountErrorMessage(reason)); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <Screen inTab header={<TabHeader title="Actividad" />} headerVariant="plain">
    {meetings.length === 0 && jobs.length === 0 ? <EmptyState icon={ClipboardList} title="Sin actividad" description="No tienes servicios pendientes." /> : null}
    {jobs.map((job) => <ListRow key={job.id} title={job.title} subtitle={`${job.requester_id === user?.id ? 'Solicitado por ti' : 'Reparto asignado'} · ${statuses[job.status] ?? job.status}`} metadata={`Actualizado ${new Date(job.updated_at).toLocaleDateString()}`} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })} />)}
    {meetings.map((meeting) => <ListRow key={meeting.id} title={meeting.title} subtitle={`${meeting.creator_id === user?.id ? 'Creado por ti' : 'Te invitaron'} · ${statuses[meeting.status] ?? meeting.status}`} metadata={`Actualizado ${new Date(meeting.updated_at).toLocaleDateString()}`} onPress={() => navigation.navigate('MeetingDetail', { meetingId: meeting.id })} />)}
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}<AppButton title="Actualizar" kind="text" onPress={() => void load()} />
  </Screen>;
}
