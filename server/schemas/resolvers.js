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
      throw AuthenticationError;
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
    addBook: async (parent, addedBook, context) => {
      console.log("resolver addBook mutation:", addedBook, context.user);
      if (context.user) {

        let authorizedUser = await User.findById(context.user._id);
        const foundIndex = authorizedUser.savedBooks.findIndex((elem) => {
          return elem.bookId === addedBook.bookId;
        });

        // If it is unique, add it into the user's saved books array and save it via Mongoose
        if (foundIndex === -1) {
          authorizedUser.savedBooks.push(addedBook);
          const pushedElem = await authorizedUser.save();
          const savedElem = pushedElem.savedBooks[pushedElem.savedBooks.length - 1];
          console.log("============= ADDED NEW BOOK =============", savedElem);
          return savedElem;
        } else {
          return null;
        };
      };
      throw AuthenticationError;
    },
    delBook: async (parent, bookToDelete, context) => {
      console.log("resolver deleteBook mutation:", bookToDelete, context.user);
      if (context.user) {

        let authorizedUser = await User.findById(context.user._id);
        const foundIndex = authorizedUser.savedBooks.findIndex((elem) => {
          return elem.bookId === bookToDelete.bookId;
        });

        console.log("============= DELETING BOOK =============", bookToDelete.bookId);

        // If the book is found, delete it from the array and save
        if (!(foundIndex === -1)) {
          authorizedUser.savedBooks.splice(foundIndex, 1);
          await authorizedUser.save();

          console.log("============= USER W/ DELETED BOOK =============", authorizedUser);

          return authorizedUser;
        } else {
          return null;
        };
      };
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
