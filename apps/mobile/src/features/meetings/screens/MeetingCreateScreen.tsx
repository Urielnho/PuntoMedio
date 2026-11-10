import { useState } from 'react';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppField } from '../../../components/AppField';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Card } from '../../../components/Card';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { meetingService } from '../../../services/meetingService';
import { locationService } from '../../../services/locationService';
import { accountErrorMessage } from '../../../validation/account';
import { validateTitle } from '../../../validation/text';

export function MeetingCreateScreen() {
  const navigation = useAppNavigation();
  const [title, setTitle] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayToken = token?.length === 10 ? `${token.slice(0, 5)}-${token.slice(5)}` : token;
  const titleError = validateTitle(title);

  const create = async () => {
    if (titleError) { setError(titleError); return; }
    setBusy(true); setError(null);
    try {
      const origin = await locationService.currentApproximate();
      const meeting = await meetingService.create(title.trim(), origin.latitude, origin.longitude);
      const invitation = await meetingService.invite(meeting.id, meeting.revision);
      setMeetingId(meeting.id); setToken(invitation);
    } catch (reason) { setError(accountErrorMessage(reason)); }
    finally { setBusy(false); }
  };

  return <Screen header={<AppHeader title="Nuevo encuentro" onBack={() => navigation.goBack()} />}>
    <AppText variant="heading">Encuéntrense a mitad del camino</AppText>
    <AppText variant="small" tone="secondary">Solo necesitamos un nombre. Al continuar, usaremos tu ubicación aproximada una vez para sugerir lugares públicos.</AppText>
    {token ? <>
      <Card><AppText variant="label">Código de invitación</AppText><AppText variant="heading">{displayToken}</AppText><AppText variant="caption" tone="secondary">Comparte este código con la otra persona. Puede escribirlo con o sin guion y caduca en 24 horas.</AppText></Card>
      <AppButton title="Ver encuentro" onPress={() => meetingId && navigation.replace('MeetingDetail', { meetingId })} />
    </> : <>
      <AppField label="¿Para qué se van a reunir?" value={title} onChangeText={setTitle} placeholder="Ej. Entregar documentos" maxLength={100} {...(title && titleError ? { error: titleError } : {})} />
      {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
      <AppButton title={busy ? 'Obteniendo ubicación…' : 'Crear invitación'} disabled={busy || titleError !== null} onPress={() => void create()} />
      <AppText variant="caption" tone="secondary">Tu domicilio exacto no se muestra ni se comparte.</AppText>
    </>}
  </Screen>;
}
