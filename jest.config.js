/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  bail: true,
  clearMocks: true,
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: "v8",
  testEnvironment: 'node',
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  preset: "ts-jest",
};
