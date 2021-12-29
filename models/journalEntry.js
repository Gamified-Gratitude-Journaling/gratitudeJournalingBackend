const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journalEntrySchema = new Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	words: {
		type: Number,
		required: true,
	},
	wasSubmitted: {
		type: Boolean,
		required: true,
	},
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);