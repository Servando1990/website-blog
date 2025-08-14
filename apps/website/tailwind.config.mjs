import sharedConfig from '../../packages/ui/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...sharedConfig,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  plugins: [require("tailwindcss-animate")],
}