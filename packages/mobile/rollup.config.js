import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
// import typescript from "@rollup/plugin-typescript";
import clear from 'rollup-plugin-clear';
import json from '@rollup/plugin-json';
// import builtins from 'rollup-plugin-node-builtins';

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
      name: '@szero/mobile',
      sourcemap: false,
      inlineDynamicImports: true,
    },
    {
      // file: `es/index${env === "production" ? ".min" : ""}.js`,
      format: 'es',
      dir: 'es',
      sourcemap: false,
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
    'antd-mobile',
    'antd-mobile/es/locale/zh_CN',
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
      targets: ['dist', 'es', 'lib'],
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
      // extract: true, // 是否单独抽离css文件
      sourceMap: false,
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
      // runtimeHelpers: true,
      // plugins: ['@babel/plugin-external-helpers'],
      /**
       * 'runtime' - 如果你要用rollup构建一个js包的时候，使用该配置，该配置要结合@babel/plugin-transform-runtime插件使用，使用@babel/plugin-transform-runtime也要安装@babel/runtime插件
       * 'bundled' - 如果用rollup构建一个项目的用此参数
       * 'inline' 官网不推荐使用，会导致很多重复性代码
       * 'external' 要结合@babel/plugin-external-helpers插件使用，它会把helpers 收集到一个共享模块，我的理解是相当于runtime和bundled一个集合，就是把helpers 抽到一个全局的共享模块但是又不会造成全局的污染
       */
      babelHelpers: 'runtime',
      // babelHelpers: 'external',
      babelrc: false,
      presets: [
        [
          /**
           * targets
           *  如果设置了 targets，那么 babel 就不使用 browserslist 配置，而是使用 targets 配置。
           *  如果targets不配置，browserslist也没有配置，那么@babel/preset-env就对所有ES6语法转换成ES5的。
           * useBuiltIns
           *  false：polyfill就会全部引入。设置后，需要手动引入 polyfill
           *  entry：会根据配置的目标环境引入需要的polyfill。设置后，需要在项目入口处手动引入 polyfill
           *  usage：会根据配置的目标环境，并考虑项目代码里使用到的ES6特性引入需要的polyfill，设置后，不需要手动引入 polyfill
           *  注意，使用'entry'的时候，只能import polyfill一次，一般都是在入口文件。如果进行多次import，会发生错误
           * corejs
           *  这个参数项只有useBuiltIns设置为'usage'或'entry'时，才会生效。
           *  3 || 2 默认值
           * modules
           *  该项用来设置是否把ES6的模块化语法改成其它模块化语法
           *  "amd" || "umd" || "systemjs" || "commonjs" || "cjs" || false || "auto"默认值
           *  在该参数项值是 'auto' 或不设置的时候，会发现我们转码前的代码里es6 的 import都被转码成 commonjs 的 require了
           */
          '@babel/preset-env',
          {
            modules: false,
            // loose: true,
            useBuiltIns: 'usage',
            // useBuiltIns: 'entry',
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
        // "@babel/plugin-proposal-class-properties": "^7.18.6",
        // "@babel/plugin-proposal-decorators": "^7.21.0",
        // "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
        // "@babel/plugin-transform-react-display-name": "^7.18.6",
        // ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
        // ['@babel/plugin-proposal-decorators', { legacy: true }],
        // ['@babel/plugin-proposal-class-properties', { loose: true }],
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
