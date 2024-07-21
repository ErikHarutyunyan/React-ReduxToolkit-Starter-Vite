import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import svgr from 'vite-plugin-svgr';

import react from '@vitejs/plugin-react-swc';

// import { imagetools } from 'vite-imagetools';
async function getPlugins(env) {
  const plugins = [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
    // imagetools(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 75,
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      webp: {
        quality: 75,
      },
    }),
  ];

  if (env.VITE_MILLION_LINT === 'true') {
    const { vite: millionLintVite } = await import('@million/lint');
    plugins.push(millionLintVite());
  }

  if (env.VITE_MILLION_COMPILER === 'true') {
    const { default: million } = await import('million/compiler');
    plugins.push(million.vite({ auto: true }));
  }

  if (env.VITE_GZIP === 'true') {
    const { default: CompressionPlugin } = await import(
      'vite-plugin-compression'
    );
    plugins.push(
      CompressionPlugin({
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true,
      }),
    );
  }

  if (env.VITE_BROTLI === 'true') {
    const { default: CompressionPlugin } = await import(
      'vite-plugin-compression'
    );
    plugins.push(
      CompressionPlugin({
        algorithm: 'brotliCompress',
        compressionOptions: { level: 11 },
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true,
      }),
    );
  }

  return plugins;
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const plugins = await getPlugins(env);

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@router': path.resolve(__dirname, './src/router'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@components': path.resolve(__dirname, './src/components'),
        '@containers': path.resolve(__dirname, './src/containers'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@helpers': path.resolve(__dirname, './src/helpers'),
        '@services': path.resolve(__dirname, './src/services'),
        '@data': path.resolve(__dirname, './src/data'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@themes': path.resolve(__dirname, './src/themes'),
        '@configs': path.resolve(__dirname, './src/configs'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@public': path.resolve(__dirname, './public'),
      },
    },
    // server: {
    //   port: 3000,
    //   host: true
    // },
    build: {
      // cssMinify: "lightningcss",
      // manifest: true
    },
  };
});
