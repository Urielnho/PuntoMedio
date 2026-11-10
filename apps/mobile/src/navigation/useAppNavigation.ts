import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

/** Tab actions bubble to the parent root navigator; all destinations remain typed. */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
