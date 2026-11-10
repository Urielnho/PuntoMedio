import { useCallback, useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { meetingService } from '../../../services/meetingService';
import { accountErrorMessage } from '../../../validation/account';
import { useAuth } from '../../../hooks/useAuth';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MeetingDetail'>;
type Bundle = Awaited<ReturnType<typeof meetingService.get>>;
const statusLabel = { created: 'Creado', invited: 'Esperando participante', accepted: 'Eligiendo lugar', point_selected: 'Lugar confirmado', in_progress: 'En curso', completed: 'Completado', cancelled: 'Cancelado' } as const;
const distance = (meters: number) => meters < 1000 ? `${meters} m aprox.` : `${(meters / 1000).toFixed(1)} km aprox.`;

export function MeetingDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { try { setBundle(await meetingService.get(route.params.meetingId)); } catch (reason) { setError(accountErrorMessage(reason)); } }, [route.params.meetingId]);
  useEffect(() => { void load(); }, [load]);
  const act = async (operation: () => Promise<unknown>) => { setBusy(true); setError(null); try { await operation(); await load(); } catch (reason) { setError(accountErrorMessage(reason)); } finally { setBusy(false); } };
  if (!bundle) return <Screen header={<AppHeader title="Encuentro" onBack={() => navigation.goBack()} />}><AppText tone="secondary">Cargando información autorizada…</AppText>{error ? <AppText tone="error">{error}</AppText> : null}</Screen>;
  const { meeting, participants, suggestions, points } = bundle;
  const mine = participants.find((item) => item.user_id === user?.id);
  const allArrived = participants.length === 2 && participants.every((item) => item.arrived_at);
  const allCompleted = participants.length === 2 && participants.every((item) => item.completed_at);
  return <Screen header={<AppHeader title="Encuentro" onBack={() => navigation.goBack()} />}>
    <AppText variant="heading">{meeting.title}</AppText>
    <Badge label={statusLabel[meeting.status]} tone={meeting.status === 'completed' ? 'success' : meeting.status === 'cancelled' ? 'error' : 'neutral'} />
    <Card><AppText variant="label">Servicio gratuito</AppText><AppText variant="small" tone="secondary">Participantes: {participants.length} de 2 · Sin tarifa ni comisión.</AppText></Card>
    {meeting.status === 'invited' ? <><AppButton title="Generar otra invitación" kind="secondary" disabled={busy} onPress={() => void act(async () => setToken(await meetingService.invite(meeting.id, meeting.revision)))} />{token ? <Card><AppText variant="label">Nuevo código privado</AppText><AppText>{token}</AppText></Card> : null}</> : null}
    {meeting.status === 'accepted' && suggestions.length === 0 ? <AppButton title="Buscar tres lugares públicos" disabled={busy} onPress={() => void act(() => meetingService.suggest(meeting.id, meeting.revision))} /> : null}
    {suggestions.map((suggestion) => { const point = points.find((item) => item.id === suggestion.point_id); if (!point) return null; return <Card key={point.id}><AppText variant="label">{suggestion.rank}. {point.name}</AppText><AppText variant="small" tone="secondary">{point.category} · {point.address_label}</AppText><AppText variant="small" tone="secondary">Origen A: {distance(suggestion.participant_one_distance_m)}</AppText><AppText variant="small" tone="secondary">Origen B: {distance(suggestion.participant_two_distance_m)}</AppText><AppText variant="caption" tone="secondary">Distancias geográficas, no tiempos de viaje.</AppText>{meeting.status === 'accepted' ? <AppButton title="Aceptar este lugar" kind="secondary" disabled={busy} onPress={() => void act(() => meetingService.acceptPoint(meeting.id, point.id, meeting.revision))} /> : null}</Card>; })}
    {meeting.status === 'point_selected' || meeting.status === 'in_progress' ? <Card><AppText variant="label">Confirmaciones</AppText><AppText variant="small" tone="secondary">Llegadas: {participants.filter((item) => item.arrived_at).length}/2</AppText><AppText variant="small" tone="secondary">Cierres: {participants.filter((item) => item.completed_at).length}/2</AppText></Card> : null}
    {(meeting.status === 'point_selected' || meeting.status === 'in_progress') && !mine?.arrived_at ? <AppButton title="Confirmar mi llegada" disabled={busy} onPress={() => void act(() => meetingService.arrive(meeting.id, meeting.revision))} /> : null}
    {meeting.status === 'in_progress' && allArrived && !mine?.completed_at ? <AppButton title="Finalizar mi participación" disabled={busy} onPress={() => void act(() => meetingService.complete(meeting.id, meeting.revision))} /> : null}
    {allCompleted ? <AppText variant="small" tone="success">Ambas personas finalizaron el encuentro.</AppText> : null}
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
    {!['completed', 'cancelled'].includes(meeting.status) ? <AppButton title="Cancelar encuentro" kind="text" disabled={busy} onPress={() => void act(() => meetingService.cancel(meeting.id, meeting.revision))} /> : null}
  </Screen>;
}
