require("dotenv").config();

import { dirname } from "path";
import babel from "rollup-plugin-babel";
import tslint from "rollup-plugin-tslint";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import strip from "rollup-plugin-strip";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

import pkg from "./package.json";

const input = "./src/index.ts";
const extensions = [".js", ".jsx", ".ts", ".tsx"];

// Treat as externals all not relative and not absolute paths
// e.g. 'react'
const excludeAllExternals = id => !id.startsWith(".") && !id.startsWith("/");

const getBabelOptions = ({ useESModules }) => ({
  exclude: "node_modules/**",
  runtimeHelpers: true,
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
        useESModules,
        absoluteRuntime: dirname(require.resolve("@babel/runtime/package.json"))
      }
    ]
  ],
  extensions
});

const commonjsArgs = {
  include: "node_modules/**"
};

export default [
  // Universal module definition (UMD) build
  // - including console.* statements
  {
    input,
    output: {
      file: "dist/node-event-emitter.js",
      format: "umd",
      name: "NodeEventEmitter",
      sourcemap: true,
      exports: "named"
    },
    plugins: [
      tslint({ throwOnError: true }),
      resolve({
        extensions
      }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: true })),
      sizeSnapshot()
    ],
    treeshake: false
  },

  // Minified UMD build
  {
    input,
    output: {
      file: "dist/node-event-emitter.min.js",
      format: "umd",
      name: "NodeEventEmitter",
      exports: "named"
    },
    plugins: [
      tslint({ throwOnError: true }),
      babel(getBabelOptions({ useESModules: true })),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      strip({ debugger: true }),
      uglify(),
      sizeSnapshot()
    ],
    treeshake: false
  },

  // CommonJS (cjs) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.main, format: "cjs", sourcemap: true, exports: "named" },
    external: excludeAllExternals,
    plugins: [
      tslint({ throwOnError: true }),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: false })),
      sizeSnapshot()
    ]
  },

  // EcmaScript Module (esm) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.module, format: "esm", sourcemap: true, exports: "named" },
    external: excludeAllExternals,
    plugins: [
      tslint({ throwOnError: true }),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: true })),
      sizeSnapshot()
    ]
  }
];
