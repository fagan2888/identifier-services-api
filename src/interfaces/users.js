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

import {hasPermission, createLinkAndSendEmail, local, crowd, validateDoc} from './utils';
import interfaceFactory from './interfaceModules';
import {CROWD_URL, CROWD_APP_NAME, CROWD_APP_PASSWORD, PASSPORT_LOCAL_USERS, PRIVATE_KEY_URL} from '../config';
import {mapGroupToRole} from '../utils';

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

	async function create(db, doc, user) {
		if (doc.SSOId) {
			// ¤¤¤¤¤¤¤¤¤¤¤¤ Validate SSOId remains ¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤
			doc.userId = doc.SSOId;
			const {role, givenName, familyName, SSOId, email, ...rest} = {...doc};
			const result = await userInterface.create(db, rest, user);
			return result;
		}

		doc.userId = doc.email;
		validateDoc(doc, 'UserContent');
		if (hasPermission(user, 'users', 'create')) {
			try {
				if (CROWD_URL && CROWD_APP_NAME && CROWD_APP_PASSWORD) {
					const {crowdUser} = crowd();
					await crowdUser.create({doc: doc});
				} else {
					const {localUser} = local();
					await localUser.create({PASSPORT_LOCAL_USERS: PASSPORT_LOCAL_USERS, doc: doc});
				}
			} catch (err) {
				throw new ApiError(err.status);
			}

			const {role, givenName, familyName, email, ...rest} = {...doc};
			const result = await userInterface.create(db, rest, user);
			return result;
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function read(db, id, user) {
		const response = await userInterface.read(db, id);
		let result;
		if (CROWD_URL && CROWD_APP_NAME && CROWD_APP_PASSWORD) {
			const {crowdUser} = crowd();
			result = await crowdUser.read({id: response.userId ? response.userId : response.id});
		} else {
			const {localUser} = local();
			result = await localUser.read({PASSPORT_LOCAL_USERS: PASSPORT_LOCAL_USERS, email: response.userId ? response.userId : response.id}); // Delete id later
			result = {...result, role: mapGroupToRole(result.groups)};
		}

		if (hasPermission(user, 'users', 'read')) {
			// Need to filter user information after combining and before returning to clientSide
			return {...response, ...result};
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function update(db, id, doc, user) {
		validateDoc(doc, 'UserContent');
		if (hasPermission(user, 'users', update)) {
			const result = await userInterface.update(db, id, doc, user);
			return result;
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function remove(db, id, user) {
		if (hasPermission(user, 'users', 'remove')) {
			const response = await userInterface.read(db, id);
			if (CROWD_URL && CROWD_APP_NAME && CROWD_APP_PASSWORD) {
				const {crowdUser} = crowd();
				await crowdUser.remove({id: response.userId ? response.userId : response.id});
			} else {
				const {localUser} = local();
				await localUser.remove({PASSPORT_LOCAL_USERS: PASSPORT_LOCAL_USERS, id: response.userId ? response.userId : response.id});
			}

			const result = await userInterface.remove(db, id);
			return result;
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}

	async function changePwd(doc, user) {
		if (doc.newPassword) {
			if (hasPermission(user, 'users', 'changePwd')) {
				if (CROWD_URL && CROWD_APP_NAME && CROWD_APP_PASSWORD) {
					const {crowdUser} = crowd();
					await crowdUser.update({doc});
				}

				const {localUser} = local();
				await localUser.update({PASSPORT_LOCAL_USERS: PASSPORT_LOCAL_USERS, user: doc});
			} else {
				throw new ApiError(HttpStatus.FORBIDDEN);
			}
		} else {
			const result = await createLinkAndSendEmail({request: doc, PRIVATE_KEY_URL: PRIVATE_KEY_URL, PASSPORT_LOCAL_USERS: PASSPORT_LOCAL_USERS});
			if (result !== undefined && result.status === 404) {
				throw new ApiError(HttpStatus.NOT_FOUND);
			}

			return result;
		}
	}

	async function query(db, {queries, offset}, user) {
		if (hasPermission(user, 'users', 'query')) {
			if (user.role === 'publisher-admin') {
				const queries = [{
					query: {publisher: 'publisher-admin'}
				}];
				return userInterface.query(db, {queries, offset});
			}

			return userInterface.query(db, {queries, offset});
		}

		throw new ApiError(HttpStatus.FORBIDDEN);
	}
}
