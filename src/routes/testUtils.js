
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
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import HttpStatus from 'http-status';
import fixtureFactory, {READERS} from '@natlibfi/fixura';
import mongoFixturesFactory from '@natlibfi/fixura-mongo';
import startApp, {__RewireAPI__ as RewireAPI} from '../app'; // eslint-disable-line import/named
import {readdirSync} from 'fs';
import {join as joinPath} from 'path';
import {PASSPORT_LOCAL_USERS} from '../config';
import {ApiError} from '@natlibfi/identifier-services-commons/dist/error';
import base64 from 'base-64';
// import fs from 'fs';
// import {formatUrl} from '../utils';

chai.use(chaiHttp);

export default ({rootPath}) => {
	let requester;
	let mongoFixtures;

	after(() => {
		RewireAPI.__ResetDependency__('MONGO_URI');
	});

	afterEach(async () => {
		await requester.close();
		await mongoFixtures.close();
	});

	return (...args) => {
		return async () => {
			const dir = rootPath.concat(args);
			const {getFixture} = fixtureFactory({root: dir});
			const subDirs = readdirSync(joinPath.apply(undefined, dir));
			return iterate();

			async function iterate() {
				const sub = subDirs.shift();

				if (sub) {
					const {descr, skip, expectedPayload, requestUrl, username, password} = getData(sub);
					if (skip) {
						it.skip(`${sub} ${descr}`);
					} else {
						it(`${sub} ${descr}`, async () => {
							mongoFixtures = await mongoFixturesFactory({rootPath: dir, useObjectId: true});
							RewireAPI.__Rewire__('MONGO_URI', await mongoFixtures.getConnectionString());
							RewireAPI.__Rewire__('PASSPORT_LOCAL_USERS', PASSPORT_LOCAL_USERS);
							const app = await startApp();
							requester = chai.request(app).keepOpen();

							if (expectedPayload) {
								await mongoFixtures.populate([sub, 'dbContents.json']);
								const token = await auth(username, password);
								const response = await requester.get(requestUrl).set('Authorization', `Bearer ${token}`);
								expect(response).to.have.status(HttpStatus.OK);
							}
						});
					}

					// iterate();
				}
			}

			function getData(subDir) {
				const {descr, requestUrl, skip, username, password} = getFixture({
					components: [subDir, 'metadata.json'],
					reader: READERS.JSON
				});

				if (skip) {
					return {descr, skip};
				}

				try {
					const expectedPayload = getFixture({
						components: [subDir, 'expectedPayload.json'],
						reader: READERS.JSON
					});
					return {expectedPayload, descr, requestUrl, username, password};
				} catch (err) {
					if (err.code === 'ENOENT') {
						return {descr, requestUrl};
					}

					throw new ApiError(err.status);
				}
			}

			async function auth(username, password) {
				const result = await requester.post('/auth').set('Authorization', 'Basic ' + base64.encode(username + ':' + password)
				);
				return result.headers.token;
			}
		};
	};
};
