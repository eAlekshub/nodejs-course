process.env.NODE_ENV = 'UNITTEST';
export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.ts'],
  coverageDirectory: '<rootDir>/tests/coverage',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest',
};
