import { useMemo, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { CheckCircle2, Circle, Eye, EyeOff, LockKeyhole, Mail, MapPin, UserRound, Square, SquareCheck } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen';
import { AppHeader } from '../../../components/AppHeader';
import { AppText } from '../../../components/AppText';
import { AppField } from '../../../components/AppField';
import { AppButton } from '../../../components/AppButton';
import { useProfileDraft } from '../../../hooks/useProfileDraft';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';
import { accountErrorMessage, validateRegistration } from '../../../validation/account';

export function RegisterScreen() {
  const navigation = useAppNavigation(); const { integration, session } = useAuth(); const { draft, update } = useProfileDraft();
  const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [passwordVisible, setPasswordVisible] = useState(false); const [busy, setBusy] = useState(false); const [serverError, setServerError] = useState<string | null>(null);
  const requiresPassword = !session;
  const validation = useMemo(() => validateRegistration(draft, password, confirmPassword, requiresPassword), [confirmPassword, draft, password, requiresPassword]);
  const submit = async () => { setBusy(true); setServerError(null); try { const result = await authService.register(draft, password); navigation.replace(result.session ? 'ProfilePhoto' : 'EmailVerification'); } catch (error) { setServerError(accountErrorMessage(error)); } finally { setBusy(false); } };
  const legalAccepted = draft.termsAccepted && draft.privacyAccepted;
  const toggleLegal = () => { update('termsAccepted', !legalAccepted); update('privacyAccepted', !legalAccepted); };
  const leave = () => {
    if (navigation.canGoBack()) { navigation.goBack(); return; }
    if (session) { void authService.signOut(); return; }
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };
  const passwordRules = [
    { label: '8 caracteres o más', valid: password.length >= 8 },
    { label: 'Una mayúscula y una minúscula', valid: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Al menos un número', valid: /[0-9]/.test(password) },
  ];
  const visibilityControl = <Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'} hitSlop={10} onPress={() => setPasswordVisible((value) => !value)}>{passwordVisible ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}</Pressable>;
  return <Screen header={<AppHeader title={session ? 'Completar perfil' : 'Registro'} step="PASO 1 DE 2" onBack={leave} />}>
    <View style={styles.group}><AppText variant="heading">{session ? 'Completa tu perfil' : 'Crea tu cuenta'}</AppText><AppText variant="small" tone="secondary">Usaremos estos datos para proteger tu cuenta y coordinar tus servicios.</AppText></View>
    <View style={styles.group}>
      <AppField label="Nombre y apellidos" value={draft.displayName} onChangeText={(v) => update('displayName', v.slice(0, 80))} maxLength={80} icon={<UserRound size={19} color={colors.textSecondary} />} />
      <AppField label="Correo electrónico" value={draft.email} onChangeText={(v) => update('email', v.slice(0, 254))} maxLength={254} editable={!session} autoCapitalize="none" keyboardType="email-address" autoComplete="email" icon={<Mail size={19} color={colors.textSecondary} />} help={session ? 'El correo pertenece a la cuenta con la que iniciaste sesión.' : 'Te enviaremos un enlace de confirmación.'} />
      <AppField label="Ciudad" value={draft.city} onChangeText={(v) => update('city', v.slice(0, 80))} maxLength={80} icon={<MapPin size={19} color={colors.textSecondary} />} />
      {requiresPassword ? <>
        <AppField label="Contraseña" value={password} onChangeText={setPassword} maxLength={128} secureTextEntry={!passwordVisible} autoComplete="new-password" icon={<LockKeyhole size={19} color={colors.textSecondary} />} trailing={visibilityControl} {...(serverError ? { error: serverError } : {})} />
        <View style={styles.rules}>{passwordRules.map((rule) => { const Icon = rule.valid ? CheckCircle2 : Circle; return <View key={rule.label} style={styles.rule}><Icon size={16} color={rule.valid ? colors.success : colors.textSecondary} /><AppText variant="caption" tone={rule.valid ? 'success' : 'secondary'}>{rule.label}</AppText></View>; })}</View>
        <AppField label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} maxLength={128} secureTextEntry={!passwordVisible} autoComplete="new-password" icon={<LockKeyhole size={19} color={colors.textSecondary} />} trailing={visibilityControl} {...(confirmPassword && password !== confirmPassword ? { error: 'Las contraseñas no coinciden.' } : {})} />
      </> : null}
    </View>
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: legalAccepted }} onPress={toggleLegal} style={styles.check}>{legalAccepted ? <SquareCheck size={22} color={colors.primary} /> : <Square size={22} color={colors.primary} />}<AppText variant="small" style={styles.grow}>Acepto los términos y el aviso de privacidad</AppText></Pressable>
    {validation && !serverError ? <AppText variant="caption" tone="secondary">{validation}</AppText> : null}
    <AppButton title={busy ? 'Guardando…' : session ? 'Guardar y continuar' : 'Crear cuenta'} disabled={busy || integration !== 'ready' || validation !== null} onPress={() => void submit()} />
  </Screen>;
}
const styles = StyleSheet.create({ group: { gap: spacing.md }, rules: { gap: spacing.xs, marginTop: -spacing.xs }, rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs }, check: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, grow: { flex: 1 } });
