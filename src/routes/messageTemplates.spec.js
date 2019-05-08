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

import HttpStatus from 'http-status';
import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import fixtureFactory, {READERS} from '@natlibfi/fixura';
import mongoFixturesFactory from '@natlibfi/fixura-mongo';
import {HTTP_PORT} from '../config';
import startApp, {__RewireAPI__ as RewireAPI} from '../app'; // eslint-disable-line import/named

chai.use(chaiHttp);

describe('routes/messageTemplates', () => {
	let requester;
	let mongoFixtures;

	const API_URL = `http://localhost:${HTTP_PORT}`;
	const fixturesPath = [__dirname, '..', '..', 'test-fixtures', 'messageTemplates'];
	const requestPath = '/messageTemplates';
	const {getFixture} = fixtureFactory({root: fixturesPath});

	beforeEach(async () => {        
		mongoFixtures = await mongoFixturesFactory({rootPath: fixturesPath});		        
		RewireAPI.__Rewire__('MONGO_URI', await mongoFixtures.getConnectionString());
		RewireAPI.__Rewire__('API_URL', API_URL);
		
		const app = startApp();

		requester = chai.request(app).keepOpen();
	});

	afterEach(async () => {
		await requester.close();		
		await mongoFixtures.close();
		RewireAPI.__ResetDependency__('MONGO_URI');
		RewireAPI.__ResetDependency__('API_URL');
	});

	describe('#read', () => {        		
		it('Should succeed', async (index = '0') => {            
			const {expectedPayload} = await init(index, true);
			const response = await requester.get(`${requestPath}/foo`);

			expect(response).to.have.status(HttpStatus.OK);
			expect(response.body).to.eql(expectedPayload);
		});
        
		it('Should fail because the resource does not exist', async (index = '1') => {			
			const response = await requester.get(`${requestPath}/foo`);
			expect(response).to.have.status(HttpStatus.NOT_FOUND);			
		});

		it.skip('Should fail because of invalid authentication', async (index = '2') => {
			await init(index);
			
			const response = await requester.get(`${requestPath}/foo`);
			expect(response).to.have.status(HttpStatus.UNAUTHORIZED);			
		});

		it.skip('Should fail because of invalid authorization', async (index = '3') => {
			await init(index);

			const response = await requester.get(`${requestPath}/foo`);
			expect(response).to.have.status(HttpStatus.FORBIDDEN);		
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
		it('Should succeed', async (index = '0') => {            
			const {payload} = await init(index, true);
			const response = await requester
				.post(requestPath)
				.set('Content-Type', 'application/json')
				.send(payload);

			expect(response).to.have.status(HttpStatus.CREATED);
			expect(response).to.have.header('Location', `${API_URL}/${requestPath}/foo`);
		});
        
		async function init(index, getFixtures = false) {					
			await mongoFixtures.populate(['create', index, 'dbContents.json']);
			
			if (getFixtures) {				
				return {
					payload: getFixture(['read', index, 'payload.json']),					
				};
			}			            			
		}
	});
});
