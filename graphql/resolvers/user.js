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
				if (await User.findOne({username: args.username})) {
					throw new Error('Username already used.');
				}
				const hashedPassword = await bcrypt.hash(args.password, 12);
				const user = new User({
					email: args.email,
					username: args.username,
					password: hashedPassword,
					points: [],
					likedPrompts: [],
				});
				const result = await user.save();
				return { ...result._doc, password: null };
			} catch (err) {
				throw err;
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
		fetchUser: async (_, {username}) => {
			const user = await User.findOne({username: username});
			if (!user) throw new Error("Username not found");
			return await merge.transformUser(user);
		}
	}
};