import { createContext, useContext, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { fontFamilies } from '@puntomedio/design-tokens';

const FontContext = createContext(false);
export type FontWeight = keyof typeof fontFamilies;

export function FontProvider({ loaded, children }: PropsWithChildren<{ loaded: boolean }>) {
  return <FontContext.Provider value={loaded}>{children}</FontContext.Provider>;
}

export function useFontFamily(weight: FontWeight = 'regular') {
  const loaded = useContext(FontContext);
  return loaded ? fontFamilies[weight] : Platform.OS === 'ios' ? 'System' : 'sans-serif';
}
