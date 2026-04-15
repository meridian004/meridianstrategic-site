// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://meridianstrategic.io',
  integrations: [mdx(), sitemap()],
  vite: {
    // tailwindcss() returns Vite Plugin[] — cast resolves an internal type
    // mismatch between Astro's bundled Vite and the plugin's Vite peer.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  build: {
    inlineStylesheets: 'always',
  },
});
