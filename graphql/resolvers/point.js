const Point = require('../../models/point');
const User = require('../../models/user');
const PointPool = require('../../models/pointPool');
const importFresh = require('import-fresh');
const { mongooseToday } = require('./helpers/utils');

module.exports = {
	Query: {
		points: async (parent, args, { userId }) => {
			const merge = importFresh('./helpers/merge')
			return res = await (await merge.user(userId)).points();
		},
	},
	Mutation: {
		createPoint: async (parent, { value }, { userId }) => {
			const merge = importFresh('./helpers/merge')
			try {
				const user = await User.findById(userId);
				if (!user) throw new Error("Not signed in");
				let point = await Point.findOne({user: userId, createdAt: mongooseToday() });
				if (point) {
					point.value += value;
					return merge.transformPoint(await point.save());
				}
				point = new Point({
					value,
					user: userId,
				});
				let pointPool = await PointPool.findOne();
				if (!pointPool) {
					pointPool = new PointPool({
						points: [],
					});
				}
				pointPool.points.push(point);
				user.points.push(point);
				await Promise.all([
					await point.save(),
					await pointPool.save(),
					await user.save(),
				]);
				return merge.transformPoint(point);
			} catch (err) {
				throw err;
			}
		},
	},
}
