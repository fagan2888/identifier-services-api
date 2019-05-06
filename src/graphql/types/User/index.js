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

export default `
 type Query{
     userMetadata(id: String, userId: String, defaultLanguage: String, user: String, timestamp: String):User
     usersRequest(id: String, userId: String, publishers: String, givenName: String, familyName: String,
        email: String, state: String): UsersRequest
     Users: [User]
     usersRequests: [UsersRequest]
 }

 type LastUpdated{
     timestamp: String!
     user: String!
 }
 
 type Preferences{
     defaultLanguage: String!
 }
 
 type User{
    id: String!
    userId: String
    preferences(defaultLanguage:String): Preferences!
    lastUpdated(timestamp: String, user: String): LastUpdated
 }

 type Note{
     note: String!
 }

 type UsersRequest{
     id: String!
     userId: String!
     publishers: String!
     givenName: String!
     familyName: String!
     email: String!
     notes:[Note]
     state: String!
     lastUpdated: LastUpdated
 }

 type Mutation{
    createUser(id:String, userId:String, defaultLanguage: String, user: String, timestamp: String):User
    deleteUser(id:String, userId:String):User
    updateUser(id:String, userId:String, defaultLanguage:String, user:String, timestamp:String):User
 }
 `;
