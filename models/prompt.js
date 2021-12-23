/*
 * A mongoose model representing the `File` type defined in '../graphql/index.js'
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promptEntrySchema = new Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	likes: {
		type: Number,
		required: true,
	}
}, { timestamps: true });

module.exports = mongoose.model('PromptEntry', promptEntrySchema);