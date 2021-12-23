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
	points: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Point',
			required: true,
		}],
		required: true,
	}
});

module.exports = mongoose.model('User', userSchema);