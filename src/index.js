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

import express from 'express';
import cors from 'cors';
import path from 'path';
import Mongoose from 'mongoose';
import {createUsersRouter, createPublishersRouter} from './routes';
import {HTTP_PORT, MONGO_DEBUG} from './config';

async function run() {
	Mongoose.set('debug', MONGO_DEBUG);
	const app = express();

	app.use(cors());

	app.use('/users', createUsersRouter());
	app.use('/publishers', createPublishersRouter());

	app.use('/', express.static(path.join(__dirname, '/')));

	app.listen(HTTP_PORT, () => {
		console.log(HTTP_PORT, 'Started melinda-record-import-api');
	});
}

run();
