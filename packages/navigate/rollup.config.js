import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';

// Rollup plugins
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/index.js`,
      format: 'umd',
      name: '@szero/navigate',
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
  external: ['react', 'react-dom', '@szero/hooks'],
  plugins: [
    clear({
      targets: ['dist', 'es'],
      watch: true,
    }),
    resolve({ extensions: ['.ts'] }),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs({}),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'runtime',
      // babelHelpers: 'external',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            // useBuiltIns: 'entry',
            useBuiltIns: 'usage',
            corejs: 3,
            debug: true,
          },
        ],
      ],
      plugins: [
        // '@babel/plugin-external-helpers',
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
    replace({
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
    }),
    env === 'production' && terser(),
    sourceMaps(),
    filesize(),
  ],
};
