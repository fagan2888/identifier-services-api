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

import {v4 as uuid} from 'uuid';
import {MongoClient} from 'mongodb';
import {MONGO_URI} from '../config';
import {graphql} from 'graphql';
import schema from '../graphql';

export default function() {
	const client = new MongoClient(MONGO_URI, {useNewUrlParser: true});

	let db;
	client.connect(err => {
		const dbName = 'IdentifierServices';
		db = client.db(dbName);
		console.log(err);
	});

	return {create, read, update, remove, changePwd, query};

	async function create({req}) {
		return graphql(
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
		);
	}

	async function read(val) {
		return val;
	}

	async function update(val) {
		return graphql(
			schema,
			`
				mutation(
					$id: String
					$userId: String
					$defaultLanguage: String
					$timestamp: String
					$user: String
				) {
					updateUser(
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
			{db, val}
		);
	}

	async function remove(params) {
		return graphql(
			schema,
			`
				mutation($id: String, $userId: String) {
					deleteUser(id: $id, userId: $userId) {
						id
					}
				}
			`,
			{db, params}
		);
	}

	async function changePwd(val) {
		return val;
	}

	async function query() {
		return graphql(
			schema,
			'{Users{id, preferences{defaultLanguage}, userId}}',
			db
		);
	}
}
