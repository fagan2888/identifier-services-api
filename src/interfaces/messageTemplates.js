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

import interfaceFactory from './interfaceModules';
import {removeGroupPrefix, hasPermission} from './utils';

const templateInterface = interfaceFactory('MessageTemplate', 'MessageTemplateContent');

export default function () {
	return {
		create,
		read,
		update,
		remove,
		query
	};

	async function create(db, doc, user) {
		user = {...user, groups: removeGroupPrefix(user)};
		if (hasPermission(user, 'messageTemplates', 'create')) {
			const result = await templateInterface.create(db, doc, user);
			return result;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED);
	}

	async function read(db, id, user) {
		user = {...user, groups: removeGroupPrefix(user)};
		if (hasPermission(user, 'messageTemplates', 'read')) {
			const result = await templateInterface.read(db, id);
			return result;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED);
	}

	async function update(db, id, doc, user) {
		user = {...user, groups: removeGroupPrefix(user)};
		if (hasPermission(user, 'messageTemplates', 'update')) {
			const result = await templateInterface.update(db, id, doc, user);
			return result;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED);
	}

	async function remove(db, id, user) {
		user = {...user, groups: removeGroupPrefix(user)};
		if (hasPermission(user, 'messageTemplates', 'remove')) {
			const result = await templateInterface.remove(db, id);
			return result;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED);
	}

	async function query(db, {queries, offset}, user) {
		user = {...user, groups: removeGroupPrefix(user)};
		if (hasPermission(user, 'messageTemplates', 'query')) {
			const result = await templateInterface.query(db, {queries, offset});
			return result;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED);
	}
}
