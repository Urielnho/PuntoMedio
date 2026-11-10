import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { GlassContainer, GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { ClipboardList, Compass, Home, MessageCircle, UserRound, type LucideIcon } from 'lucide-react-native';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@puntomedio/design-tokens';
import { AppText } from '../components/AppText';
import type { MainTabParamList } from './types';

const icons: Record<keyof MainTabParamList, LucideIcon> = {
  Home,
  Explore: Compass,
  Activity: ClipboardList,
  Messages: MessageCircle,
  Profile: UserRound,
};

const labels: Record<keyof MainTabParamList, string> = {
  Home: 'Inicio',
  Explore: 'Explorar',
  Activity: 'Actividad',
  Messages: 'Mensajes',
  Profile: 'Perfil',
};

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export function LiquidGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const nativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();
  const itemWidth = (width - (spacing.sm * 2) - (spacing.xs * 2)) / state.routes.length;
  const activeOffset = useRef(new Animated.Value(state.index * itemWidth)).current;

  useEffect(() => {
    Animated.spring(activeOffset, {
      toValue: state.index * itemWidth,
      damping: 18,
      stiffness: 190,
      mass: 0.75,
      useNativeDriver: false,
    }).start();
  }, [activeOffset, itemWidth, state.index]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.4,
    onPanResponderGrant: () => {
      activeOffset.stopAnimation();
      activeOffset.setValue(state.index * itemWidth);
    },
    onPanResponderMove: (_, gesture) => {
      const maximum = (state.routes.length - 1) * itemWidth;
      const next = Math.max(0, Math.min(maximum, (state.index * itemWidth) + gesture.dx));
      activeOffset.setValue(next);
    },
    onPanResponderRelease: (_, gesture) => {
      const rawIndex = state.index + (gesture.dx / itemWidth);
      const nextIndex = Math.max(0, Math.min(state.routes.length - 1, Math.round(rawIndex)));
      const route = state.routes[nextIndex];
      Animated.spring(activeOffset, {
        toValue: nextIndex * itemWidth,
        damping: 17,
        stiffness: 210,
        mass: 0.72,
        useNativeDriver: false,
      }).start();
      if (route && nextIndex !== state.index) navigation.navigate(route.name, route.params);
    },
    onPanResponderTerminate: () => {
      Animated.spring(activeOffset, {
        toValue: state.index * itemWidth,
        damping: 18,
        stiffness: 190,
        useNativeDriver: false,
      }).start();
    },
  }), [activeOffset, itemWidth, navigation, state.index, state.routes]);

  return (
    <View pointerEvents="box-none" style={[styles.position, { bottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.shell} {...panResponder.panHandlers}>
        {nativeGlass ? (
          <GlassContainer pointerEvents="none" spacing={12} style={styles.background}>
            <GlassView glassEffectStyle="clear" colorScheme="light" tintColor="rgba(255,255,255,0.06)" style={styles.background} />
            <AnimatedGlassView
              isInteractive
              glassEffectStyle="regular"
              colorScheme="light"
              tintColor="rgba(126,92,230,0.12)"
              style={[styles.activeGlass, { left: spacing.xs, width: itemWidth, transform: [{ translateX: activeOffset }] }]}
            />
          </GlassContainer>
        ) : (
          <>
            <BlurView pointerEvents="none" intensity={42} tint="systemUltraThinMaterialLight" blurMethod="dimezisBlurViewSdk31Plus" style={styles.background} />
            <Animated.View
              pointerEvents="none"
              style={[styles.activeFallback, { left: spacing.xs, width: itemWidth, transform: [{ translateX: activeOffset }] }]}
            >
              <View style={styles.activeGlow} />
            </Animated.View>
          </>
        )}
        <View pointerEvents="none" style={styles.topRefraction} />
        <View pointerEvents="none" style={styles.bottomRefraction} />
        <View style={styles.items}>
          {state.routes.map((route, index) => {
            const name = route.name as keyof MainTabParamList;
            const focused = state.index === index;
            const Icon = icons[name];
            const options = descriptors[route.key]?.options;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            };
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={options?.tabBarAccessibilityLabel ?? labels[name]}
                accessibilityState={{ selected: focused }}
                onPress={onPress}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              >
                <Icon size={20} color={focused ? colors.primary : colors.textSecondary} strokeWidth={focused ? 2.2 : 1.7} />
                <AppText variant="caption" weight={focused ? 'semibold' : 'medium'} style={focused ? styles.activeLabel : styles.label}>{labels[name]}</AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  position: { position: 'absolute', left: spacing.sm, right: spacing.sm, height: 68 },
  shell: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.68)',
    backgroundColor: 'rgba(248,247,252,0.10)',
    shadowColor: '#221A3E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  background: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 34, overflow: 'hidden' },
  activeGlass: { position: 'absolute', top: 5, bottom: 5, borderRadius: 29 },
  activeFallback: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    overflow: 'hidden',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
    backgroundColor: 'rgba(139,110,224,0.13)',
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  activeGlow: { position: 'absolute', top: 1, left: 10, right: 10, height: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.28)' },
  topRefraction: { position: 'absolute', top: 1, left: 18, right: 18, height: 1, backgroundColor: 'rgba(255,255,255,0.86)' },
  bottomRefraction: { position: 'absolute', bottom: 1, left: 24, right: 24, height: 1, backgroundColor: 'rgba(76,57,119,0.12)' },
  items: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xs },
  item: { flex: 1, height: 60, alignItems: 'center', justifyContent: 'center', gap: 3 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.96 }] },
  label: { color: colors.textSecondary, fontSize: 10, lineHeight: 13 },
  activeLabel: { color: colors.primary, fontSize: 10, lineHeight: 13 },
});
