/**
 * Rollup configuration for packaging the plugin in a module that is consumable
 * by either CommonJS (e.g. Node or Browserify) or ECMAScript (e.g. Rollup).
 *
 * These modules DO NOT include their dependencies as we expect those to be
 * handled by the module system.
 */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/plugin.js',
  output: [
    {
      file: 'dist/videojs-http-source-selector.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/videojs-http-source-selector.es.js',
      format: 'es'
    }
  ],
  external: [
    'global',
    'global/document',
    'global/window',
    'video.js'
  ],
  plugins: [
    json(),
    resolve({
      mainFields: ['browser', 'main'] // Fix deprecated options
    }),
    babel({
      babelrc: false,
      babelHelpers: 'bundled', // Ensure helpers are bundled properly
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          loose: true,
          modules: false,
          exclude: ['@babel/plugin-transform-classes']
        }]
      ],
      plugins: [
        '@babel/transform-object-assign'
      ]
    })
  ]
};
