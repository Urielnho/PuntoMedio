import { getSupabaseRuntime } from '../integrations/supabase/runtime';

function client() {
  const value = getSupabaseRuntime().client;
  if (!value) throw new Error('integration_unavailable');
  return value;
}

export type ConversationPreview = {
  id: string;
  serviceKind: 'meeting' | 'job';
  serviceId: string;
  title: string;
  lastMessage: string;
  lastMessageAt: string;
};

export const conversationService = {
  async list(): Promise<readonly ConversationPreview[]> {
    const connection = client();
    const { data: conversations, error } = await connection.from('conversations').select('*');
    if (error) throw error;
    if (!conversations.length) return [];

    const ids = conversations.map((item) => item.id);
    const { data: messages, error: messagesError } = await connection.from('messages').select('*').in('conversation_id', ids).order('created_at', { ascending: false });
    if (messagesError) throw messagesError;
    const meetingIds = conversations.flatMap((item) => item.meeting_id ? [item.meeting_id] : []);
    const jobIds = conversations.flatMap((item) => item.job_id ? [item.job_id] : []);
    const [meetings, jobs] = await Promise.all([
      meetingIds.length ? connection.from('meetings').select('id,title').in('id', meetingIds) : Promise.resolve({ data: [], error: null }),
      jobIds.length ? connection.from('jobs').select('id,title').in('id', jobIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (meetings.error) throw meetings.error;
    if (jobs.error) throw jobs.error;

    return conversations.map((conversation) => {
      const latest = messages.find((message) => message.conversation_id === conversation.id);
      const serviceId = conversation.meeting_id ?? conversation.job_id ?? '';
      const title = conversation.service_kind === 'meeting'
        ? meetings.data.find((item) => item.id === serviceId)?.title
        : jobs.data.find((item) => item.id === serviceId)?.title;
      return {
        id: conversation.id,
        serviceKind: conversation.service_kind,
        serviceId,
        title: title ?? 'Conversación de servicio',
        lastMessage: latest?.body ?? 'Archivo compartido',
        lastMessageAt: latest?.created_at ?? conversation.created_at,
      };
    }).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  },
};
