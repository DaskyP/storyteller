import { defineConfig } from 'vitest/config';
export default defineConfig({
  // ...
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js', // ⬅️ esta línea
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});
