import { fileURLToPath } from 'url'
import path from 'path'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
	{
		ignores: ['dist'],
		files: ['**/*.{ts,tsx,js,jsx}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: { ...globals.browser, JSX: 'readonly' },
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.eslint.json',
				tsconfigRootDir: __dirname
			}
		},
		plugins: {
			'@typescript-eslint': tsEslintPlugin,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: prettier
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
			'prettier/prettier': 'error'
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
	}
]
