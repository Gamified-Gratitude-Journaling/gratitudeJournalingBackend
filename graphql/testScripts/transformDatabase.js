const mongoose = require('mongoose');
const JournalEntry = require('../../models/journalEntry');
const Entries = require('../resolvers/entries');
require('dotenv').config(); //configure environment variables as specified in `.env`

const test = async () => {
	console.log("testing");
	await mongoose.connect(`${process.env.MONGO_URL}`);
	const entries = await JournalEntry.find();
	await Promise.all(entries.map(e => {
		e.words = 5;
		return e.save();
	}));
}

try {
	test();
} catch (err){
	console.log(err);
}
