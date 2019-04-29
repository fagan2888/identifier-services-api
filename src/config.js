import {Utils} from '@natlibfi/melinda-commons';

const {readEnvironmentVariable, parseBoolean} = Utils;

export const HTTP_PORT = readEnvironmentVariable('HTTP_PORT', {
	defaultValue: 8080,
	format: v => Number(v)
});

export const MONGO_URI = readEnvironmentVariable('MONGO_URI', {
	defaultValue: 'mongodb://127.0.0.1/db'
});

export const MONGO_DEBUG = readEnvironmentVariable('MONGO_DEBUG', {
	defaultValue: false,
	format: parseBoolean
});
