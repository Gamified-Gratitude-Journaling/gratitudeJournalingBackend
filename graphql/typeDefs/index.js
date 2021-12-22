const { gql } = require('apollo-server-core');

// Our GraphQL Schema. Refer to https://www.apollographql.com/docs/tutorial/schema/#define-your-schemas-types 
module.exports = gql(`
scalar Upload

type File {
	filename: String!
	mimetype: String!
	encoding: String!
}

type User {
	_id: ID!
	email: String!
	password: String
}

type authData {
	userId: ID!
	token: String!
}

type JournalEntry {
	_id: ID!
	content: String!
	createdAt: String!
	user: User!
}

type Query {
	uploads: [File!]!
	journalEntryUploads: [JournalEntry!]!
	login(email: String!, password: String!): authData!
}

type Mutation {
	singleUpload(file: Upload!): File!
	multipleUpload(files: [Upload!]!): [File!]!
	journalEntryUpload(content: String!): JournalEntry!
	createUser(email: String!, password: String!): User!
}
`);