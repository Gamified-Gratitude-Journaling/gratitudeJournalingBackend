const JournalEntry = require('../../models/journalEntry');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		journalEntryUploads: async (parent) => {
			return (await JournalEntry.find()).map(entry => merge.transformJournalEntry(entry))
		},
	}, 
	Mutation: {
		journalEntryUpload: async (parent, { content }) => {
			const journalEntry = new JournalEntry({content});
			try{
				await journalEntry.save();
				return merge.transformJournalEntry(journalEntry);
			} catch (err) {
				return err;
			}
		},
	},
}