import { defineConfig } from 'vite'
import adapter from '@sveltejs/adapter-static';
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/tiled3d/'
})
