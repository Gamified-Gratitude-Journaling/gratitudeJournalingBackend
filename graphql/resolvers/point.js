const Point = require('../../models/point');
const User = require('../../models/user');
const PointPool = require('../../models/pointPool');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		points: async (parent, args, { userId }) => {
			/*const points = (await Point.find({user: userId})).map(point => {
				console.log(point);
				return merge.transformPoint(point);
			});
			if (!points) return [];*/
			return await (await merge.user(userId)).points();
		},
	},
	Mutation: {
		createPoint: async (parent, { value }, {userId}) => {
			const point = new Point({
				value,
				user: userId,
			});
			try {
				const user = await User.findById(userId);
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