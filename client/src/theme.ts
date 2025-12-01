import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      50: '#eef9ff',
      100: '#c6ecff',
      200: '#9ddfff',
      300: '#74d2ff',
      400: '#4bc5ff',
      500: '#22b8ff',
      600: '#0093d6',
      700: '#006da0',
      800: '#00486b',
      900: '#002335',
    },
  },
  styles: {
    global: (props: any) => ({
      'html, body, #root': {
        height: '100%',
      },
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '8px',
        fontWeight: '600',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
          color: 'white',
          _hover: { bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.700' },
          _active: { bg: props.colorMode === 'dark' ? 'brand.300' : 'brand.800' },
        }),
      },
    },
  },
});

export default theme;
