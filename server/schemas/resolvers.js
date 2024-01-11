const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  // Queries
  Query: {
    users: async () => {
      return await User.find({}).populate('savedBooks').exec();
    },
    user: async (parent, args) => {
      if (args.hasOwnProperty('id')) {
        return await User.findById(args.id);
      } else if (args.hasOwnProperty('username')) {
        return await User.findOne({ username: args.username });
      };
    },
    // This resolver gets the user ID from the token info supplied by the HTTP request, saved in "context" by the Auth middleware
    me: async (parent, args, context) => {
      console.log("resolver me lookup:", args, context.user);
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError('You need to be logged in!');
    },
  },

  // Mutations
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      console.log("Login", email, password);
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
