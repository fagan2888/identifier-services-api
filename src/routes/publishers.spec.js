/* eslint-disable max-nested-callbacks */

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
import {LOCAL_USERS_TESTING} from '../config';
import fixtureFactory, {READERS} from '@natlibfi/fixura';
import mongoFixturesFactory from '@natlibfi/fixura-mongo';
import startApp, {__RewireAPI__ as RewireAPI} from '../app'; // eslint-disable-line import/named
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import base64 from 'base-64';
import fs from 'fs';
import {formatUrl, auth} from '../utils';

chai.use(chaiHttp);

describe('routes/publishers', () => {
	let requester;
	let mongoFixtures;

	const fixturesPath = [__dirname, '..', '..', 'test-fixtures', 'publishers'];
	const requestPath = 'publishers';
	const {getFixture} = fixtureFactory({root: fixturesPath});

	beforeEach(async () => {
		mongoFixtures = await mongoFixturesFactory({rootPath: fixturesPath, useObjectId: true});
		RewireAPI.__Rewire__('MONGO_URI', await mongoFixtures.getConnectionString());

		const app = await startApp();

		requester = chai.request(app).keepOpen();
	});

	afterEach(async () => {
		await requester.close();
		await mongoFixtures.close();
		RewireAPI.__ResetDependency__('MONGO_URI');
	});

	// async function auth(admin) {
	// 	const res = fs.readFileSync(formatUrl(LOCAL_USERS_TESTING), 'utf-8');
	// 	const result = JSON.parse(res);
	// 	const tok = await requester.post('/auth').set('Authorization', 'Basic ' + base64.encode(result[0].user + ':' + result[0].password));
	// 	return tok.headers.token;
	// }

	// async function pubauth(admin) {
	// 	const res = fs.readFileSync(formatUrl(LOCAL_USERS_TESTING), 'utf-8');
	// 	const result = JSON.parse(res);
	// 	const tok = await requester.post('/auth').set('Authorization', 'Basic ' + base64.encode(result[1].user + ':' + result[1].password));
	// 	return tok.headers.token;
	// }

	// async function systemAuth() {
	// 	const res = fs.readFileSync(formatUrl(LOCAL_USERS_TESTING), 'utf-8');
	// 	const result = JSON.parse(res);
	// 	const tok = await requester.post('/auth').set('Authorization', 'Basic ' + base64.encode(result[2].user + ':' + result[2].password));
	// 	return tok.headers.token;
	// }
	const admin = 0;
	const system = 1;
	const publisherAdmin = 2;
	async function auth(role) {
		const res = fs.readFileSync(formatUrl(LOCAL_USERS_TESTING), 'utf-8');
		const result = JSON.parse(res);
		const tok = await requester.post('/auth').set('Authorization', 'Basic ' + base64.encode(result[role].user + ':' + result[role].password));
		return tok.headers.token;
	}
	// *********************Testing for Publishers starts ************************

	describe('#read Publishers', () => {
		it('Should succeed for admin', async (index = '0') => {
			const {expectedPayload} = await init(index, true);
			const token = await auth(admin, requester);
			const response = await requester.get(`/${requestPath}/5dd69c4d1c9d440000d04f84`).set('Authorization', `Bearer ${token}`);
			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});
		it('Should succeed for publisher-admin', async (index = '1') => {
			const {expectedPayload} = await init(index, true);
			const token = await auth(publisherAdmin);
			const response = await requester.get(`/${requestPath}/5dd69c4d1c9d440000d04f84`).set('Authorization', `Bearer ${token}`);
			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});
		it('Should succeed for public', async (index = '2') => {
			const {expectedPayload} = await init(index, true);
			const response = await requester.get(`/${requestPath}/5dd69c4d1c9d440000d04f84`);
			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});
		it('Should fail because the resource does not exist', async () => {
			const response = await requester.get(`/${requestPath}/foo`);
			expect(response).to.have.status(HttpStatus.NOT_FOUND);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['read', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					expectedPayload: getFixture({components: ['read', index, 'expectedPayload.json'], reader: READERS.JSON})
				};
			}
		}
	});

	describe('#create', () => {
		it('Should create a new Publisher', async (index = '0') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.CREATED);
			const db = await mongoFixtures.dump();
			const {expectedDb} = await init(index, false);
			expect(formatDump(db)).to.eql(expectedDb);
		});

		it('Should fail to create because content is not provided', async (index = '1') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.BAD_REQUEST);
		});

		it('Should fail to create because of invalid syntax', async (index = '2') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.BAD_REQUEST);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['create', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					payload: getFixture({components: ['create', index, 'payload.json'], reader: READERS.JSON})
				};
			}

			return {
				expectedDb: getFixture({components: ['create', index, 'dbExpected.json'], reader: READERS.JSON})
			};
		}

		function formatDump(dump) {
			dump.PublisherMetadata.forEach(doc =>
				Object.values(doc).forEach(field => Object.keys(field).filter(item =>
					item === 'timestamp'
				).forEach(i => delete doc.lastUpdated[i]))
			);
			return dump;
		}
	});

	describe('#update', () => {
		it('Should update Publisher', async (index = '0') => {
			const {payload} = await init(index, true);
			const token = await auth(admin);
			const response = await requester.put(`/${requestPath}/5dd69c4d1c9d440000d04f84`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.OK);
			const db = await mongoFixtures.dump();
			const {expectedDb} = await init(index, false);
			expect(formatDump(db)).to.eql(expectedDb);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['update', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					payload: getFixture({components: ['update', index, 'payload.json'], reader: READERS.JSON})
				};
			}

			return {
				expectedDb: getFixture({components: ['update', index, 'dbExpected.json'], reader: READERS.JSON})
			};
		}

		function formatDump(dump) {
			dump.PublisherMetadata.forEach(doc =>
				Object.values(doc).forEach(field => Object.keys(field).filter(item =>
					item === 'timestamp'
				).forEach(i => delete doc.lastUpdated[i]))
			);
			return dump;
		}
	});
	// *************NOT Implemented in the backend *************************/
	// describe('#delete', () => {
	// 	it('Should delete a publisher', async (index = '0') => {
	// 		await init(index, false);
	// 		const token = await auth(admin);
	// 		const response = await requester.delete(`${requestPath}/5dcebad7d05e8545d96e9899`).set('Authorization', `Bearer ${token}`);
	// 		console.log('response', response.status)
	// 		expect(response).to.have.status(HttpStatus.OK);
	// 		const db = await mongoFixtures.dump();
	// 		const {expectedDb} = await init(index, false);
	// 		expect(db).to.eql(expectedDb);
	// 	});
	// 	async function init(index, getFixtures = false) {
	// 		await mongoFixtures.populate(['delete', index, 'dbContents.json']);
	// 		if (getFixtures) {
	// 			return {
	// 				payload: getFixture({components: ['delete', index, 'payload.json'], reader: READERS.JSON})
	// 			};
	// 		}

	// 		return {
	// 			expectedDb: getFixture({components: ['delete', index, 'dbExpected.json'], reader: READERS.JSON})
	// 		};
	// 	}
	// });

	// ***********************Testing for Publisher requests starts************************

	describe('#read Publishers Requests', () => {
		it('Should succeed for Admin', async (index = '0') => {
			const {expectedPayload} = await init(index, true);
			const token = await auth(admin);
			const response = await requester.get(`/requests/${requestPath}/5cdff4db937aed356a2b5817`).set('Authorization', `Bearer ${token}`);
			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});

		it('Should succeed for System', async (index = '0') => {
			const {expectedPayload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.get(`/requests/${requestPath}/5cdff4db937aed356a2b5817`).set('Authorization', `Bearer ${token}`);
			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});

		it('Should fail because the resource does not exist', async () => {
			const token = await auth(admin);
			const response = await requester.get(`/requests/${requestPath}/foo`).set('Authorization', `Bearer ${token}`);
			expect(response).to.have.status(HttpStatus.NOT_FOUND);
		});

		it('Should fail because the user is not authorize', async () => {
			const response = await requester.get(`/requests/${requestPath}/foo`);
			expect(response).to.have.status(HttpStatus.UNAUTHORIZED);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['requests/read', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					expectedPayload: getFixture({components: ['requests/read', index, 'expectedPayload.json'], reader: READERS.JSON})
				};
			}
		}
	});

	describe('#create Publisher Requests', () => {
		it('Should create a new Publisher Requests', async (index = '0') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/requests/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.OK);
			const db = await mongoFixtures.dump();
			const {expectedDb} = await init(index, false);
			expect(formatDump(db)).to.eql(expectedDb);
		});

		it('Should fail to create because content is not provided', async (index = '1') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/requests/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.BAD_REQUEST);
		});

		it('Should fail to create because of invalid syntax', async (index = '2') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.post(`/requests/${requestPath}`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.BAD_REQUEST);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['requests/create', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					payload: getFixture({components: ['requests/create', index, 'payload.json'], reader: READERS.JSON})
				};
			}

			return {
				expectedDb: getFixture({components: ['requests/create', index, 'dbExpected.json'], reader: READERS.JSON})
			};
		}

		function formatDump(dump) {
			dump.PublisherRequest.forEach(doc =>
				Object.values(doc).forEach(field => Object.keys(field).filter(item =>
					item === 'timestamp'
				).forEach(i => delete doc.lastUpdated[i]))
			);
			return dump;
		}
	});

	describe('#update requests', () => {
		it('Should update Publisher Requests without background procesing state', async (index = '0') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.put(`/requests/${requestPath}/5cdff4db937aed356a2b5817`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.OK);
			const db = await mongoFixtures.dump();
			const {expectedDb} = await init(index, false);
			expect(formatDump(db)).to.eql(expectedDb);
		});
		it('Should update Publisher Requests with background processing state', async (index = '1') => {
			const {payload} = await init(index, true);
			const token = await auth(system);
			const response = await requester.put(`/requests/${requestPath}/5cdff4db937aed356a2b5817`).set('Authorization', `Bearer ${token}`).send(payload);
			expect(response).to.have.status(HttpStatus.OK);
			const db = await mongoFixtures.dump();
			const {expectedDb} = await init(index, false);
			expect(formatDump(db)).to.eql(expectedDb);
		});

		async function init(index, getFixtures = false) {
			await mongoFixtures.populate(['requests/update', index, 'dbContents.json']);
			if (getFixtures) {
				return {
					payload: getFixture({components: ['requests/update', index, 'payload.json'], reader: READERS.JSON})
				};
			}

			return {
				expectedDb: getFixture({components: ['requests/update', index, 'dbExpected.json'], reader: READERS.JSON})
			};
		}

		function formatDump(dump) {
			dump.PublisherRequest.forEach(doc =>
				Object.values(doc).forEach(field => Object.keys(field).filter(item =>
					item === 'timestamp'
				).forEach(i => delete doc.lastUpdated[i]))
			);
			return dump;
		}
	});
	// *****************Not sure whether to implement on the rest api ********************
	// describe('#delete', () => {
	// 	it('Should delete a publisher requests', async (index = '0') => {
	// 		await init(index, false);
	// 		const response = await requester.delete(`${requestPath}/requests/5cdff4db937aed356a2b5817`);
	// 		expect(response).to.have.status(HttpStatus.OK);
	// 		const db = await mongoFixtures.dump();
	// 		const {expectedDb} = await init(index, false);
	// 		expect(db).to.eql(expectedDb);
	// 	});
	// 	async function init(index, getFixtures = false) {
	// 		await mongoFixtures.populate(['requests/delete', index, 'dbContents.json']);
	// 		if (getFixtures) {
	// 			return {
	// 				payload: getFixture({components: ['requests/delete', index, 'payload.json'], reader: READERS.JSON})
	// 			};
	// 		}

	// 		return {
	// 			expectedDb: getFixture({components: ['requests/delete', index, 'dbExpected.json'], reader: READERS.JSON})
	// 		};
	// 	}
	// });
});

