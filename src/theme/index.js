// src/theme/index.js
// Chakra UI v2 theme tokens carrying the Janda brand DNA into the Academy.
// Mirrors the marketing site palette so the Academy feels like the same brand.

import { extendTheme } from '@chakra-ui/react'

const colors = {
  bg: '#FAFAF7',
  surface: '#F2F2EE',
  surface2: '#E8E8E3',
  ink: '#0A0A0A',
  ink2: '#1D1D1F',
  inkMuted: '#4A4A4F',
  inkDim: '#86868B',
  line: 'rgba(10, 10, 10, 0.08)',
  lineStrong: 'rgba(10, 10, 10, 0.16)',
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
  gold: '#C9A24B',
}

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  display: `'Instrument Serif', Georgia, serif`,
  mono: `'JetBrains Mono', ui-monospace, monospace`,
}

const styles = {
  global: {
    'html, body': {
      bg: 'bg',
      color: 'ink',
      fontFamily: 'body',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '::selection': {
      background: 'brand.500',
      color: 'white',
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: 500,
      borderRadius: 'full',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
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
    defaultProps: {
      variant: 'solid',
      size: 'md',
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'lineStrong',
          bg: 'white',
          _hover: { borderColor: 'inkMuted' },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
  },
}

const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export default theme
