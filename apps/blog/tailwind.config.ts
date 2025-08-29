import type { Config } from 'tailwindcss';
import sharedConfig from '../../packages/ui/tailwind.config.js';

export default {
  ...sharedConfig,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
} satisfies Config;
