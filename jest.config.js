const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // root of app
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // optional if using @/ imports
  },
};

module.exports = createJestConfig(customJestConfig);
