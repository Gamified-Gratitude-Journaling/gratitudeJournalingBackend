const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promptEntrySchema = new Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	likes: {
		type: Number,
		required: true,
	}
}, { timestamps: true });

module.exports = mongoose.model('Prompt', promptEntrySchema);