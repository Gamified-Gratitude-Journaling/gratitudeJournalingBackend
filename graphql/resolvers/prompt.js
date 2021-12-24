const Prompt = require('../../models/prompt');
const User = require('../../models/user');
const merge = require('./helpers/merge');
const point = require('./point');

module.exports = {
	Query: {
		prompt: async () => {
			let totalLikes = 0;
			const ranges = (await Prompt.find()).map((prompt) => {
				totalLikes += prompt.likes + 1;
				return [totalLikes - prompt.likes - 1, prompt];
			});
			const ind = Math.floor(Math.random() * totalLikes);
			let res = 0, step = ranges.length - 1;
			while (step > 0) {
				const next = res + step;
				if (next < ranges.length && ranges[next][0] <= ind) res = next;
				step = Math.floor(step / 2);
			}
			return merge.transformPrompt(ranges[res][1]);
		},
	},
	Mutation: {
		createPrompt: async (parent, { content }, context) => {
			const prompt = new Prompt({
				content,
				user: context.userId,
				likes: 0,
			});
			try {
				await prompt.save();
				return merge.transformPrompt(prompt);
			} catch (err) {
				throw err;
			}
		},
		likePrompt: async (parent, args, context) => {
			const promptId = args.prompt;
			try {
				const [user, prompt] = await Promise.all([User.findById(context.userId), Prompt.findById(promptId)]);
				if (prompt.user.toString().localeCompare(context.userId) === 0 || user.likedPrompts.find(e => e.toString().localeCompare(promptId) === 0)) {
					return null;
				}
				prompt.likes += 1;
				user.likedPrompts.push(prompt);
				await Promise.all([prompt.save(), point.Mutation.createPoint(parent, {value: 5}, {userId: prompt._doc.user._id}), user.save()]);
				return merge.transformPrompt(prompt);
			} catch (err) {
				throw err;
			}
		},
	},
}