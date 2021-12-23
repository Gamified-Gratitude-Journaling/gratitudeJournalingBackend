const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	value: {
		type: Number,
		required: true,
	}
}, { timestamps: true });

module.exports = mongoose.model('Point', pointSchema);