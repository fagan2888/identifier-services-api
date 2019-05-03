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
        publisherMetadata(id:String, active:Boolean, name:String, language:String, metadataDelivery:String,
            email:String, website:String, primaryContact: String, aliases: String, notes: String, active: Boolean,
            yearInactivated: Int, address:String, city:String, zip:String ):Publisher
        
        publisherRequest(id: String, name:String, publisherId: String, language: String, email: String, website: String,
            publicationEstimate: Int, note: String, state: String, address: String, city: String, zip: String, 
            givenName: String, familyName: String, emailContact: String ): PublisherRequest

        Publishers:[Publisher]

    }

    type LastUpdated{
        timeStamp: String!
        user: String!
    }

    type Active{
        active: Boolean
    }

    type YearInactivated{
        yearInactivated: Int
    }

    enum Activity{
        Active
        YearInactivated
    }

    type StreetAddress{
        address: String!
        city: String!
        zip: String!
    }

    type PublisherAltName {
        name:String!
    }

    type Note{
        note: String!
    }

    type UserId{
        userId: String
    }

    type Email {
        email: String
    }

    enum PrimaryContact{
        UserId
        Email
    }

    type PrimaryContactRequest{
        givenName: String!
        familyName: String!
        email: String!
    }

    type ISBN_ISMN{
        name: String
    }
    type ISSN {
        name: String
    }

    enum Publication{
        ISBN_ISMN
        ISSN
    }

    type Publisher{
        id: String!
        name: String!
        language: String!
        metadataDelivery: String!
        primaryContact(name:String, email: String): PrimaryContact
        email: String
        website: String
        aliases(publisherAltName: String!): [PublisherAltName]
        notes: [Note]
        lastUpdated(timeStamp: String, user: String): LastUpdated
        activity(active: Boolean, yearInactivated: Int): Activity!
        streetAddress(address: String, city:String, zip: String): StreetAddress
    }  
    
    type PublisherRequest{
        id: String!
        name: String!
        publisherId: String!
        language: String!
        email: String
        website: String
        publicationEstimate: Int!
        notes: [Note]
        state: String!
        streetAddress(address: String, city: String, zip: String): StreetAddress
        primaryContact: [PrimaryContactRequest]
        publication: Publication
    }
 `;
