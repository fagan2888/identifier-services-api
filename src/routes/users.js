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
import bodyParser from 'body-parser';
import validateContentType from '@natlibfi/express-validate-content-type';
import {graphql} from 'graphql';

import {usersFactory} from '../interfaces';
import {API_URL} from '../config';
import schema from '../graphql';
import resolver from '../graphql/resolvers';

export default function(db) {
	const users = usersFactory({url: API_URL});

	return new Router()
		.post(
			'/',
			// validateContentType({
			// 	type: ['application/json', 'application/x-www-form-urlencoded']
			// }),
			bodyParser.urlencoded({extended: false}),
			bodyParser.json({
				type: ['application/json', 'application/x-www-form-urlencoded']
			}),
			create
		)
		.get('/:id', read)
		.put('/:id', update)
		.delete('/:id', remove)
		.post('/:id/password', changePwd)
		.post('/query', query);

	async function create(req, res, next) {
		try {
			graphql(
				schema,
				`
					mutation(
						$id: String
						$userId: String
						$defaultLanguage: String
						$timestamp: String
						$user: String
					) {
						createUser(
							id: $id
							userId: $userId
							defaultLanguage: $defaultLanguage
							timestamp: $timestamp
							user: $user
						) {
							id
							userId
							preferences {
								defaultLanguage
							}
							lastUpdated {
								timestamp
								user
							}
						}
					}
				`,
				{db, req}
			).then(response => res.json(response));
		} catch (err) {
			next(err);
		}
	}

	async function read(req, res, next) {
		try {
			res.json(req.params);
		} catch (err) {
			next(err);
		}
	}

	async function update(req, res, next) {
		try {
			res.json(req.body);
		} catch (err) {
			next(err);
		}
	}

	async function remove(req, res, next) {
		const params = req.params;
		try {
			graphql(
				schema,
				`
					mutation($id: String, $userId: String) {
						deleteUser(id: $id, userId: $userId) {
							id
						}
					}
				`,
				{db, params}
			).then(response => res.json(response));
		} catch (err) {
			next(err);
		}
	}

	async function changePwd(req, res, next) {
		try {
			res.json(req.body);
		} catch (err) {
			next(err);
		}
	}

	async function query(req, res, next) {
		try {
			graphql(
				schema,
				'{Users{id, preferences{defaultLanguage}, userId}}',
				db
			).then(response => res.json(response));
		} catch (err) {
			next(err);
		}
	}
}
