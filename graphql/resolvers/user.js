const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const merge = require('./helpers/merge');

const modifyFollow = async (_, { followee: followeeId }, { userId }, create) => {
	try {
		if (!userId) { throw new Error("Not signed in"); }
		if (followeeId.localeCompare(userId) === 0) { throw new Error("Same user"); }
		const follower = await User.findById(userId);
		const following = await User.findById(followeeId);
		if (!follower) { throw new Error("Not signed in"); }
		if (!following) { throw new Error("User not found"); }
		if (create) {
			if (follower.following.find(e => { return e.toString().localeCompare(followeeId) === 0 })) {
				throw new Error("Already following");
			}
			//console.log(userId, followeeId, follower, following);
			follower.following.push(following.toObject());
			following.followers.push(follower.toObject());
		}
		else {
			follower.following = follower.following.filter(e=>e.toString().localeCompare(followeeId) !== 0);
			following.followers = following.followers.filter(e=>e.toString().localeCompare(userId) !== 0);
		}
		const [_, followee] = await Promise.all([follower.save(), following.save()]);
		const res = await merge.transformUser(followee);
		return res;
	} catch (err) {
		throw err;
	}
}

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
				});
				const result = await user.save();
				return await merge.transformUser(result);
			} catch (err) {
				throw err;
			}
		},
		createFollow: async (_, args, context) => {
			try {
				const res = await modifyFollow(_, args, context, true);
				return res;
			} catch (err) {
				throw (err);
			}
		},
		deleteFollow: async (_, args, context) => {
			try {
				return await modifyFollow(_, args, context, false);
			} catch (err) {
				throw (err);
			}
		}
	},
	Query: {
		login: async (_, { email, password }) => {
			const user = await User.findOne({ email: email });
			if (!user) {
				throw new Error(`User doesn't exist.`);
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
			if (!user) throw new Error("Username not found");
			return await merge.transformUser(user);
		},
	}
};