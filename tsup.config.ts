import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    types: 'src/types.ts',
    locales: 'src/locales.ts',
    'data/index': 'src/data/index.ts',
    search: 'src/search.ts',
    convert: 'src/convert.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  clean: true,
  target: 'es2020',
  treeshake: true,
  minify: false
})
