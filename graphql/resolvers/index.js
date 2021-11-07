const graphQLUpload = require('graphql-upload');

const storeUpload = require('./helpers/storeUpload');
const File = require('../../models/file');

module.exports = {
	Upload: graphQLUpload, //Resolves the `Upload` scalar
	Query: {
		// Retrieve metadata of all files in our MongoDB database.
		uploads: async () => {
			return (await File.find()).map((file) => file._doc);
		}
	},
	Mutation: {
		// Store a single file
		singleUpload: async (parent, args) => {
			return storeUpload(args.file);
		},
		// Store multiple files
		multipleUpload: async (parent, { files }) => {
			if (!files) files = []; // Turn files into an empty list if it's undefined or null
			// Ensure an error storing one upload doesn’t prevent storing the rest.
			const results = await Promise.allSettled(files.map(storeUpload));
			return results.reduce((storedFiles, { value, reason }) => {
				if (value) storedFiles.push(value);
				// Realistically you would do more than just log an error.
				else console.error(`Failed to store upload: ${reason}`);
				return storedFiles;
			}, []);
		},
	},
};