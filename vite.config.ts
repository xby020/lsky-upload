import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { UserConfigExport, ConfigEnv, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    base: './',
    plugins: [
      vue(),
      UnoCSS(),
      Components({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components'],
        resolvers: [IconsResolver()],
      }),

      AutoImport({
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
        },
        imports: [
          // presets
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
        ],
        resolvers: [
          IconsResolver({
            prefix: 'icon',
          }),
        ],
      }),

      // auto import icons
      Icons({ compiler: 'vue3' }),
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@pages': resolve(__dirname, './src/pages'),
      },
    },

    json: {
      // see https://cn.vitejs.dev/config/shared-options.html#json-stringify
      stringify: true,
    },

    preview: {
      open: true,
    },

    // build: {
    //   assetsDir: '/',
    // },

    server: {
      port: Number(env.VITE_PORT) || 14514,
      proxy: {
        '/api/v1': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => path.replace(new RegExp(`^/api/v1`), '')
        },
      },
    },
  };
};
