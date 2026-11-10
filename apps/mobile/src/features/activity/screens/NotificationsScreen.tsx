import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react-native';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { EmptyState } from '../../../components/EmptyState';
import { ListRow } from '../../../components/ListRow';
import { AppText } from '../../../components/AppText';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { notificationService } from '../../../services/notificationService';
import { accountErrorMessage } from '../../../validation/account';

type Notification = Awaited<ReturnType<typeof notificationService.list>>[number];

export function NotificationsScreen() {
  const navigation = useAppNavigation();
  const [items, setItems] = useState<readonly Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void notificationService.list().then(setItems).catch((reason) => setError(accountErrorMessage(reason))); }, []);
  const open = (item: Notification) => {
    if (!item.read_at) void notificationService.markRead(item.id);
    if (item.service_kind === 'meeting' && item.service_id) navigation.navigate('MeetingDetail', { meetingId: item.service_id });
    else if (item.service_kind === 'job' && item.service_id) navigation.navigate('JobDetail', { jobId: item.service_id });
  };
  return <Screen header={<AppHeader title="Notificaciones" onBack={() => navigation.goBack()} />}>
    {items.length === 0 && !error ? <EmptyState icon={Bell} title="Sin notificaciones" description="No tienes avisos nuevos." /> : null}
    {items.map((item) => <ListRow key={item.id} title={`${item.read_at ? '' : '• '}${item.title}`} subtitle={item.body} metadata={new Date(item.created_at).toLocaleString()} onPress={() => open(item)} />)}
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
  </Screen>;
}
