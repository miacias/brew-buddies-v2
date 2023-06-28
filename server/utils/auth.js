const jwt = require('jsonwebtoken');

module.exports = {
  // protects routes via authentication
  authMiddleware({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // removes "Bearer", then returns token string
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // return request if token is false
    if (!token) {
      return req;
    }
    // adds the decoded user data to request to be accessed in resolver
    try {
      const { data } = jwt.verify(token, process.env.SECRET_KEY, {
        maxAge: process.env.EXPIRATION,
      });
      req.user = data;
    } catch (err) {
      console.error(err);
      // console.log('Invalid token');
    }
    // returns request object to be passed to resolver as 'context'
    return req;
  },
  signToken({ email, username, _id }) {
    const payload = { email, username, _id };
    console.log('signToken payload', payload);
    const expiresIn = process.env.EXPIRATION || '2h';
    return jwt.sign({ data: payload }, 'secretsecret', '2h');
  },
};
