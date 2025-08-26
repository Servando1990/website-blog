export const themeConfig = {
  fonts: {
    geistSans: 'var(--font-geist-sans)',
    geistMono: 'var(--font-geist-mono)',
    serif: 'var(--font-serif)'
  },
  
  colors: {
    // CSS variables for theme switching
    light: {
      background: '#eeece2', // Warm cream
      foreground: '#000000',
      border: '#e2e0d6',
      muted: '#f5f4f0',
      accent: '#e4e4e7' // Light gray accent
    },
    dark: {
      background: '#000000', // Pure black
      foreground: '#ffffff',
      border: '#1a1a1a',
      muted: '#111111',
      accent: '#e4e4e7' // Light gray accent
    }
  }
}

export const cssVariables = `
:root {
  --font-geist-sans: 'Geist', system-ui, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, monospace;
  --font-serif: ui-serif, Georgia, serif;
  
  /* Light theme variables */
  --background: 46 44 34; /* #eeece2 in HSL */
  --foreground: 0 0 0;
  --border: 44 42 35;
  --muted: 50 48 42;
  --accent: 240 5.9% 90%;
  
  --primary: 0 0 0;
  --primary-foreground: 46 44 34;
  --secondary: 44 42 35;
  --secondary-foreground: 0 0 0;
  --destructive: 0 84 60;
  --destructive-foreground: 0 0 98;
  --popover: 46 44 34;
  --popover-foreground: 0 0 0;
  --card: 46 44 34;
  --card-foreground: 0 0 0;
  --input: 44 42 35;
  --ring: 240 5.9% 90%;
  --radius: 0.5rem;
}

.dark {
  /* Dark theme variables */
  --background: 0 0 0; /* Pure black */
  --foreground: 0 0 100;
  --border: 0 0 10;
  --muted: 0 0 7;
  --accent: 240 5.9% 90%;
  
  --primary: 0 0 100;
  --primary-foreground: 0 0 0;
  --secondary: 0 0 10;
  --secondary-foreground: 0 0 100;
  --destructive: 0 62 30;
  --destructive-foreground: 0 0 98;
  --popover: 0 0 0;
  --popover-foreground: 0 0 100;
  --card: 0 0 0;
  --card-foreground: 0 0 100;
  --input: 0 0 10;
  --ring: 240 5.9% 90%;
}
`;