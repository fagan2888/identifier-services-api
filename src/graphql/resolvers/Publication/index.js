/* eslint-disable camelcase */
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
		publication_ISBN_ISMN: async ({db, params}) => {
			try {
				return await db
					.collection('Publication_ISBN_ISMN')
					.findOne(params)
					.then(res => res);
			} catch (err) {
				return err;
			}
		},

		Publications_ISBN_ISMN: async db => {
			try {
				return await db
					.collection('Publication_ISBN_ISMN')
					.find()
					.toArray()
					.then(res => res);
			} catch (err) {
				return err;
			}
		}
	},

	Mutation: {
		createPublication: async ({db, req}) => {
			try {
				const newPublication = {
					...req.body,
					lastUpdated: {
						timestamp: `${Date.now()}`,
						user: req.body.lastUpdated.user
					}
				};
				const createdPublication = await db
					.collection('Publication_ISBN_ISMN')
					.insertOne(newPublication)
					.then(res => res.ops);
				return createdPublication[0];
			} catch (err) {
				return err;
			}
		},

		deletePublication: async ({db, params}) => {
			try {
				const deletedUser = await db
					.collection('Publication_ISBN_ISMN')
					.findOneAndDelete({id: params.id})
					.then(res => res.value);
				return deletedUser;
			} catch (err) {
				return err;
			}
		},

		updatePublication: async ({db, req}) => {
			try {
				const updatePublication = {
					...req.body,
					id: req.params.id,
					lastUpdated: {
						timestamp: `${Date.now()}`,
						user: req.body.lastUpdated.user
					}
				};
				await db
					.collection('Publication_ISBN_ISMN')
					.findOneAndUpdate(
						{id: req.params.id},
						{$set: updatePublication},
						{upsert: true}
					);
				return updatePublication;
			} catch (err) {
				return err;
			}
		}
	}
};
