const graphQLUpload = require('graphql-upload');

const entries = require('./entries');
const auth = require('./auth');
const upload = require('./upload');
const prompt = require('./prompt');

module.exports = {
	Upload: graphQLUpload, //Resolves the `Upload` scalar
	Query: {
		...upload.Query,
		...auth.Query,
		...entries.Query,
		...prompt.Query,
	},
	Mutation: {
		...upload.Mutation,
		...auth.Mutation,
		...entries.Mutation,
		...prompt.Mutation,
	},
};