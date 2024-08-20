import { pathsToModuleNameMapper } from "ts-jest";

import tsconfig from "./tsconfig.json" assert { type: "json" };

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
};
