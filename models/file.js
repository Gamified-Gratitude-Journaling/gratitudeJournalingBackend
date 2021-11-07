/*
 * A mongoose model representing the `File` type defined in '../graphql/index.js'
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
	filename: {
		type: String,
		required: true
	},
	encoding: {
		type: String,
		required: true
	}, 
	mimetype: {
		type: String,
		required: true
	}, 
});

module.exports = mongoose.model('File', fileSchema);