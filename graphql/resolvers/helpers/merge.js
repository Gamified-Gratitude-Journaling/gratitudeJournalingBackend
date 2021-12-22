const DataLoader = require('dataloader');

const File = require('../../../models/file');
const JournalEntry = require('../../../models/journalEntry');
const User = require('../../../models/user');

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
		//console.log(journalEntry._doc);
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

	/*transformFile: (referral) => {
		return {
			...referral._doc,
			createdAt: dateToString(referral.createdAt),
			updatedAt: dateToString(referral.updatedAt),
			consulationDate: dateToString(referral.consulationDate),
			treatmentDate: dateToString(referral.treatmentDate),
			journalEntry: features.journalEntry.bind(this, referral.journalEntry),
			referrer: features.file.bind(this, referral.referrer),
			referee: features.file.bind(this, referral.referee),
		};
	},*/

};

module.exports = {
	...features
}
