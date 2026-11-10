import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapPin, Shield, MessageCircle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PublicProfile } from '@puntomedio/contracts';
import { colors, spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen'; import { AppHeader } from '../../../components/AppHeader'; import { AppText } from '../../../components/AppText'; import { Avatar } from '../../../components/Avatar'; import { Badge } from '../../../components/Badge'; import { EmptyState } from '../../../components/EmptyState'; import { AppButton } from '../../../components/AppButton'; import { useProfileDraft } from '../../../hooks/useProfileDraft'; import { useAuth } from '../../../hooks/useAuth'; import { blockProfile, getProfileReviews, getPublicProfile } from '../../../services/profileService'; import { createAvatarUrl } from '../../../services/avatarService'; import { accountErrorMessage } from '../../../validation/account'; import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PublicProfile'>;
type Review = Awaited<ReturnType<typeof getProfileReviews>>[number];

export function PublicProfileScreen({ navigation, route }: Props) {
  const { draft } = useProfileDraft(); const { user } = useAuth(); const profileId = route.params?.profileId ?? user?.id; const isSelf = profileId === user?.id;
  const [profile, setProfile] = useState<PublicProfile | null>(null); const [reviews, setReviews] = useState<readonly Review[]>([]); const [avatarUrl, setAvatarUrl] = useState<string | null>(null); const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { if (!profileId) return; void Promise.all([getPublicProfile(profileId), getProfileReviews(profileId)]).then(async ([value, items]) => { setProfile(value); setReviews(items); if (value?.avatarUrl) setAvatarUrl(await createAvatarUrl(value.avatarUrl)); }).catch((error) => setMessage(accountErrorMessage(error))); }, [profileId]);
  const block = async () => { if (!profileId || isSelf) return; try { await blockProfile(profileId); setMessage('Perfil bloqueado. Ya no aparecerá en tus consultas públicas.'); } catch (error) { setMessage(accountErrorMessage(error)); } };
  return <Screen header={<AppHeader title="Perfil público" onBack={() => navigation.goBack()} />}>
    <View style={styles.identity}><Avatar size={88} uri={avatarUrl} /><AppText variant="headline" align="center">{profile?.displayName ?? ((isSelf ? draft.displayName : '') || 'Perfil no disponible')}</AppText><View style={styles.row}><MapPin size={15} color={colors.accent} /><AppText variant="small" tone="secondary">{profile?.city ?? ((isSelf ? draft.city : '') || 'Ciudad no disponible')}</AppText></View><Badge label={profile ? 'Perfil completo' : 'Perfil pendiente o no disponible'} tone={profile ? 'success' : 'warning'} /><View style={styles.stats}><View style={styles.stat}><AppText variant="headline">{profile?.rating?.toFixed(1) ?? '—'}</AppText><AppText variant="caption" tone="secondary">Calificación</AppText></View><View style={styles.stat}><AppText variant="headline">{profile?.completedServices ?? '—'}</AppText><AppText variant="caption" tone="secondary">Servicios</AppText></View></View></View>
    <View style={styles.notice}><Shield size={18} color={colors.accent} /><AppText variant="small" tone="secondary" style={styles.noticeText}>Tus datos privados no se muestran públicamente.</AppText></View>
    <AppText variant="title">Reseñas recientes</AppText>{reviews.length === 0 ? <EmptyState icon={MessageCircle} title="Sin reseñas" description="Aparecerán después de servicios completados." /> : reviews.map((review) => <View key={review.id} style={styles.review}><AppText variant="label">{review.rating} de 5</AppText><AppText variant="small" tone="secondary">{review.comment || 'Sin comentario.'}</AppText><AppText variant="caption" tone="secondary">{new Date(review.created_at).toLocaleDateString()}</AppText></View>)}
    {message ? <AppText variant="small" tone="secondary">{message}</AppText> : null}
    {!isSelf && profileId ? <><AppButton title="Reportar perfil" kind="secondary" onPress={() => navigation.navigate('ReportProfile', { profileId })} /><AppButton title="Bloquear perfil" kind="text" onPress={() => void block()} /></> : null}
    <AppButton title="Conversar mediante un servicio" disabled hint="El chat requiere un servicio compartido." />
  </Screen>;
}
const styles = StyleSheet.create({ identity: { alignItems: 'center', gap: spacing.sm }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs }, stats: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md }, stat: { alignItems: 'center', gap: spacing.xxs }, notice: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }, noticeText: { flex: 1 }, review: { gap: spacing.xs, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border } });
