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

import testSuiteFactory from './testUtils';

describe('app', () => {
	const generateTestSuite = testSuiteFactory({
		rootPath: [__dirname, '..', '..', 'test-fixtures', 'ranges']
	});
	describe('ranges', () => {
		describe('#readIsbn', generateTestSuite('isbn', 'read'));
		describe('#createIsbn', generateTestSuite('isbn', 'create'));
		describe('#updateIsbn', generateTestSuite('isbn', 'update'));
		describe('#queryIsbn', generateTestSuite('isbn', 'query'));
		describe('#readIsmn', generateTestSuite('ismn', 'read'));
		describe('#createIsmn', generateTestSuite('ismn', 'create'));
		describe('#updateIsmn', generateTestSuite('ismn', 'update'));
		describe('#queryIsmn', generateTestSuite('ismn', 'query'));
		describe('#createIssn', generateTestSuite('issn', 'create'));
		describe('#readIssn', generateTestSuite('issn', 'read'));
		describe('#updateIssn', generateTestSuite('issn', 'update'));
		describe('#queryIssn', generateTestSuite('issn', 'query'));
	});
});
