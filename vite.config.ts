import autoprefixer from 'autoprefixer';
import path from 'path';
import px2rem from 'postcss-plugin-px2rem';
import postcssPresetEnv from 'postcss-preset-env';
import tailwind from 'tailwindcss';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import tailwindConfig from './tailwind.config.js';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        px2rem({
          rootValue: 16,
          propBlackList: ['font-size', 'border', 'border-width'],
          exclude: /(node_module)/,
        }),
        tailwind(tailwindConfig),
        autoprefixer(),
      ],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
      ],
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      safari10: true,
    },
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // manualChunks(id) {
        //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   // @ts-ignore
        //   if (id.includes('components')) {
        //     // packs all /components/*.vue files into components.js
        //     return 'components';
        //   }
        // },
      },
    },
  },
});
