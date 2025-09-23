export const colors = {
  // App theme colors matching Figma design
  background: {
    primary: '#161622',
    secondary: '#1E1E2D',
    tertiary: '#2A2A3A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#7E848D',
    expense: '#FF6B6B', // Light red for expense amounts
    disabled: '#5A5A6B',
    inverse: '#FFFFFF',
  },
  border: {
    light: '#3A3A4A',
    primary: '#0066FF',
  },
  accent: {
    primary: '#0066FF',
    error: '#FF6B6B',
  },
  // Add some primary colors for button variants (keeping compatibility)
  primary: {
    50: '#E6F3FF',
    500: '#0066FF',
    600: '#0056D6',
  },
  secondary: {
    500: '#7E848D',
  },
  error: {
    500: '#FF6B6B',
  },
  neutral: {
    0: '#FFFFFF',
  },
} as const;