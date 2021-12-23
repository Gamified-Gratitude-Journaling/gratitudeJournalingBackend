const Prompt = require('../../models/prompt');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		prompt: async () => {
			let totalLikes = 0;
			const ranges = (await Prompt.find()).map((prompt) => {
				totalLikes += prompt.likes+1;
				return [totalLikes-prompt.likes-1, prompt];
			});
			const ind = Math.floor(Math.random()*totalLikes);
			let res = 0, step = ranges.length-1;
			while (step>0){
				const next = res+step;
				if (next<ranges.length && ranges[next][0]<=ind) res=next;
				step=Math.floor(step/2);
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
				return err;
			}
		},
		likePrompt: async (parent, args , context) => {
			const promptId = args.prompt;
			const prompt = await Prompt.findById(promptId);
			prompt.likes+=1;
			try {
				await prompt.save();
				return merge.transformPrompt(prompt);
			} catch (err) {
				return err;
			}
		},
	},
}