const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const merge = require('./helpers/merge');


module.exports = {
	Mutation: {
		createUser: async (_, args) => {
			try {
				if (await User.findOne({ email: args.email })) {
					throw new Error('Email already used.');
				}
				if (await User.findOne({ username: args.username })) {
					throw new Error('Username already used.');
				}
				const hashedPassword = await bcrypt.hash(args.password, 12);
				const user = new User({
					email: args.email,
					username: args.username,
					password: hashedPassword,
					points: [],
					likedPrompts: [],
					followers: [],
					following: [],
					entries: [],
					createdPrompts: [],
				});
				const result = await user.save();
				return await merge.transformUser(result);
			} catch (err) {
				throw err;
			}
		},
		toggleFollow: async (_, { followee: username }, { userId }) => {
			try {
				if (!userId) { throw new Error("Not signed in"); }
				const following = await User.findOne({ username });
				if (!following) { throw new Error("User not found") }
				const followeeId = following._id.toString();
				if (followeeId.localeCompare(userId) === 0) { throw new Error("Cannot follow self"); }
				const follower = await User.findById(userId);
				if (!follower) { throw new Error("Not signed in"); }
				if (follower.following.find(e => { return e.toString().localeCompare(followeeId) === 0 })) {
					follower.following = follower.following.filter(e => e.toString().localeCompare(followeeId) !== 0);
					following.followers = following.followers.filter(e => e.toString().localeCompare(userId) !== 0);
				} else {
					//console.log(userId, followeeId, follower, following);
					follower.following.push(following.toObject());
					following.followers.push(follower.toObject());
				}
				const [_, followee] = await Promise.all([follower.save(), following.save()]);
				const res = await merge.transformUser(followee);
				return res;
			} catch (err) {
				throw err;
			}
		}
	},
	Query: {
		login: async (_, { email, password }) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				throw new Error(`User not found`);
			}
			const isEqual = await bcrypt.compare(password, user.password);
			if (!isEqual) {
				throw new Error(`Password is incorrect.`);
			}
			const token = jwt.sign({
				userId: user.id, email: user.email
			},
				'somesupersecretkey',
				{ expiresIn: '1h' }
			);
			return { userId: user.id, token: token, tokenExpiration: 1, username: user.username };
		},
		fetchUser: async (_, { username }) => {
			const user = await User.findOne({ username: username });
			if (!user) throw new Error("User not found");
			return await merge.transformUser(user);
		},
		isFollowing: async (_, { followee: username }, { userId }) => {
			try {
				if (!userId) { throw new Error("Not signed in"); }
				const following = await User.findOne({ username })
				if (!following) { throw new Error("User not found") }
				const followeeId = following._id.toString();
				const follower = await User.findById(userId);
				if (!follower) { throw new Error("Not signed in"); }
				if (follower.following.find(e => { return e.toString().localeCompare(followeeId) === 0 })) return true;
				return false;
			} catch (err) {
				throw err;
			}
		},
	}
};