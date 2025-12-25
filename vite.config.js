import { defineConfig } from 'vite'

export default defineConfig({
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
