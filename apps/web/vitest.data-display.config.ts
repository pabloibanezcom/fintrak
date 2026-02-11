import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/components/data-display/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/data-display/BankAccountCard/BankAccountCard.tsx',
        'src/components/data-display/InvestmentCard/InvestmentCard.tsx',
        'src/components/data-display/SpendingLimitBar/SpendingLimitBar.tsx',
        'src/components/data-display/StatCard/StatCard.tsx',
        'src/components/data-display/TransactionList/TransactionList.tsx',
        'src/components/data-display/WalletCard/WalletCard.tsx',
      ],
      exclude: ['src/components/**/*.test.tsx', 'src/components/**/index.ts'],
      thresholds: {
        statements: 93,
        lines: 93,
        functions: 94,
        branches: 84,
      },
    },
  },
});
