import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/test/**',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}

export default config
