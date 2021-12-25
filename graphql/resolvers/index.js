const graphQLUpload = require('graphql-upload');

const entries = require('./entries');
const user = require('./user');
const upload = require('./upload');
const prompt = require('./prompt');
const point = require('./point');

module.exports = {
	Upload: graphQLUpload, //Resolves the `Upload` scalar
	Query: {
		...upload.Query,
		...user.Query,
		...entries.Query,
		...prompt.Query,
		...point.Query,
	},
	Mutation: {
		...upload.Mutation,
		...user.Mutation,
		...entries.Mutation,
		...prompt.Mutation,
		...point.Mutation,
	},
};