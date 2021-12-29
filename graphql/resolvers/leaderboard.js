const PointPool = require('../../models/pointPool');
const Point = require('../../models/point');
const importFresh = require('import-fresh');

module.exports = {
	Query: {
		leaderboardStatus: async () => {
			const merge=importFresh('./helpers/merge')
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
				return await Promise.all(users.map(async ([userId, points]) => {
					return {user: await merge.user(userId), points}; 
				}));
			} catch (err) {
				throw (err);
			}
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