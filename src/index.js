/* eslint-disable no-console */
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
import {Utils} from '@natlibfi/melinda-commons';
import express from 'express';
import cors from 'cors';
import {
	createUsersRouter,
	createPublishersRouter,
	createPublicationsRouter,
	createMessageTemplate
} from './routes';
import Mongoose from 'mongoose';
import {ENABLE_PROXY, MONGO_URI, HTTP_PORT, MONGO_DEBUG} from './config';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';

import validateContentType from '@natlibfi/express-validate-content-type';

const {createLogger, handleInterrupt} = Utils;

run();

async function run() {
	try {
		// const Logger = createLogger();
		const app = express();
		app.enable('trust proxy', ENABLE_PROXY);

		app.use(cors());
		app.use(
			// validateContentType({
			// 	type: ['application/json', 'application/x-www-form-urlencoded']
			// }),
			bodyParser.urlencoded({extended: false}),
			bodyParser.json({
				type: ['application/json', 'application/x-www-form-urlencoded']
			})
		);

		const client = new MongoClient(MONGO_URI, {useNewUrlParser: true});

		let db;
		client.connect(err => {
			const dbName = 'IdentifierServices';
			db = client.db(dbName);
			console.log(err);
			app.use('/templates', createMessageTemplate());
			app.use('/users', createUsersRouter(db));
			app.use('/publishers', createPublishersRouter());
			app.use('/publications', createPublicationsRouter(db));
		});


		const server = app.listen(HTTP_PORT, () => {
			// Logger.log('info', 'Started melinda-record-import-api');
			console.log(`server running in port ${HTTP_PORT}`);
		});

		registerSignalHandlers();

		function registerSignalHandlers() {
			process
				.on('SIGINT', handle)
				.on('uncaughtException', handle)
				.on('unhandledRejection', handle)
				// Nodemon
				.on('SIGUSR2', handle);

			function handle(arg) {
				server.close();
				Mongoose.disconnect();
				handleInterrupt(arg);
			}
		}
	} catch (err) {
		console.log(err);
	}
}
