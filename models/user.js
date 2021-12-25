const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}, 
	username: {
		type: String,
		required: true
	}, 
	likedPrompts: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Prompt',
			required: true,
		}],
		required: true,
	},
	points: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Point',
			required: true,
		}],
		required: true,
	},
	followers: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}],
		required: true,
	},
	following: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}],
		required: true,
	},
	entries: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'JournalEntry',
			required: true,
		}],
		required: true,
	},
});

module.exports = mongoose.model('User', userSchema);