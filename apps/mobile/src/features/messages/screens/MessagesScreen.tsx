import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react-native';
import { Screen } from '../../../components/Screen';
import { TabHeader } from '../../../components/TabHeader';
import { EmptyState } from '../../../components/EmptyState';
import { ListRow } from '../../../components/ListRow';
import { AppText } from '../../../components/AppText';
import { conversationService, type ConversationPreview } from '../../../services/conversationService';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { accountErrorMessage } from '../../../validation/account';

export function MessagesScreen() {
  const navigation = useAppNavigation();
  const [items, setItems] = useState<readonly ConversationPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void conversationService.list().then(setItems).catch((reason) => setError(accountErrorMessage(reason))); }, []);
  return <Screen inTab header={<TabHeader title="Mensajes" />} headerVariant="plain">
    {items.length === 0 && !error ? <EmptyState icon={MessageCircle} title="Sin conversaciones" description="Tus conversaciones activas aparecerán aquí." /> : null}
    {items.map((item) => <ListRow key={item.id} title={item.title} subtitle={item.lastMessage} metadata={new Date(item.lastMessageAt).toLocaleString()} onPress={() => item.serviceKind === 'meeting' ? navigation.navigate('MeetingDetail', { meetingId: item.serviceId }) : navigation.navigate('JobDetail', { jobId: item.serviceId })} />)}
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
  </Screen>;
}
