import typescript from '@rollup/plugin-typescript';
import terser from "@rollup/plugin-terser";

export default [
  {
    input: 'src/Logger.ts',
    output: [
      {
        file: 'lib/Logger.cjs.js', // CommonJS format for Node.js
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'lib/Logger.esm.js', // ES module format for modern browsers and bundlers
        format: 'esm',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: 'src/Logger.ts',
    output: {
      file: 'lib/Logger.umd.js', // UMD format for browser global usage
      format: 'umd',
      name: 'woodchuck', // Global variable name
      exports: 'named',
    },
    plugins: [typescript()],
  },
  {
    input: 'src/Logger.ts',
    output: {
      file: 'lib/Logger.umd.min.js', // UMD format for browser global usage
      format: 'umd',
      name: 'woodchuck', // Global variable name
      exports: 'named',
    },
    plugins: [typescript(),terser()],
  },
];
