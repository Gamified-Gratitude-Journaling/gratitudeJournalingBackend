const JournalEntry = require('../../models/journalEntry');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		journalEntryUploads: async (parent, args, context) => {
			return (await JournalEntry.find({ user: context.userId })).map(entry => merge.transformJournalEntry(entry))
		},
	},
	Mutation: {
		journalEntryUpload: async (parent, { content }, context) => {
			let now = new Date();
			let yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			yesterday.setHours(0, 0, 0, 0);
			let journalEntry = await JournalEntry.findOne({
				user: context.userId,
				createdAt: { $gte: yesterday, $lte: now },
			});
			if (!journalEntry) {
				journalEntry = new JournalEntry({
					content,
					user: context.userId,
				});
			} else {
				journalEntry.content = content;
			}
			try {
				await journalEntry.save();
				return merge.transformJournalEntry(journalEntry);
			} catch (err) {
				throw err;
			}
		},
	},
}