/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Shared modules for microservices of Melinda record batch import system
 *
 * Copyright (C) 2018-2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of melinda-record-import-commons
 *
 * melinda-record-import-commons program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * melinda-record-import-commons is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */
import {Utils, parseBoolean} from '@natlibfi/melinda-commons';

const {readEnvironmentVariable} = Utils;

export const API_URL = readEnvironmentVariable('API_URL', {
	defaultValue: 'http://localhost:8080'
});
export const HTTP_PORT = readEnvironmentVariable('HTTP_PORT', {
	defaultValue: 8080,
	format: v => Number(v)
});

// export const MONGO_URI = readEnvironmentVariable('API_URI', {defaultValue:'mongodb:127.0.0.1/db'});
export const MONGO_DEBUG = readEnvironmentVariable('MONGO_DEBUG', {
	defaultValue: false,
	format: parseBoolean
});
