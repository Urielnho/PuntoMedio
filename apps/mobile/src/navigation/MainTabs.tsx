import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '@puntomedio/design-tokens';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { ExploreScreen } from '../features/explore/screens/ExploreScreen';
import { ActivityScreen } from '../features/activity/screens/ActivityScreen';
import { MessagesScreen } from '../features/messages/screens/MessagesScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import type { MainTabParamList } from './types';
import { LiquidGlassTabBar } from './LiquidGlassTabBar';

const Tabs = createBottomTabNavigator<MainTabParamList>();
export function MainTabs() {
  return (
    <Tabs.Navigator tabBar={(props) => <LiquidGlassTabBar {...props} />} screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      sceneStyle: { backgroundColor: colors.background },
    }}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tabs.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explorar' }} />
      <Tabs.Screen name="Activity" component={ActivityScreen} options={{ title: 'Actividad' }} />
      <Tabs.Screen name="Messages" component={MessagesScreen} options={{ title: 'Mensajes' }} />
      <Tabs.Screen name="Profile" component={EditProfileScreen} options={{ title: 'Perfil' }} />
    </Tabs.Navigator>
  );
}
