const DataLoader = require('dataloader');

const File = require('../../../models/file');
const JournalEntry = require('../../../models/journalEntry');

const dateToString = (date) => {
	if (!date) return null;
	return new Date(date).toISOString();
}

const fileLoader = new DataLoader((fileIds) => {
	return File.find({ _id: { $in: fileIds } });
});

const journalEntryLoader = new DataLoader((journalEntryId) => {
	return JournalEntry.find({ _id: journalEntryId });
});

const features = {
	transformJournalEntry: (journalEntry) => {
		return {
			...journalEntry._doc,
			createdAt: dateToString(journalEntry.createdAt),
		};
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
};

module.exports = {
	...features
}
