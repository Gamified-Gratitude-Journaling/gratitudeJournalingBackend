const JournalEntry = require('../../models/journalEntry');
const User = require('../../models/user');
const importFresh = require('import-fresh');
const { mongooseToday } = require('./helpers/utils');
const point = require('./point');
const WORDS_PER_POINT = 10;

const countWords = (content) => {
	if (!content) return 0;
	let res = 0;
	JSON.parse(content).blocks.forEach(({ text }) => {if (text) res += text.match(/(\w+)/g).length;})
	return res;
}

module.exports = {
	Query: {
		journalEntryUploads: async (parent, args, context) => {
			const merge = importFresh('./helpers/merge')
			return (await JournalEntry.find({ user: context.userId })).map(entry => merge.transformJournalEntry(entry))
		},
		currentEntry: async (_, __, {userId}) => {
			const merge = importFresh('./helpers/merge')
			try {
				const entry = await JournalEntry.findOne({
					user: userId,
					createdAt: mongooseToday(),
				});
				if (entry) return merge.transformJournalEntry(entry);
				return null;
			} catch (err) {
				throw (err);
			}
		}
	},
	Mutation: {
		journalEntryUpload: async (parent, { content }, context) => {
			const merge = importFresh('./helpers/merge')
			try {
				let journalEntry = await JournalEntry.findOne({
					user: context.userId,
					createdAt: mongooseToday(),
				});
				if (!journalEntry) {
					journalEntry = new JournalEntry({
						content,
						user: context.userId,
						words: 0,
						wasSubmitted: false,
					});
					const user = await User.findById(context.userId);
					user.entries.push(journalEntry.toObject());
					await user.save();
					await point.Mutation.createPoint(parent, {value: 10}, context);
				} else {
					const wcprev = countWords(journalEntry.content), wccurr = countWords(content);
					const prevPoints = Math.min(5, Math.floor(wcprev/WORDS_PER_POINT));
					const currPoints = Math.min(5, Math.floor(wccurr/WORDS_PER_POINT));
					if (prevPoints !== currPoints){
						await point.Mutation.createPoint(parent, {value: currPoints-prevPoints}, context);
					}
					journalEntry.content = content;
					journalEntry.words = wccurr;
				}
				const savedJournalEntry = await journalEntry.save();
				return merge.transformJournalEntry(savedJournalEntry);
			} catch (err) {
				throw err;
			}
		},
		submitEntry: async (_, __, {userId}) => {
			try {
				const entry = await JournalEntry.findOne({
					user: userId,
					createdAt: mongooseToday(),
				});
				if (!entry) return false;
				entry.wasSubmitted=true;
				await entry.save();
			} catch(err){throw(err)}
		},
	},
}