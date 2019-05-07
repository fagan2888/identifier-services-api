import {read} from 'fs';
import User from '../../types/User';

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

export default {
	Query: {
		userMetadata: async ({db, params}) => {
			try {
				return await db
					.collection('userMetadata')
					.findOne(params)
					.then(res => res);
			} catch (err) {
				return err;
			}
		},

		Users: async db => {
			try {
				return await db
					.collection('userMetadata')
					.find()
					.toArray()
					.then(res => res);
			} catch (err) {
				return err;
			}
		},

		usersRequest: async ({db, params}) => {
			try {
				return await db
					.collection('usersRequest')
					.findOne(params)
					.then(res => res);
			} catch (err) {
				return err;
			}
		},

		usersRequests: async db => {
			try {
				return await db
					.collection('usersRequest')
					.find()
					.toArray()
					.then(res => res);
			} catch (err) {
				return err;
			}
		}
	},

	Mutation: {
		createUser: async ({db, req}) => {
			try {
				const newUser = {
					id: req.body.id,
					userId: req.body.userId,
					preferences: {
						defaultLanguage: req.body.preferences.defaultLanguage
					},
					lastUpdated: {
						timestamp: Date.now(),
						user: req.body.lastUpdated.user
					}
				};
				const createdResponse = await db
					.collection('userMetadata')
					.insertOne(newUser)
					.then(res => res.ops);
				return createdResponse[0];
			} catch (err) {
				return err;
			}
		},

		deleteUser: async ({db, params}) => {
			try {
				const deletedUser = await db
					.collection('userMetadata')
					.findOneAndDelete({id: params.id})
					.then(res => res.value);
				return deletedUser;
			} catch (err) {
				return err;
			}
		},

		updateUser: async ({db, req}) => {
			try {
				const updateUser = {
					id: req.params.id,
					userId: req.body.userId,
					preferences: {
						defaultLanguage: req.body.preferences.defaultLanguage
					},
					lastUpdated: {
						timestamp: Date.now(),
						user: req.body.lastUpdated.user
					}
				};
				await db
					.collection('userMetadata')
					.findOneAndUpdate(
						{id: req.params.id},
						{$set: updateUser},
						{upsert: true}
					);
				return updateUser;
			} catch (err) {
				return err;
			}
		},

		createUsersRequest: async ({db, req}) => {
			try {
				const newUserRequest = {
					id: req.body.id,
					userId: req.body.userId,
					state: req.body.state,
					publishers: [req.body.publisher],
					givenName: req.body.givenName,
					familyName: req.body.familyName,
					email: req.body.email,
					notes: [req.body.note],
					lastUpdated: {
						timestamp: Date.now(),
						user: req.body.lastUpdated.user
					}
				};
				const createdResponse = await db
					.collection('usersRequest')
					.insertOne(newUserRequest)
					.then(res => res.ops);
				return createdResponse;
			} catch (err) {
				return err;
			}
		}
	}
};
