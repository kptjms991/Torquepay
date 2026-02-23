// TorquePay Bangladesh - Digital Bengal Theme
// 2026 Production-Ready Color System

export const torquepayTheme = {
  colors: {
    // Primary: Deep Forest Green
    primary: {
      50: '#f0f7f4',
      100: '#d9f0e8',
      200: '#b3e0d1',
      300: '#7cc6b0',
      400: '#4aad91',
      500: '#006a4e', // Main brand color
      600: '#005a42',
      700: '#004a37',
      800: '#003d2f',
      900: '#003428',
    },
    // Secondary: Electric Red (Accent)
    accent: {
      50: '#fff5f5',
      100: '#ffe6e6',
      200: '#ffc2c2',
      300: '#ff9999',
      400: '#f66666',
      500: '#f42a41', // Main accent
      600: '#e01f35',
      700: '#cc1a2f',
      800: '#b31628',
      900: '#8f1220',
    },
    // Neutral: Slate
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Background
    bg: {
      light: '#fafaf9',
      default: '#f5f5f3',
      dark: '#1a1a1a',
    },
    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  typography: {
    fonts: {
      display: "'Inter', 'Noto Sans Bengali', sans-serif",
      body: "'Inter', 'Noto Sans Bengali', sans-serif",
      mono: "'Fira Code', monospace",
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  components: {
    card: {
      glassmorphism: 'backdrop-blur-md bg-white/10 border border-white/20',
      standard: 'bg-white rounded-2xl shadow-lg',
      elevated: 'bg-white rounded-2xl shadow-2xl',
    },
    button: {
      primary: 'bg-[#006a4e] hover:bg-[#005a42] text-white font-semibold',
      accent: 'bg-[#f42a41] hover:bg-[#e01f35] text-white font-semibold',
      secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-900 font-semibold',
    },
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
} as const
