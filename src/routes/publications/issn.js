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
import {default as bodyParse} from '../utils';
import {publicationsIssnFactory} from '../../interfaces';
import {API_URL} from '../../config';

export default function (db) {
	const publications = publicationsIssnFactory({url: API_URL});
	return new Router()
		.post('/', bodyParse(), create)
		.get('/:id', read)
		.put('/:id', bodyParse(), update)
		.delete('/:id', remove)
		.post('/query', bodyParse(), query)
		.post('/requests', bodyParse(), createRequest)
		.get('/requests/:id', readRequest)
		.delete('/requests/:id', removeRequest)
		.put('/requests/:id', bodyParse(), updateRequest);

	async function create(req, res, next) {
		try {
			const result = await publications.createISSN(db, req.body);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function read(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.readISSN(db, id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function update(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.updateISSN(db, id, req.body);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function remove(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.removeISSN(db, id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function query(req, res, next) {
		try {
			const result = await publications.queryISSN(db);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function createRequest(req, res, next) {
		try {
			const result = await publications.createRequestISSN(db, req.body);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function readRequest(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.readRequestISSN(db, id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function removeRequest(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.removeRequestISSN(db, id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}

	async function updateRequest(req, res, next) {
		const id = req.params.id;
		try {
			const result = await publications.updateRequestISSN(db, id, req.body);
			res.json(result);
		} catch (err) {
			next(err);
		}
	}
}
