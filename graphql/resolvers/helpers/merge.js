const DataLoader = require('dataloader');

const File = require('../../../models/file');
const JournalEntry = require('../../../models/journalEntry');
const User = require('../../../models/user');
const Prompt = require('../../../models/prompt');

const dateToString = (date) => {
	if (!date) return null;
	return new Date(date).toISOString();
}

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const fileLoader = new DataLoader((fileIds) => {
	return File.find({ _id: { $in: fileIds } });
});

const journalEntryLoader = new DataLoader((journalEntryId) => {
	return JournalEntry.find({ _id: journalEntryId });
});

const promptEntryLoader = new DataLoader((promptEntryId) => {
	return PromptEntry.find({ _id: promptEntryId });
});

const features = {
	user : async userId => {
		const user = await userLoader.load(userId.toString());
		try {
			return {
				...user._doc, password: null,
				//createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
			};
		} catch (err) {
			throw err;
		}
	},

	transformJournalEntry: (journalEntry) => {
		return {
			...journalEntry._doc,
			createdAt: dateToString(journalEntry.createdAt),
			user: features.user.bind(this, journalEntry._doc.user),
		};
	},

	file: async fileId => {
		if (!fileId) return null;
		const file = await fileLoader.load(fileId.toString());
		return {
			...file._doc, password: null,
		};
	},

	journalEntry: async journalEntryId => {
		const journalEntry = await journalEntryLoader.load(journalEntryId.toString());
		return features.transformJournalEntry(journalEntry);
	},

	transformPrompt: (prompt) => {
		return {
			...prompt._doc,
			createdAt: dateToString(prompt.createdAt),
			user: features.user.bind(this, prompt._doc.user),
		};
	},

	prompt: async promptId => {
		const prompt = await promptLoader.load(promptId.toString());
		return features.transformPrompt(prompt);
	},
};

module.exports = {
	...features
}
