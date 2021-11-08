/*
 * A mongoose model representing the `File` type defined in '../graphql/index.js'
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journalEntrySchema = new Schema({
	content: {
		type: String,
		required: true
	},
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);