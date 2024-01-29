import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.cjs',
  }),
  minify: true,
  dts: true,
})
