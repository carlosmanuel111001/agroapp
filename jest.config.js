module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-button|@react-native-community|@react-native|@react-native-firebase/app|@react-native-firebase/firestore)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/path/to/ignore/'],
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
