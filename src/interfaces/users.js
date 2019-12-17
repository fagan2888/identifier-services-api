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

import {hasPermission, createLinkAndSendEmail, validateDoc} from './utils';
import interfaceFactory from './interfaceModules';
import {CROWD_URL, CROWD_APP_NAME, CROWD_APP_PASSWORD, PASSPORT_LOCAL_USERS, PRIVATE_KEY_URL} from '../config';
import {formatUrl, mapGroupToRole, checkRoleInGroup, mapRoleToGroup} from '../utils';

const userInterface = interfaceFactory('userMetadata');

export default function () {
	return {
		create,
		read,
		update,
		remove,
		changePwd,
		query
	};

	async function create(userProviderFactory, doc, user) {
		try {
			console.log('userProviderFactory');
		} catch (err) {
			console.log(err);
		}
	}

	async function read(userProviderFactory, id, user) {
		try {
			return userProviderFactory.read(id, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}

	async function update(userProviderFactory, id, doc, user) {
		validateDoc(doc, 'UserContent');
		if (hasPermission(user, 'users', update)) {
			const result = await userProviderFactory.update(id, doc, user);
			return result;
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function remove(userProviderFactory, id, user) {
		if (hasPermission(user, 'users', 'remove')) {
			try {
				await userProviderFactory.remove(id);
			} catch (err) {
				throw new ApiError(err.status);
			}
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function changePwd(userProviderFactory, doc, user) {
		try {
			await userProviderFactory.changePwd(doc, user);
		} catch (err) {
			throw new ApiError(err.status);
		}
	}

	async function query(db, {queries, offset}, user) {
		if (hasPermission(user, 'users', 'query')) {
			if (user.role === 'publisher-admin') {
				const queries = [{
					query: {publisher: user.publisher}
				}];
				return userInterface.query(db, {queries, offset});
			}

			return userInterface.query(db, {queries, offset});
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}
}
