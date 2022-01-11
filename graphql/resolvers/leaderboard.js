const PointPool = require('../../models/pointPool');
const Point = require('../../models/point');
const importFresh = require('import-fresh');
const User = require('../../models/user');

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
					if (key.localeCompare('61d204e82c71a5e2ab1a8970')===0){
						point.value=0;
					}
					if (!res[key]) res[key] = 0;
					res[key] += point.value;
				}));
				const users = Object.entries(res).sort((a, b) => {
					if (a[1] > b[1]) return -1;
					if (a[1] < b[1]) return 1;
					return a[0].localeCompare(a[1]);
				});
				return await Promise.all(users.map(async ([userId, points]) => {
					const user = await User.findById(userId);
					return {user: await merge.transformUser(user), points}; 
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
