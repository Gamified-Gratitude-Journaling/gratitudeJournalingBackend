const DataLoader = require('dataloader');

const File = require('../../../models/file');
const JournalEntry = require('../../../models/journalEntry');
const User = require('../../../models/user');
const Prompt = require('../../../models/prompt');
const Point = require('../../../models/point');
const { dateToString } = require('./utils');

const userLoader = new DataLoader((userIds) => {
	return User.find({ _id: { $in: userIds } });
});

const fileLoader = new DataLoader((fileIds) => {
	return File.find({ _id: { $in: fileIds } });
});

const journalEntryLoader = new DataLoader((journalEntryIds) => {
	return JournalEntry.find({ _id: { $in: journalEntryIds } });
});

const promptLoader = new DataLoader((promptIds) => {
	return Prompt.find({ _id: { $in: promptIds } });
});

const pointLoader = new DataLoader((pointIds) => {
	return Point.find({ _id: { $in: pointIds } });
});

const features = {
	user: async userId => {
		const user = await userLoader.load(userId.toString());
		return await features.transformUser(user);
	},
	transformUser: async (user) => {
		try {
			return {
				...user._doc, password: null,
				points: async () => {
					return await Promise.all(user._doc.points.map(e => features.point(e)));
				},
				createdPrompts: async () => {
					return await Promise.all(user._doc.createdPrompts.map(e => features.prompt(e)));
				},
				likedPrompts: async () => {
					return await Promise.all(user._doc.likedPrompts.map(e => features.prompt(e)));
				},
				followers: async () => {
					return await Promise.all(user._doc.followers.map(user => features.user(user)));
				},
				following: async () => {
					return await Promise.all(user._doc.following.map(user => features.user(user)));
				},
				entries: async () => {
					const entries = await Promise.all(user._doc.entries.map(entry => features.journalEntry(entry)));
					return entries.map(e => { return { ...e, content: "" } })
				},
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

	transformPoint: (point) => {
		return {
			...point._doc,
			createdAt: dateToString(point.createdAt),
			user: features.user.bind(this, point._doc.user),
		};
	},

	point: async pointId => {
		const point = await pointLoader.load(pointId.toString());
		return features.transformPoint(point);
	},
};

module.exports = {
	...features
}
