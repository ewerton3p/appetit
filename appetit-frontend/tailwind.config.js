import primeui from 'tailwindcss-primeui';

export default {
  content: ['./src/**/*.{html,ts}'],
  plugins: [primeui],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
        },
        surface: 'var(--color-surface)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
    }
  }
}
