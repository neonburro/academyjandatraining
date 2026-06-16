// src/theme/index.js
// Chakra UI v2 theme. Tokens ported from the marketing site's tokens.css so
// the Academy shares the same brand DNA. Display sizes scaled down 15-20%
// from marketing since this is an operational app, not a storytelling site.

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
  brand: {
    50: '#E5F0FA',
    100: '#B8D6F2',
    200: '#8ABDEB',
    300: '#5DA3E3',
    400: '#308ADC',
    500: '#0066CC',
    600: '#003E7E',
    700: '#002C5C',
    800: '#001A39',
    900: '#000917',
  },
  blueSoft: 'rgba(0, 102, 204, 0.08)',
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
      background: 'brand.500',
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
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600', _disabled: { bg: 'brand.500' } },
        _active: { bg: 'brand.700' },
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
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
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
