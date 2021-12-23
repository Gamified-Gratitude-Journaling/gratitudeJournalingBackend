const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	Mutation: {
		createUser: async (_, args) => {
			try {
				const existingUser = await User.findOne({ email: args.email });
				if (existingUser) {
					throw new Error('User already exists.');
				}
				const hashedPassword = await bcrypt.hash(args.password, 12);
				const user = new User({
					email: args.email,
					password: hashedPassword,
					points: [],
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
			return { userId: user.id, token: token, tokenExpiration: 1 };
		},
	}
};