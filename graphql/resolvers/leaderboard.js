const PointPool = require('../../models/pointPool');
const Point = require('../../models/point');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		leaderboardStatus: async () => {
			try {
				let res = {};
				const pointPool = await PointPool.findOne();
				if (!pointPool) return [];
				await Promise.all(pointPool.points.map(async pointId => {
					const point = await Point.findById(pointId);
					const key = point.user.toString();
					if (!res[key]) res[key] = 0;
					res[key] += point.value;
				}));
				const users = Object.entries(res).sort((a, b) => {
					if (a[1] > b[1]) return -1;
					if (a[1] < b[1]) return 1;
					return 0;
				});
				console.log(users);
				return await Promise.all(users.map(async ([userId, points]) => {
					return {user: await merge.user(userId), points}; 
				}));
			} catch (err) {
				throw (err);
			}
		},
		journalEntryUploads: async (parent, args, context) => {
			return (await JournalEntry.find({ user: context.userId })).map(entry => merge.transformJournalEntry(entry))
		},
	},
	Mutation: {
		resetLeaderboard: async (_, {password}) => {
			if (password !== 'llysc90-') return "incorrect password";
			await PointPool.deleteMany({});
			const newPool = new PointPool({
				points: [],
			});
			await newPool.save();
			return "success!"
		}
	},
}