import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@puntomedio/design-tokens';
import { ActivityIndicator, Text, View } from 'react-native';
import { WelcomeScreen } from '../features/auth/screens/WelcomeScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ProfilePhotoScreen } from '../features/auth/screens/ProfilePhotoScreen';
import { EmailVerificationScreen, RecoveryScreen } from '../features/auth/screens/AccessPlaceholderScreens';
import { ResetPasswordScreen } from '../features/auth/screens/ResetPasswordScreen';
import { PublicProfileScreen } from '../features/profile/screens/PublicProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { ServicePreviewScreen } from '../features/services/screens/ServicePreviewScreen';
import { NotificationsScreen } from '../features/activity/screens/NotificationsScreen';
import { ReportProfileScreen } from '../features/profile/screens/ReportProfileScreen';
import { useAuth } from '../hooks/useAuth';
import { MeetingCreateScreen } from '../features/meetings/screens/MeetingCreateScreen';
import { MeetingJoinScreen } from '../features/meetings/screens/MeetingJoinScreen';
import { MeetingDetailScreen } from '../features/meetings/screens/MeetingDetailScreen';
import { JobCreateScreen } from '../features/jobs/screens/JobCreateScreen';
import { JobMarketScreen } from '../features/jobs/screens/JobMarketScreen';
import { JobDetailScreen } from '../features/jobs/screens/JobDetailScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.primary, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border, notification: colors.accent },
};

export function RootNavigator() {
  const { loading, session, recoveryMode, readiness, readinessLoading, readinessError, refreshReadiness } = useAuth();
  if (loading || (session !== null && readinessLoading)) return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (session && readinessError) return <View style={{ flex: 1, padding: 32, gap: 16, backgroundColor: colors.background, justifyContent: 'center' }}><Text style={{ color: colors.textPrimary, textAlign: 'center', fontSize: 18, fontWeight: '600' }}>No pudimos consultar tu perfil</Text><Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Revisa tu conexión e inténtalo nuevamente. Tus datos no se perdieron.</Text><Text accessibilityRole="button" onPress={() => void refreshReadiness()} style={{ color: colors.primary, textAlign: 'center', fontWeight: '700', padding: 12 }}>Reintentar</Text></View>;
  const entry: keyof RootStackParamList = recoveryMode ? 'ResetPassword' : session ? (readiness?.completion === 'complete' ? 'Main' : 'Register') : 'Welcome';
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator key={entry} initialRouteName={entry} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {session ? <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
          <Stack.Screen name="ReportProfile" component={ReportProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ServicePreview" component={ServicePreviewScreen} />
          <Stack.Screen name="MeetingCreate" component={MeetingCreateScreen} />
          <Stack.Screen name="MeetingJoin" component={MeetingJoinScreen} />
          <Stack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
          <Stack.Screen name="JobCreate" component={JobCreateScreen} />
          <Stack.Screen name="JobMarket" component={JobMarketScreen} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </> : <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen name="Recovery" component={RecoveryScreen} />
        </>}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
