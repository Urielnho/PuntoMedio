/** Midnight Violet. Values transcribed from the approved product palette and Stitch export. */
export const colors = {
  primary: '#252238',
  accent: '#9787D9',
  background: '#F7F6FA',
  surface: '#FFFFFF',
  textPrimary: '#252238',
  textSecondary: '#858196',
  border: '#E7E4EF',
  success: '#278568',
  warning: '#B77927',
  error: '#C44755',
  outlineStrong: '#CEC9DB',
  surfaceMuted: '#EEEBF5',
  primaryPressed: '#34304E',
} as const;

export const wearColors = {
  background: '#15131F',
  surface: '#252238',
  textPrimary: '#FFFFFF',
  accent: '#9787D9',
  textSecondary: '#B5B0C4',
  surfaceMuted: '#312D4A',
} as const;

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 } as const;
export const radii = { sm: 6, md: 10, lg: 12, xl: 16, full: 9999 } as const;
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 38 },
  displayMobile: { fontSize: 26, lineHeight: 34 },
  headline: { fontSize: 22, lineHeight: 28 },
  section: { fontSize: 18, lineHeight: 24 },
  title: { fontSize: 16, lineHeight: 22 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 14, lineHeight: 18 },
  labelSmall: { fontSize: 12, lineHeight: 16 },
  micro: { fontSize: 11, lineHeight: 14 },
} as const;

export const motion = { pressMs: 120, sheetMs: 200 } as const;
