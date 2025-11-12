import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        'text-secondary': '#9ca3af',
        'text-tertiary': '#6b7280',
        rating: '#facc15',
        'button-bg': '#374151',
        'button-hover': '#4b5563',
      },
    },
  },
  plugins: [],
};

export default config;
