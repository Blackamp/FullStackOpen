module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.app.json',  // incluye src
      './tsconfig.node.json'  // incluye vite.config.ts
    ],
  },
  settings: {
    react: {
      version: 'detect', // Detecta automáticamente la versión de React
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'react/react-in-jsx-scope': 'off', // <- Desactiva esta regla para React 17+
  },
}
