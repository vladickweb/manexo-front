import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
	{
		ignores: ['dist', 'eslint.config.js'],
		files: ['**/*.{ts,tsx,js,jsx}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.browser, JSX: 'readonly' },
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: process.cwd()
			}
		},
		plugins: {
			'@typescript-eslint': tsEslintPlugin,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: prettier,
			'simple-import-sort': simpleImportSort
		},
		rules: {
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true }
			],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'prettier/prettier': 'error',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^react$', '^react/.*', '^react-dom$', '^react-dom/.*'],
						['^@(?!/)', '^(?![@./])'],
						['^@/'],
						['^\\.\\./', '^\\./'],
						['^.+\\.(css|scss)$']
					]
				}
			],
			'simple-import-sort/exports': 'error'
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
	}
]
