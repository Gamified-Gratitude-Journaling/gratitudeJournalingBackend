const Prompt = require('../../models/prompt');
const User = require('../../models/user');
const merge = require('./helpers/merge');
const point = require('./point');

module.exports = {
	Query: {
		prompt: async (_, __, { userId }) => {
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
			const user = await User.findById(userId);
			const prompt = await merge.transformPrompt(ranges[res][1]);
			let liked = false;
			if (user && user.likedPrompts.find(e => e.toString().localeCompare(prompt._id) === 0)) liked = true;
			return { prompt, liked }
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
				const user = await User.findById(context.userId);
				user.createdPrompts.push(prompt.toObject());
				await user.save();
				return merge.transformPrompt(prompt);
			} catch (err) {
				throw err;
			}
		},
		likePrompt: async (parent, args, context) => {
			const promptId = args.prompt;
			try {
				const [user, prompt] = await Promise.all([User.findById(context.userId), Prompt.findById(promptId)]);
				if (prompt.user.toString().localeCompare(context.userId) === 0) {
					throw new Error("Cannot like own prompt"); // User trying to like thier own prompt
				}
				const liked = user.likedPrompts.find(e => e.toString().localeCompare(promptId) === 0);
				if (liked){
					user.likedPrompts = user.likedPrompts.filter(e => e.toString().localeCompare(promptId) !== 0);
				} else{
					user.likedPrompts.push(prompt);
				}
				prompt.likes += liked ? -1 : 1;
				await Promise.all([
					prompt.save(),
					point.Mutation.createPoint(parent, { value: liked ? -5 : 5 }, { userId: prompt._doc.user._id }),
					user.save()
				]);
				return merge.transformPrompt(prompt);
			} catch (err) {
				throw err;
			}
		},
	},
}