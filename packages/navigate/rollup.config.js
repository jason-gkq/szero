import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import clear from "rollup-plugin-clear";

// const pkg = require("./package.json");
// --bundleConfigAsCjs
// Rollup plugins
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from "rollup-plugin-babel";
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from "rollup-plugin-node-resolve";
// 解决rollup.js无法识别CommonJS模块
import commonjs from "rollup-plugin-commonjs";
// 全局替换变量比如process.env
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

const env = process.env.NODE_ENV;

export default {
  // 入口文件我这里在components下统一导出所有自定义的组件
  input: "src/index.ts",
  // 输出文件夹，可以是个数组输出不同格式（umd,cjs,es...）通过env是否是生产环境打包来决定文件命名是否是.min
  output: [
    {
      file: `dist/index.js`,
      format: "umd",
      name: "szero-navigate",
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      format: "es",
      dir: "es",
      sourcemap: true,
    },
  ],
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  onwarn: function (warning) {
    if (warning.code === "THIS_IS_UNDEFINED") {
      return;
    }
  },
  // 插件
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ["dist", "es"],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: true, // default: false
    }),
    resolve({ extensions: [".ts"] }),
    typescript({ useTsconfigDeclarationDir: true }),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: "**/node_modules/**",
      runtimeHelpers: true,
      plugins: ["@babel/plugin-external-helpers"],
    }),
    // 这里有些引入使用某个库的api但报未导出改api通过namedExports来手动导出
    commonjs({}),
    // 全局替换NODE_ENV，exclude表示不包含某些文件夹下的文件
    replace({
      // exclude: 'node_modules/**',
      "process.env.NODE_ENV": JSON.stringify(env || "development"),
    }),
    // 生产环境执行terser压缩代码
    env === "production" && terser(),
    sourceMaps(),
  ],
};
