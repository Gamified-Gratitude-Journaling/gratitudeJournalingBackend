const makeDir = require('make-dir');
const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');
require('dotenv').config(); //configure environment variables as specified in `.env`
"test"

const UPLOAD_DIRECTORY_URL = require('./config/UPLOAD_DIRECTORY_URL.js');
const apolloTypeDefs = require('./graphql/typeDefs/index');
const apolloResolvers = require('./graphql/resolvers/index');

/*
 * Starts the API server.
 */
async function startServer() {
	// Ensure the upload directory exists.
	await makeDir(UPLOAD_DIRECTORY_URL);

	const app = new express(); //creates express app

	// Required logic for uploading files (multipart-requests) with Express
	// For more on multipart-requests, refer to https://github.com/jaydenseric/graphql-multipart-request-spec#server 
	app.use(graphqlUploadExpress({
		maxFileSize: 10000000, // 10 MB
		maxFiles: 20,
	}));
	// Add custom express middleware
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', '*');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200);
		}
		next();
	});
	

	// Required logic for integrating Apollo with Express
	// Check official docs at https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
	const httpServer = new http.createServer(app);
	const apolloServer = new ApolloServer({
		typeDefs: apolloTypeDefs,
		resolvers: apolloResolvers,
		//Gracefully stops the server
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		introspection: true,
	});
	await apolloServer.start();
	// Short for app.use(apolloServer.getMiddleware({ ... }));
	apolloServer.applyMiddleware({
		app: app,
		path: '/graphql'
	});

	// Connect to MongoDB 
	await mongoose.connect(`${process.env.MONGO_URL}`);

	// Start the server
	await httpServer.listen({ port: process.env.PORT });
	console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
}

//console.log(process.env);
startServer();