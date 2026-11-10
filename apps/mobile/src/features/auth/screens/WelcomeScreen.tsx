import { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { LockKeyhole, Mail } from 'lucide-react-native';
import { colors, spacing } from '@puntomedio/design-tokens';
import { Screen } from '../../../components/Screen';
import { AppText } from '../../../components/AppText';
import { AppField } from '../../../components/AppField';
import { AppButton } from '../../../components/AppButton';
import { useAppNavigation } from '../../../navigation/useAppNavigation';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';
import { accountErrorMessage } from '../../../validation/account';
import { validateEmail } from '../../../validation/text';

export function WelcomeScreen() {
  const navigation = useAppNavigation();
  const { integration } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailError = validateEmail(email);
  const signIn = async () => {
    if (emailError || !password || password.length > 128) { setError(emailError ?? 'Escribe una contraseña válida.'); return; }
    setBusy(true); setError(null);
    try { await authService.signIn(email, password); }
    catch (reason) { setError(accountErrorMessage(reason)); }
    finally { setBusy(false); }
  };
  return <Screen>
    <View style={styles.section}><Image source={require('../../../../assets/puntomedio-icon.png')} style={styles.brand} accessibilityLabel="PuntoMedio" /><AppText variant="display">PuntoMedio</AppText><AppText variant="small" tone="secondary">Encuentros y recogidas, en un solo lugar.</AppText></View>
    <View style={styles.section}>
      <AppField label="Correo electrónico" value={email} onChangeText={setEmail} maxLength={254} keyboardType="email-address" autoCapitalize="none" autoComplete="email" icon={<Mail size={19} color={colors.textSecondary} />} {...(email && emailError ? { error: emailError } : {})} />
      <AppField label="Contraseña" value={password} onChangeText={setPassword} maxLength={128} secureTextEntry autoComplete="current-password" icon={<LockKeyhole size={19} color={colors.textSecondary} />} {...(error ? { error } : {})} />
      <AppButton title="¿Olvidaste tu contraseña?" kind="text" onPress={() => navigation.navigate('Recovery')} />
      <AppButton title={busy ? 'Iniciando…' : 'Iniciar sesión'} disabled={busy || integration !== 'ready' || emailError !== null || !password || password.length > 128} onPress={() => void signIn()} />
      <AppButton title="Crear cuenta" kind="secondary" onPress={() => navigation.navigate('Register')} />
    </View>
  </Screen>;
}
const styles = StyleSheet.create({ section: { gap: spacing.sm }, brand: { width: 56, height: 56, borderRadius: 12 } });
