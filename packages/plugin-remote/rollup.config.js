import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';

// const pkg = require("./package.json");
// --bundleConfigAsCjs
// Rollup plugins
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import { babel } from '@rollup/plugin-babel';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from '@rollup/plugin-node-resolve';
// 解决rollup.js无法识别CommonJS模块
import commonjs from '@rollup/plugin-commonjs';
// 全局替换变量比如process.env
import replace from '@rollup/plugin-replace';
// 压缩打包代码
import terser from '@rollup/plugin-terser';

import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/index.js`,
      format: 'umd',
      name: 'plugin-remote',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      format: 'es',
      dir: 'es',
      sourcemap: true,
    },
  ],
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
  },
  // 将模块视为外部模块，不会打包在库中
  external: ['antd', 'react'],
  // 插件
  plugins: [
    clear({
      targets: ['dist', 'es', 'lib'],
      watch: true, // default: false
    }),
    resolve({ extensions: ['.ts', '.tsx'] }),
    typescript({ useTsconfigDeclarationDir: true }),
    // 这里有些引入使用某个库的api但报未导出改api通过namedExports来手动导出
    commonjs({}),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: '**/node_modules/**',
      // babelHelpers: 'external',
      babelHelpers: 'runtime',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            // useBuiltIns: 'usage',
            useBuiltIns: 'entry',
            corejs: 3,
            debug: true,
          },
        ],
        // 对jsx语法进行转换
        '@babel/preset-react',
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
    // 全局替换NODE_ENV，exclude表示不包含某些文件夹下的文件
    replace({
      // exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(env || 'development'),
    }),
    // 生产环境执行terser压缩代码
    env === 'production' && terser(),
    sourceMaps(),
    filesize(),
  ],
};
