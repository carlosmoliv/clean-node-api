import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  bail: true,
  clearMocks: true,
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  preset: 'ts-jest',
}

export default config
