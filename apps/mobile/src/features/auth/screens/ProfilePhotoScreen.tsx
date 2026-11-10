import { useState } from 'react';
import { Camera, Image as ImageIcon, UserRound } from 'lucide-react-native';
import { View, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, radii, spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppText } from '../../../components/AppText';
import { AppButton } from '../../../components/AppButton';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { uploadMyAvatar } from '../../../services/avatarService';
import { accountErrorMessage } from '../../../validation/account';
import { useAuth } from '../../../hooks/useAuth';

type Selection = { readonly uri: string; readonly mimeType: string };
export function ProfilePhotoScreen() {
  const navigation = useAppNavigation(); const { refreshReadiness } = useAuth(); const [selection, setSelection] = useState<Selection | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const choose = async (camera: boolean) => { const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!permission.granted) { setError('Necesitamos tu permiso para elegir la fotografía.'); return; } const result = camera ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 }); const asset = result.canceled ? undefined : result.assets[0]; if (asset) setSelection({ uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' }); };
  const save = async () => { if (!selection) return; setBusy(true); setError(null); try { await uploadMyAvatar(selection.uri, selection.mimeType); await refreshReadiness(); navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); } catch (reason) { setError(accountErrorMessage(reason)); } finally { setBusy(false); } };
  const leave = () => navigation.canGoBack() ? navigation.goBack() : navigation.replace('Register');
  return <Screen header={<AppHeader title="Foto de perfil" step="PASO 2 DE 2" onBack={leave} />}>
    <AppText variant="heading" align="center">Fotografía de perfil</AppText><AppText variant="small" tone="secondary" align="center">Es obligatoria para operar, pero no acredita identidad oficial.</AppText>
    <View style={styles.photo}>{selection ? <Image source={{ uri: selection.uri }} style={styles.image} /> : <UserRound size={56} color={colors.textSecondary} />}</View>
    <View style={styles.actions}><View style={styles.grow}><AppButton title="Galería" kind="secondary" icon={<ImageIcon size={18} color={colors.primary} />} onPress={() => void choose(false)} /></View><View style={styles.grow}><AppButton title="Cámara" kind="secondary" icon={<Camera size={18} color={colors.primary} />} onPress={() => void choose(true)} /></View></View>
    {error ? <AppText variant="caption" tone="error">{error}</AppText> : null}<AppButton title={busy ? 'Guardando…' : 'Guardar fotografía'} disabled={busy || !selection} onPress={() => void save()} />
  </Screen>;
}
const styles = StyleSheet.create({ photo: { width: 152, height: 152, borderRadius: radii.full, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }, image: { width: 152, height: 152 }, actions: { flexDirection: 'row', gap: spacing.sm }, grow: { flex: 1 } });
