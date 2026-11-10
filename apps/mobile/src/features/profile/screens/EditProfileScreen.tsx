import { useEffect, useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Camera, Mail } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen'; import { AppHeader } from '../../../components/AppHeader'; import { TabHeader } from '../../../components/TabHeader'; import { AppText } from '../../../components/AppText'; import { AppField } from '../../../components/AppField'; import { Avatar } from '../../../components/Avatar'; import { AppButton } from '../../../components/AppButton'; import { SettingsRow } from '../components/SettingsRow';
import { useProfileDraft } from '../../../hooks/useProfileDraft'; import { useAppNavigation } from '../../../navigation/useAppNavigation'; import { useAuth } from '../../../hooks/useAuth'; import { getCourierMode, saveMyProfile, setCourierMode } from '../../../services/profileService'; import { authService } from '../../../services/authService'; import { accountErrorMessage, validateProfile } from '../../../validation/account';

export function EditProfileScreen() {
  const navigation = useAppNavigation(); const route = useRoute(); const { draft, update, clear } = useProfileDraft(); const { readiness, refreshReadiness } = useAuth();
  const [busy, setBusy] = useState(false); const [courier, setCourier] = useState(false); const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { void getCourierMode().then(setCourier).catch(() => undefined); }, []);
  const validation = validateProfile(draft);
  const save = async () => { if (validation) { setMessage(validation); return; } setBusy(true); setMessage(null); try { await saveMyProfile(draft); await refreshReadiness(); setMessage('Perfil actualizado.'); } catch (error) { setMessage(accountErrorMessage(error)); } finally { setBusy(false); } };
  const toggleCourier = async (value: boolean) => { setBusy(true); try { await setCourierMode(value); setCourier(value); } catch (error) { setMessage(accountErrorMessage(error)); } finally { setBusy(false); } };
  const isTab = route.name === 'Profile';
  const saveAction = <AppButton title={busy ? 'Guardando…' : 'Guardar'} kind="text" compact disabled={busy || validation !== null} onPress={() => void save()} />;
  return <Screen inTab={isTab} header={isTab ? <TabHeader title="Perfil" trailing={saveAction} /> : <AppHeader title="Perfil" onBack={() => navigation.goBack()} trailing={saveAction} />} headerVariant={isTab ? 'plain' : 'surface'}>
    <View style={styles.identity}><Avatar size={88} /><AppText variant="title">{draft.displayName || 'Tu cuenta'}</AppText><AppText variant="small" tone="secondary">{draft.email || 'Correo pendiente'}</AppText><AppButton title="Cambiar fotografía" kind="text" icon={<Camera size={17} color={colors.primary} />} onPress={() => navigation.navigate('ProfilePhoto')} /></View>
    <View style={styles.section}><AppText variant="title">Datos de la cuenta</AppText><AppField label="Nombre para mostrar" value={draft.displayName} onChangeText={(v) => update('displayName', v.slice(0, 80))} maxLength={80} /><AppField label="Ciudad" value={draft.city} onChangeText={(v) => update('city', v.slice(0, 80))} maxLength={80} /><SettingsRow title="Verificación de correo" subtitle={readiness?.emailVerified ? 'Verificado' : 'Pendiente'} icon={Mail} /></View>
    <View style={styles.section}><View style={styles.row}><View style={styles.grow}><AppText variant="label">Modo repartidor</AppText><AppText variant="small" tone="secondary">Requiere perfil completo y reglas adicionales.</AppText></View><Switch disabled={busy || readiness?.completion !== 'complete'} value={courier} onValueChange={(v) => void toggleCourier(v)} /></View></View>
    {message ? <AppText variant="caption" tone="secondary">{message}</AppText> : null}
    <AppButton title="Ver perfil público" kind="secondary" onPress={() => navigation.navigate('PublicProfile')} /><AppButton title="Cerrar sesión" kind="text" onPress={() => { void authService.signOut().finally(() => { clear(); navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }); }); }} />
  </Screen>;
}
const styles = StyleSheet.create({ identity: { alignItems: 'center', gap: spacing.xs }, section: { gap: spacing.md, paddingTop: spacing.sm }, row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }, grow: { flex: 1, gap: spacing.xs } });
