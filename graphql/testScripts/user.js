const User = require('../resolvers/user');

const user = () => {
	try {
		User.Mutation.createUser({
			email: "user1@test.com", 
			username: ""
		});
	} catch(err){throw(err);}
}

export default user;

user();