import * as Location from 'expo-location';

export type SimpleCoordinates = {
  readonly latitude: number;
  readonly longitude: number;
};

async function requireForegroundPermission() {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.status === Location.PermissionStatus.GRANTED) return;
  const requested = await Location.requestForegroundPermissionsAsync();
  if (requested.status !== Location.PermissionStatus.GRANTED) throw new Error('location_permission_denied');
}

export const locationService = {
  async currentApproximate(): Promise<SimpleCoordinates> {
    await requireForegroundPermission();
    const cached = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000, requiredAccuracy: 3000 });
    const position = cached ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  },

  async address(address: string): Promise<SimpleCoordinates> {
    await requireForegroundPermission();
    const [result] = await Location.geocodeAsync(address.trim());
    if (!result) throw new Error('address_not_found');
    return { latitude: result.latitude, longitude: result.longitude };
  },
};
