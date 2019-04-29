/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * API microservice of Melinda record batch import system
 *
 * Copyright (C) 2018-2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of melinda-record-import-api
 *
 * melinda-record-import-api program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * melinda-record-import-api is distributed in the hope that it will be useful,
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
import {Mongoose} from 'mongoose';
import {PublisherModel} from './models';

export default function({url}) {
	// Mongoose.model('Publisher', PublisherModel);
	return {create, read, update, remove, query, newPublication};

	async function query({
		profile,
		contentType,
		state,
		creationTime,
		modificationTime,
		user
	}) {
		// const publishers = await Mongoose.models.PublisherMetadata.find();
		// const permittedPublishers = await filterPermitted();
		// return filterPermitted.filter(applyFilters).map(publisher => ({
		// 	id: publisher.id,
		// 	url: `${url}/publishers/${publishers.id}`
		// }));
		// async function filterPermitted() {
		// 	const filtered = await Promise.all(
		// 		publishers.map(async obj => {
		// 			const publisher = await getPublisher(obj.profile);
		// 			// if (hasPermission(profile, user)) {
		// 			return publisher;
		// 			// }
		// 		})
		// 	);
		// 	return filtered.filter(v => v);
		// }
		// function applyFilters(publisher) {
		// 	if (state && !state.includes(publisher.state)) {
		// 		return false;
		// 	}
		// 	if (profile && !profile.includes(publisher.profile)) {
		// 		return false;
		// 	}
		// 	if (contentType && !contentType.includes(publisher.contentType)) {
		// 		return false;
		// 	}
		// 	if (creationTime && !timeInRange(publisher.creationTime, creationTime)) {
		// 		return false;
		// 	}
		// 	if (
		// 		modificationTime &&
		// 		!timeInRange(publisher.modificationTime, modificationTime)
		// 	) {
		// 		return false;
		// 	}
		// 	return true;
		// 	function timeInRange(contextStr, [startStr, endStr]){
		// 	}
		// }
		console.log('query');
	}

	async function read({id}) {
		return {
			id: 'foo',
			lastUpdated: {
				timestamp: 'foo',
				user: 'foo'
			},
			name: 'foo',
			language: 'foo',
			activity: {
				active: true
			},
			streetAddress: {
				address: 'foo',
				city: 'foo',
				zip: 'foo'
			},
			email: 'foo@bar.com',
			website: 'foo'
		};
	}

	async function create({inputStream, publisher, contentType, user}) {
		console.log(inputStream, publisher, contentType, user);
	}

	async function update({id, payload, user}) {
		console.log(id, payload, user);
	}

	async function remove({id, user}) {
		console.log(id, user);
	}

	async function newPublication({inputStream, contentType, user}) {
		console.log(user);
	}

	// async function getPublisher(id) {
	// 	const profile = await Mongoose.models.Publisher.findOne({id});

	// 	if (publisher) {
	// 		return publisher;
	// 	}
	// }
}
