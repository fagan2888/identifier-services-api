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

import {Router} from 'express';
import {publishersFactory} from '../interfaces';
import {API_URL} from '../config';

export default function() {
	const publishers = publishersFactory({url: API_URL});
	return new Router()
		.post('/', create)
		.get('/:id', read)
		.put('/:id', update)
		.delete('/:id', remove)
		.post('/query', query)
		.post('/:id/publications', newPublication);

	async function query(req, res, next) {
		try {
			const queryParams = getQueryParams();
			const result = await publishers.query({...queryParams, user: req.user});
			res.json(result);
		} catch (err) {
			next(err);
		}

		function getQueryParams() {
			const KEYS = [
				'state',
				'profile',
				'contentType',
				'creationTime',
				'modificationTime'
			];
			return Object.keys(req.query)
				.filter(k => KEYS.includes(k))
				.reduce((acc, k) => {
					const value = req.query[k];
					return {...acc, [k]: Array.isArray(value) ? value : [value]};
				}, {});
		}
	}

	async function read(req, res, next) {
		try {
			const result = await publishers.read({
				id: req.params.id,
				publisher: req.publisher
			});
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function update(req, res, next) {
		try {
			await publishers.update({
				id: req.params.id,
				user: req.user,
				payload: req.body
			});
		} catch (err) {
			next(err);
		}
	}

	async function remove(req, res, next) {
		try {
			await publishers.remove({id: req.params.id, user: req.user});
		} catch (err) {
			next(err);
		}
	}

	async function create(req, res, next) {
		try {
			console.log(req.body);
		} catch (err) {
			next(err);
		}
	}

	async function newPublication(req, res, next) {
		try {
			console.log(req.body);
		} catch (err) {
			next(err);
		}
	}
}
