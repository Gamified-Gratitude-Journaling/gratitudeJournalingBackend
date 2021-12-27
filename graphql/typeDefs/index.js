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
	username: String!
	email: String!
	password: String
	points: [Point!]!
	likedPrompts: [Prompt!]!
	createdPrompts: [Prompt!]!
	followers: [User!]!
	following: [User!]!
	entries: [JournalEntry!]!
}

type authData {
	userId: ID!
	token: String!
	username: String!
}

type JournalEntry {
	_id: ID!
	content: String!
	createdAt: String!
	user: User!
}

type Prompt {
	_id: ID!
	content: String!
	createdAt: String!
	likes: Int!
	user: User!
}

type Point {
	_id: ID!
	createdAt: String!
	value: Int!
	user: User!
}

type UserPointPair {
	user: User!
	points: Int!
}

type PromptLikedPair {
	prompt: Prompt!
	liked: Boolean!
}

type Query {
	uploads: [File!]!
	journalEntryUploads: [JournalEntry!]!
	login(email: String!, password: String!): authData!
	prompt: PromptLikedPair!
	points: [Point!]!
	fetchUser(username: String!): User!
	leaderboardStatus: [UserPointPair!]!
	currentEntry: JournalEntry
}

type Mutation {
	singleUpload(file: Upload!): File!
	multipleUpload(files: [Upload!]!): [File!]!
	journalEntryUpload(content: String!): JournalEntry!
	createUser(email: String!, password: String!, username: String!): User!
	createPrompt(content: String!): Prompt!
	likePrompt(prompt: ID!): Prompt
	createPoint(value: Int!): Point!
	createFollow(followee: String!): User!
	deleteFollow(followee: String!): User!
	resetLeaderboard(password: String!): String
}
`);