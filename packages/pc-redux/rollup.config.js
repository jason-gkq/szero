import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import image from '@rollup/plugin-image';
import terser from '@rollup/plugin-terser';
import nested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/index.js`,
      format: 'umd',
      name: '@szero/pc-redux',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      format: 'es',
      dir: 'es',
      sourcemap: true,
    },
  ],
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
  },
  external: [
    '@ant-design/icons',
    '@ant-design/pro-components',
    'antd',
    'antd/locale/zh_CN',
    'dayjs/locale/zh-cn',
    'dayjs',
    'axios',
    'core-js',
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux-saga',
    'require',
  ],
  plugins: [
    clear({
      targets: ['dist', 'es', 'lib'],
      watch: true,
    }),
    json(),
    image(),
    postcss({
      plugins: [autoprefixer(), nested(), postcssPresetEnv(), cssnano()],
      sourceMap: true,
      extensions: ['.css', '.less'],
    }),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.json'] }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'runtime',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'entry',
            corejs: 3,
            debug: true,
          },
        ],
        '@babel/preset-react',
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            helpers: true,
            version: require('@babel/runtime-corejs3/package.json').version,
            regenerator: true,
          },
        ],
      ],
    }),
    commonjs({
      namedExports: {
        '../../node_modules/redux-logger/dist/redux-logger.js': [
          'createLogger',
        ],
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
    }),
    env === 'production' && terser(),
    sourceMaps(),
    filesize(),
  ],
};
