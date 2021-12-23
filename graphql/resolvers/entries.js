const JournalEntry = require('../../models/journalEntry');
const merge = require('./helpers/merge');
const point = require('./point');
const WORDS_PER_POINT = 10;

const countWords = (content) => {
	let res = 0;
	console.log(content);
	content.blocks.map(({ text }) => {res += str.match(/(\w+)/g).length;})
	return res;
}

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
			try {
				let journalEntry = await JournalEntry.findOne({
					user: context.userId,
					createdAt: { $gte: yesterday, $lte: now },
				});
				console.log(journalEntry);
				if (!journalEntry) {
					journalEntry = new JournalEntry({
						content,
						user: context.userId,
					});
					point.Mutation.createPoint(parent, {value: 10}, context);
				} else {
					const wcprev = countWords(journalEntry.content), wccurr = countWords(content);
					const prevPoints = Math.min(5, Math.floor(wcprev/WORDS_PER_POINT));
					const currPoints = Math.min(5, Math.floor(wccurr/WORDS_PER_POINT));
					console.log("wtf");
					if (prevPoints !== currPoints){
						point.Mutation.createPoint(parent, {value: currPoints-prevPoints}, context);
					}
					journalEntry.content = content;
				}
				await journalEntry.save();
				return merge.transformJournalEntry(journalEntry);
			} catch (err) {
				throw err;
			}
		},
	},
}