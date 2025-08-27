import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue,html}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '16px', lg: '32px' } },
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: { DEFAULT: '#024089', fg: '#1C1C1C', soft: '#FFF6D6', alt: '#FFCC00' },
        brand: {
          blue: { cobalt: '#024089', royal: '#004DA9' },
          kb: { yellow: { positive: '#FFBC00', negative: '#FFCC00' }, gray: '#60584C', dark: '#545045' },
        },
        neutral: { 50: '#F7F8FA', 100: '#F2F4F6', 200: '#E1E3E7', 600: '#4B5563', 700: '#374151', 900: '#111827' },
        info: '#004DA9', warning: '#FFBC00', success: '#0EA5E9', danger: '#DC2626',
      },
      fontSize: {
        'display-1': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-2': ['40px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        h1: ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.35', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '1.35', fontWeight: '700' }],
        h4: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.7' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        caption: ['12px', { lineHeight: '1.5' }],
        micro: ['11px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: { xl: '12px', '2xl': '16px', '3xl': '24px' },
      boxShadow: { soft: '0 2px 10px rgba(0,0,0,0.06)' },
    },
  },
  plugins: [forms, typography],
}
