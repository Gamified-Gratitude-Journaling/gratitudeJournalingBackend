const { gql } = require('apollo-server-core');

// Our GraphQL Schema. Refer to https://www.apollographql.com/docs/tutorial/schema/#define-your-schemas-types 
module.exports = gql(`
scalar Upload

type File {
	filename: String!
	mimetype: String!
	encoding: String!
}

type JournalEntry {
	content: String!
	createdAt: String!
}

type Query {
	uploads: [File!]!
	journalEntryUploads: [JournalEntry!]!
}

type Mutation {
	singleUpload(file: Upload!): File!
	multipleUpload(files: [Upload!]!): [File!]!
	journalEntryUpload(content: String!): JournalEntry!
}
`);