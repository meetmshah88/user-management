module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
};
