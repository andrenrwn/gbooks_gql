const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // GraphQL auth error handler
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // JWT auth middleware is retrieved from each HTTP request
  // JWT tokens (cookies) can be retrieved from:
  // - a JSON token element in the HTTP request body,
  // - a "token" query variable in the GET URI
  // - the authorization Bearer header  ( HTTP auth is defined in https://datatracker.ietf.org/doc/html/rfc7235 )
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query or HTTP authorization: header

    let token;
    if (req.body && req.body.token) {
      token = req.body.token;
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else if (req.headers && req.headers.authorization) {
      // Take the left value after ["Bearer", "<tokenvalue>"]
      token = req.headers.authorization.split(' ').pop().trim();
    };

    if (!token) {
      return req; // no token found in request, so just return the original req as context object for the next one after this middleware
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log("authMiddleware data:", data);
      req.user = data; // populate decoded jwt token data into req.user object for the next express call
    } catch {
      console.log('Invalid token failed JWT verify');
      // return res.status(401).json({ message: 'Invalid token failed JWT verify' });
    }

    // send data to next function after this middleware as third parameter (ie. 'context')
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
