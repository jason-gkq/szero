import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
// import typescript from "@rollup/plugin-typescript";
import clear from 'rollup-plugin-clear';
import json from '@rollup/plugin-json';
// // import builtins from 'rollup-plugin-node-builtins';

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
// 使rollup可以使用postCss处理样式文件less、css等
import postcss from 'rollup-plugin-postcss';
// 给css3的一些属性加前缀
import autoprefixer from 'autoprefixer';
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
import image from '@rollup/plugin-image';
// 压缩打包代码（这里弃用因为该插件不能识别es的语法，所以采用terser替代）
// import { uglify } from 'rollup-plugin-uglify';
// 压缩打包代码
import terser from '@rollup/plugin-terser';
// import less from "rollup-plugin-less";
// PostCSS plugins
// 处理css定义的变量
// import simplevars from "postcss-simple-vars";
// 处理less嵌套样式写法
import nested from 'postcss-nested';
// 可以提前适用最新css特性（已废弃由postcss-preset-env替代，但还是引用进来了。。。）
// import cssnext from 'postcss-cssnext';
// 替代cssnext
import postcssPresetEnv from 'postcss-preset-env';
// css代码压缩
import cssnano from 'cssnano';

import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

export default {
  // 入口文件我这里在components下统一导出所有自定义的组件
  input: 'src/index.ts',
  // 输出文件夹，可以是个数组输出不同格式（umd,cjs,es...）通过env是否是生产环境打包来决定文件命名是否是.min
  output: [
    {
      file: `dist/index.js`,
      format: 'umd',
      name: '@szero/pc',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      format: 'es',
      dir: 'es',
      sourcemap: true,
    },
  ],
  // 注入全局变量比如jQuery的$这里只是尝试 并未启用
  // globals: {
  //   react: 'React',                                         // 这跟external 是配套使用的，指明global.React即是外部依赖react
  //   antd: 'antd'
  // },
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  onwarn: function (warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }
  },
  // 将模块视为外部模块，不会打包在库中
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
    'react-router-dom',
    'mobx',
    'mobx-react-lite',
    'require',
  ],
  // 插件
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['dist', 'es'],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
    json(),
    image(),
    postcss({
      plugins: [
        // simplevars({}),
        autoprefixer(),
        nested(),
        // cssnext({ warnForDuplicates: false, }),
        postcssPresetEnv(),
        cssnano(),
      ],
      // extract: true,
      sourceMap: true,
      // 处理.css和.less文件
      extensions: ['.css', '.less'],
    }),
    // typescript({
    //   compilerOptions: { lib: ["es5", "es6", "dom"], target: "es5" },
    // }),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.json'] }),
    typescript({ useTsconfigDeclarationDir: true }),
    // 这里有些引入使用某个库的api但报未导出改api通过namedExports来手动导出
    commonjs({}),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'external',
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
      plugins: ['@babel/plugin-external-helpers'],
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
