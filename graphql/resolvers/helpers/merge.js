const DataLoader = require('dataloader');

const File = require('../../../models/file');
const JournalEntry = require('../../../models/journalEntry');
const User = require('../../../models/user');
const Prompt = require('../../../models/prompt');
const Point = require('../../../models/point');

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
		const user = await userLoader.load(userId);
		return await features.transformUser(user);
	},
	transformUser: async (user) => {
		try {
			return {
				...user._doc, password: null,
				points: async () => {
					return (await pointLoader.loadMany(user._doc.points)).map(point => {
						return features.transformPoint(point);
					})
				},
				likedPrompts: async () => {
					return (await promptLoader.loadMany(user._doc.likedPrompts)).map(likedPrompt => {
						return features.transformPrompt(likedPrompt);
					})
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
		const file = await fileLoader.load(fileId);
		return {
			...file._doc, password: null,
		};
	},

	journalEntry: async journalEntryId => {
		const journalEntry = await journalEntryLoader.load(journalEntryId);
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
		const prompt = await promptLoader.load(promptId);
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
		const point = await pointLoader.load(pointId);
		return features.transformPoint(point);
	},
};

module.exports = {
	...features
}
