const features = {
	dateToString: (date) => {
		if (!date) return null;
		return new Date(date).toISOString();
	},
	mongooseToday: () => {
		let now = new Date();
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		return { $gte: today.toISOString(), $lte: now.toISOString() }
	}
}

module.exports = { ...features }