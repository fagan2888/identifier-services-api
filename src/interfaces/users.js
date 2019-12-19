/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * API microservice of Identifier Services
 *
 * Copyright (C) 2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-api
 *
 * identifier-services-api program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * identifier-services-api is distributed in the hope that it will be useful,
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

import HttpStatus from 'http-status';
import {ApiError} from '@natlibfi/identifier-services-commons';

import {hasPermission, validateDoc} from './utils';

export default function () {
	return {
		create,
		read,
		update,
		remove,
		changePwd,
		query
	};

	async function create(userProvider, doc, user) {
		try {
			return userProvider.create(doc, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}

	async function read(userProvider, id, user) {
		try {
			return userProvider.read(id, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}

	async function update(userProvider, id, doc, user) {
		validateDoc(doc, 'UserContent');
		if (hasPermission(user, 'users', update)) {
			const result = await userProvider.update(id, doc, user);
			return result;
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function remove(userProvider, id, user) {
		if (hasPermission(user, 'users', 'remove')) {
			try {
				await userProvider.remove(id);
			} catch (err) {
				throw new ApiError(err.status);
			}
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function changePwd(userProvider, doc, user) {
		try {
			await userProvider.changePwd(doc, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}

	async function query(userProvider, doc, user) {
		try {
			return userProvider.query(doc, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}
}
