/**
 * VetDose Pro Theme Configuration
 * Medical professional color palette with emergency accents
 * Inspired by modern health app aesthetics
 */

import { Platform } from 'react-native';

// Primary color palette
export const VetColors = {
  // Primary brand colors
  primary: '#7C3AED',          // Purple - main brand
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',

  // Secondary accent
  secondary: '#06B6D4',        // Cyan - secondary actions
  secondaryLight: '#67E8F9',
  secondaryDark: '#0891B2',

  // Semantic colors
  success: '#22C55E',          // Green - safe/approved
  successLight: '#86EFAC',
  successDark: '#16A34A',

  warning: '#F59E0B',          // Amber - caution
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  danger: '#EF4444',           // Red - danger/error
  dangerLight: '#FCA5A5',
  dangerDark: '#DC2626',

  emergency: '#E53935',        // Emergency red - high contrast
  emergencyLight: '#EF5350',
  emergencyDark: '#C62828',

  // Neutral colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Pastel card backgrounds (matching reference UI)
  cardPurple: '#F3E8FF',
  cardBlue: '#E0F2FE',
  cardGreen: '#DCFCE7',
  cardOrange: '#FFF7ED',
  cardPink: '#FCE7F3',
  cardYellow: '#FEF9C3',
  cardCyan: '#CFFAFE',
  cardRed: '#FEE2E2',

  // Gradient colors
  gradientPurpleStart: '#7C3AED',
  gradientPurpleEnd: '#A855F7',
  gradientBlueStart: '#3B82F6',
  gradientBlueEnd: '#06B6D4',
  gradientGreenStart: '#22C55E',
  gradientGreenEnd: '#10B981',

  // Species-specific colors
  speciesCanine: '#3B82F6',
  speciesFeline: '#8B5CF6',
  speciesEquine: '#F59E0B',
  speciesBovine: '#10B981',
  speciesAvian: '#06B6D4',
  speciesReptile: '#84CC16',
  speciesExotic: '#EC4899',
};

// Dark mode colors
export const VetColorsDark = {
  ...VetColors,

  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textInverse: '#1F2937',

  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',

  border: '#334155',
  borderLight: '#1E293B',

  // Darker pastel cards for dark mode
  cardPurple: '#2E1065',
  cardBlue: '#0C4A6E',
  cardGreen: '#14532D',
  cardOrange: '#431407',
  cardPink: '#500724',
  cardYellow: '#422006',
  cardCyan: '#083344',
  cardRed: '#450A0A',
};

// Typography configuration
export const Typography = {
  fontFamily: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  }),

  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing system (4px base grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// Border radius
export const Radius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Touch targets (accessibility)
export const TouchTargets = {
  min: 44,
  recommended: 48,
  large: 56,
};

// Animation durations
export const AnimationDurations = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Z-index layers
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  toast: 50,
  emergency: 100,
};

// Theme object combining all
export const Theme = {
  colors: VetColors,
  colorsDark: VetColorsDark,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  touchTargets: TouchTargets,
  animationDurations: AnimationDurations,
  zIndex: ZIndex,
};

// Legacy Colors export for backwards compatibility
export const Colors = {
  light: {
    text: VetColors.text,
    background: VetColors.background,
    tint: VetColors.primary,
    icon: VetColors.textSecondary,
    tabIconDefault: VetColors.textMuted,
    tabIconSelected: VetColors.primary,
  },
  dark: {
    text: VetColorsDark.text,
    background: VetColorsDark.background,
    tint: VetColorsDark.primary,
    icon: VetColorsDark.textSecondary,
    tabIconDefault: VetColorsDark.textMuted,
    tabIconSelected: VetColorsDark.primaryLight,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "Inter, 'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export default Theme;
