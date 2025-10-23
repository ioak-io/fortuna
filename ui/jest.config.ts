import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@/lib/shared/env': '<rootDir>/src/lib/shared/__mocks__/env.ts',
  },
  testPathIgnorePatterns: [
    '<rootDir>/src/components/ui-library/',
    '<rootDir>/src/components/ui-library/ui/',
  ],
  testMatch: [
    "**/?(*.)+(spec|test).ts?(x)",
    "**/?(*.)+(unit|a11y).test.ts?(x)",
  ],
};

export default createJestConfig(config);
