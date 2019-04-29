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
<<<<<<< HEAD
// import {Utils} from '@natlibfi/melinda-commons';
import express from 'express';
import cors from 'cors';
import path from 'path';
import {createUsersRouter, createPublishersRouter} from './routes';
import Mongoose from 'mongoose';
import {MONGO_URI, HTTP_PORT, MONGO_DEBUG} from './config';

// const {createLogger, handleInterrupt} = Utils;

async function run() {
	// Mongoose.set('debug', MONGO_DEBUG);
	// const Logger = createLogger();

	const app = express();

	// await Mongoose.connect(MONGO_URI, {useNewUrlParser: true});

	app.use(cors());
	app.get('/', (req, res) => {
		console.log('works');
	});
	app.use('/users', createUsersRouter());
	app.use('/publishers', createPublishersRouter());

	app.listen(HTTP_PORT, () => {
		// Logger.log('info', 'Started melinda-record-import-api');
		console.log('server running');
=======

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

	app.listen(HTTP_PORT, () => {
		console.log(HTTP_PORT, 'Started melinda-record-import-api');
>>>>>>> 1912bb2448d828fb21dfc9ef71086f639dd59c01
	});

	// registerSignalHandlers();

	// function registerSignalHandlers() {
	// 	process
	// 		.on('SIGINT', handle)
	// 		.on('uncaughtException', handle)
	// 		.on('unhandledRejection', handle)
	// 		// Nodemon
	// 		.on('SIGUSR2', handle);

	// 	function handle() {
	// 		// server.close();
	// 		Mongoose.disconnect();
	// 		// handleInterrupt(arg);
	// 	}
	// }
}

run();
