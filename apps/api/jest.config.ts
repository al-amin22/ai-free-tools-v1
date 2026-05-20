import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  passWithNoTests: true,
  moduleNameMapper: {
    '^@aifreetools/shared-types(.*)$': '<rootDir>/../../../packages/shared-types/src$1',
    '^@aifreetools/tool-configs(.*)$': '<rootDir>/../../../packages/tool-configs/src$1',
    '^@aifreetools/ai-prompts(.*)$': '<rootDir>/../../../packages/ai-prompts/src$1',
    '^@aifreetools/seo-utils(.*)$': '<rootDir>/../../../packages/seo-utils/src$1',
  },
};

export default config;
