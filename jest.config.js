/** 
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const testType = process.env.TEST_TYPE;

let setupFilesAfterEnv = [];

if (testType === 'e2e') {
    setupFilesAfterEnv = ['./src/__test__/setup/jest.setup.e2e.js'];
}

const config = {
  clearMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: setupFilesAfterEnv,
  testEnvironment: "jest-environment-node",
  testMatch: testType === 'unit' ? ['**/unit/**/*.test.js'] :
             testType === 'integration' ? ['**/integration/**/*.test.js'] :
             testType === 'e2e' ? ['**/e2e/**/*.test.js'] : ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

module.exports = config;