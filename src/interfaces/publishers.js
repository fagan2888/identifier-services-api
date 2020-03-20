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

import {ApiError} from '@natlibfi/identifier-services-commons';
import HttpStatus from 'http-status';
import interfaceFactory from './interfaceModules';
import {hasPermission, validateDoc} from './utils';

const publisherInterface = interfaceFactory('PublisherMetadata', 'PublisherContent');

export default function () {
  return {
    create,
    read,
    update,
    query
  };

  async function create(db, doc, user) {
    try {
      if (validateDoc(doc, 'PublisherContent')) {
        if (hasPermission(user, 'publishers', 'create')) {
          return publisherInterface.create(db, doc, user);
        }
        throw new ApiError(HttpStatus.FORBIDDEN);
      }
      throw new ApiError(HttpStatus.BAD_REQUEST);
    } catch (err) {
      if (err) { // eslint-disable-line functional/no-conditional-statement
        throw new ApiError(err.status ? err.status : HttpStatus.BAD_REQUEST);
      }
    }
  }

  async function read(db, id, user) {
    let protectedProperties; // eslint-disable-line functional/no-let
    if (user === undefined) { // eslint-disable-line functional/no-conditional-statement
      protectedProperties = {
        publicationDetails: 0,
        language: 0,
        metadataDelivery: 0,
        primaryContact: 0,
        activity: 0
      };
    }

    const result = await publisherInterface.read(db, id, protectedProperties);
    if (user === undefined && result.postalAddress.public === true) {
      return result;
    }

    if (user === undefined && result.postalAddress.public === false) {
      const {postalAddress, ...rest} = result;
      return rest;
    }

    if (user.role === 'publisher-admin') { // eslint-disable-line functional/no-conditional-statement
      protectedProperties = {
        publicationDetails: 0,
        metadataDelivery: 0,
        activity: 0
      };
    }

    return result;
  }

  async function update(db, id, doc, user) {
    const result = await publisherInterface.update(db, id, doc, user);
    return result;
  }

  async function query(db, {queries, offset}) {
    const result = await publisherInterface.query(db, {queries, offset});
    return result;
  }
}
