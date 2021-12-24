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
});

module.exports = mongoose.model('User', userSchema);