import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // Ignorar arquivos CSS/SCSS/etc
    transformMode: {
      web: [/.[tj]sx$/]
    }
  }
})
