// jest.config.cjs
module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"], // or adjust as needed
};
