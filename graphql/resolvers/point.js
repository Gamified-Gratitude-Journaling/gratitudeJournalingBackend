const Point = require('../../models/point');
const User = require('../../models/user');
const merge = require('./helpers/merge');

module.exports = {
	Query: {
		points: async (parent, args, { userId }) => {
			const points = (await Point.find({user: userId})).map(point => {
				return merge.transformPoint(point);
			});
			if (!points) return [];
			return points;
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
				await point.save();
				user.points.push(point);
				await user.save();
				return merge.transformPoint(point);
			} catch (err) {
				throw err;
			}
		},
	},
}