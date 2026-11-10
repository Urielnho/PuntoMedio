import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { colors } from '@puntomedio/design-tokens';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DesignErrorBoundary } from './src/components/DesignErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ProfileDraftProvider } from './src/state/ProfileDraftProvider';
import { FontProvider } from './src/theme/FontProvider';
import { AuthProvider } from './src/state/AuthProvider';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <FontProvider loaded={fontsLoaded}>
        <DesignErrorBoundary>
          {!fontsLoaded && !fontError ? (
            <View style={styles.loading} accessibilityLabel="Preparando la interfaz">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <AuthProvider>
              <ProfileDraftProvider>
                <RootNavigator />
              </ProfileDraftProvider>
            </AuthProvider>
          )}
        </DesignErrorBoundary>
      </FontProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
});
