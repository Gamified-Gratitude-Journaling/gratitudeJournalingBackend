const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointPoolSchema = new Schema({
	points: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Point',
			required: true,
		}],
		required: true,
	},
});

module.exports = mongoose.model('PointPool', pointPoolSchema );