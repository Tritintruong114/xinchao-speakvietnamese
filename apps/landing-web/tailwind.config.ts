import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import preset from '@xinchao/config-tailwind';

const config: Config = {
  presets: [preset],
  plugins: [typography],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui-web/src/**/*.{js,ts,jsx,tsx,mdx}', // Scan shared UI package
  ],
};
export default config;
