import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
        ["@babel/plugin-proposal-class-properties"],
        ["@babel/plugin-transform-class-static-block"]
      ]
    }
  })],
  resolve: {
    alias: {
      'tldraw/tldraw.css': path.resolve(__dirname, '../tldraw/packages/tldraw/tldraw.css'),
      'tldraw': path.resolve(__dirname, '../tldraw/packages/tldraw/src/index.ts'),
      '@tldraw/editor': path.resolve(__dirname, '../tldraw/packages/editor/src/index.ts'),
      '@tldraw/store': path.resolve(__dirname, '../tldraw/packages/store/src/index.ts'),
      '@tldraw/state': path.resolve(__dirname, '../tldraw/packages/state/src/index.ts'),
      '@tldraw/state-react': path.resolve(__dirname, '../tldraw/packages/state-react/src/index.ts'),
      '@tldraw/tlschema': path.resolve(__dirname, '../tldraw/packages/tlschema/src/index.ts'),
      '@tldraw/utils': path.resolve(__dirname, '../tldraw/packages/utils/src/index.ts'),
      '@tldraw/validate': path.resolve(__dirname, '../tldraw/packages/validate/src/index.ts'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  },
  esbuild: {
    target: 'esnext',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true
      }
    }
  },
  build: {
    // Bump the warning threshold; the bundle is large because tldraw + Radix ship many UI components
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // Silence Radix "use client" directives, which are safe to ignore when bundling
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) return
        warn(warning)
      }
    }
  }
})
