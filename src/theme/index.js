// src/theme/index.js
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
//   2026-07-23  Ink ramp replaces blue brand; oxblood accent, pill buttons
// Chakra UI v2 theme. Clean black-on-light system for a daily-use
// operational tool (the J13 Dealer Academy). Black is the primary
// (buttons, active states, key UI). Soft gray stays for helper and
// secondary text so it reads calm and never fatiguing. Red is
// reserved for tiny highlights only.
//
// Design intent: dealers and their sales teams log in every day.
// The interface should be crisp, quiet, fast to read, and premium.
// Black and white with a whisper of oxblood. Shares brand DNA with
// the marketing site but tuned for an app, not a storytelling page.
//
// NOTE: the `brand` scale is now an INK ramp (black), so every
// existing brand.500 usage (buttons, icons, active states) renders
// black instead of blue with no per-file changes. Red lives in the
// separate `accent` token, used sparingly.

import { extendTheme } from '@chakra-ui/react'

const colors = {
  bg: '#FAFAF7',
  surface: '#F2F2EE',
  surface2: '#E8E8E3',
  bgDark: '#000000',
  surfaceDark: '#0A0A0A',
  ink: '#0A0A0A',
  ink2: '#1D1D1F',
  inkMuted: '#4A4A4F',
  inkDim: '#86868B',
  inkOnDark: '#F5F5F7',
  inkMutedOnDark: '#A1A1A6',
  line: 'rgba(10, 10, 10, 0.08)',
  lineStrong: 'rgba(10, 10, 10, 0.16)',
  lineOnDark: 'rgba(255, 255, 255, 0.10)',
  lineStrongOnDark: 'rgba(255, 255, 255, 0.20)',

  // brand = INK ramp. Primary UI is black. brand.500 is the base
  // used by buttons/icons/active states across the app.
  brand: {
    50: '#F2F2F2',
    100: '#D9D9D9',
    200: '#B3B3B3',
    300: '#808080',
    400: '#333333',
    500: '#0A0A0A',
    600: '#000000',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
  inkSoft: 'rgba(10, 10, 10, 0.05)',

  // red accent. TINY HIGHLIGHTS ONLY. Oxblood from the J13 cover art.
  accent: {
    500: '#9B2D2D',
    600: '#7A2323',
    soft: 'rgba(155, 45, 45, 0.08)',
  },

  gold: '#C9A24B',
  goldSoft: 'rgba(201, 162, 75, 0.10)',
  success: '#1B8845',
  warn: '#B45309',
  danger: '#B91C1C',
}

const fonts = {
  heading: `'General Sans', system-ui, -apple-system, sans-serif`,
  body: `'General Sans', system-ui, -apple-system, sans-serif`,
  display: `'General Sans', system-ui, -apple-system, sans-serif`,
  mono: `'JetBrains Mono', ui-monospace, monospace`,
}

const radii = {
  card: '16px',
  cardLg: '20px',
  pill: '980px',
  input: '12px',
}

const styles = {
  global: {
    'html, body': {
      bg: 'bg',
      color: 'ink',
      fontFamily: 'body',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    '::selection': {
      background: 'ink',
      color: 'white',
    },
    'code, kbd, pre, samp': {
      fontFamily: 'mono',
      fontVariantNumeric: 'tabular-nums',
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: 500,
      borderRadius: 'pill',
      letterSpacing: '-0.005em',
    },
    variants: {
      solid: {
        bg: 'ink',
        color: 'white',
        _hover: { bg: 'ink2', _disabled: { bg: 'ink' } },
        _active: { bg: 'black' },
      },
      outline: {
        borderColor: 'lineStrong',
        color: 'ink',
        _hover: { bg: 'surface' },
      },
      ghost: {
        color: 'ink',
        _hover: { bg: 'surface' },
      },
      // tiny-highlight accent button, use sparingly
      accent: {
        bg: 'accent.500',
        color: 'white',
        _hover: { bg: 'accent.600' },
        _active: { bg: 'accent.600' },
      },
    },
    defaultProps: { variant: 'solid', size: 'md' },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'lineStrong',
          borderRadius: 'input',
          bg: 'white',
          _hover: { borderColor: 'inkMuted' },
          _focus: {
            borderColor: 'ink',
            boxShadow: '0 0 0 1px var(--chakra-colors-ink)',
          },
          _placeholder: { color: 'inkDim' },
        },
      },
    },
    defaultProps: { variant: 'outline' },
  },
  Heading: {
    baseStyle: {
      fontFamily: 'display',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'ink',
    },
  },
  FormLabel: {
    baseStyle: {
      fontSize: 'xs',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'inkMuted',
      mb: 2,
    },
  },
}

const fontSizes = {
  'display-xl': 'clamp(34px, 4.5vw, 60px)',
  'display-lg': 'clamp(26px, 2.8vw, 36px)',
  'display-md': 'clamp(20px, 2vw, 26px)',
  'display-sm': '18px',
  'lead': 'clamp(15px, 1.3vw, 17px)',
  'body-lg': '16px',
  'body': '15px',
  'body-sm': '14px',
  'mono-sm': '12px',
  'mono-xs': '11px',
}

const theme = extendTheme({
  colors,
  fonts,
  fontSizes,
  radii,
  styles,
  components,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export default theme