import {Schema} from 'mongoose';

export const UserModel = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	preference: {
		type: String,
		default: 'English'
	}
}, {strict: 'throw'});
