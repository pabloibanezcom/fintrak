const lightColors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    500: '#2196F3',
    600: '#1976D2',
    700: '#1565C0',
    900: '#0D47A1',
  },
  secondary: {
    50: '#F3E5F5',
    500: '#9C27B0',
    600: '#7B1FA2',
  },
  success: {
    50: '#E8F5E8',
    500: '#4CAF50',
    600: '#388E3C',
  },
  error: {
    50: '#FFEBEE',
    500: '#F44336',
    600: '#D32F2F',
  },
  warning: {
    50: '#FFF3E0',
    500: '#FF9800',
    600: '#F57C00',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
  },
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
};

const darkColors = {
  primary: {
    50: '#0D47A1',
    100: '#1565C0',
    500: '#42A5F5',
    600: '#2196F3',
    700: '#1976D2',
    900: '#E3F2FD',
  },
  secondary: {
    50: '#7B1FA2',
    500: '#CE93D8',
    600: '#BA68C8',
  },
  success: {
    50: '#2E7D32',
    500: '#66BB6A',
    600: '#4CAF50',
  },
  error: {
    50: '#C62828',
    500: '#EF5350',
    600: '#F44336',
  },
  warning: {
    50: '#EF6C00',
    500: '#FFB74D',
    600: '#FF9800',
  },
  neutral: {
    0: '#000000',
    50: '#121212',
    100: '#1E1E1E',
    200: '#2D2D2D',
    300: '#404040',
    400: '#595959',
    500: '#737373',
    600: '#8C8C8C',
    700: '#A6A6A6',
    800: '#BFBFBF',
    900: '#E0E0E0',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#BFBFBF',
    disabled: '#737373',
    inverse: '#000000',
  },
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2D2D2D',
  },
  border: {
    light: '#404040',
    medium: '#595959',
    dark: '#737373',
  },
};

export const createTheme = (isDark: boolean) => ({
  colors: isDark ? darkColors : lightColors,
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },
  spacing: {
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
  },
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
});

export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

export type Theme = ReturnType<typeof createTheme>;