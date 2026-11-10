import { useState } from 'react';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppField } from '../../../components/AppField';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { meetingService } from '../../../services/meetingService';
import { locationService } from '../../../services/locationService';
import { accountErrorMessage } from '../../../validation/account';
import { validateInvitationCode } from '../../../validation/text';

export function MeetingJoinScreen() {
  const navigation = useAppNavigation();
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenError = validateInvitationCode(token);
  const join = async () => {
    if (tokenError) { setError(tokenError); return; }
    setBusy(true); setError(null);
    try {
      const origin = await locationService.currentApproximate();
      const meeting = await meetingService.join(token.trim(), origin.latitude, origin.longitude);
      navigation.replace('MeetingDetail', { meetingId: meeting.id });
    } catch (reason) { setError(accountErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  return <Screen header={<AppHeader title="Aceptar invitación" onBack={() => navigation.goBack()} />}>
    <AppText variant="heading">Ingresa tu código</AppText>
    <AppText variant="small" tone="secondary">Usaremos tu ubicación aproximada una sola vez para calcular un punto justo para ambos.</AppText>
    <AppField label="Código de invitación" value={token} onChangeText={(value) => setToken(value.toUpperCase().replace(/[^A-F0-9-]/g, '').slice(0, 37))} placeholder="Ej. A7C2F-91D4B" autoCapitalize="characters" autoCorrect={false} maxLength={37} {...(token && tokenError ? { error: tokenError } : {})} />
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}
    <AppButton title={busy ? 'Comprobando…' : 'Continuar'} disabled={busy || tokenError !== null} onPress={() => void join()} />
  </Screen>;
}
