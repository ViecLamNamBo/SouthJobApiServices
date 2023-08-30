const jwt = require('jsonwebtoken');
const responseMessage = require('../helpers/responseMessage');

const authMiddleware = (req, res, next) => {
  const accessToken = req.header.token.split(' ')[1]; // get token from  req heder of  user
  if (!accessToken) {
    return res
      .status(403)
      .json(responseMessage('You are not authenticated.', null, 'Fail.', null));
  }
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    function checkAuthentication(err, user) {
      if (err) {
        return res
          .status(403)
          .json(responseMessage('Token is not valid!', null, 'Fail!', null));
      }
      return res
        .status(404)
        .json(
          responseMessage(
            'Authentication successfully!',
            user,
            'Successfully!',
            null
          )
        );
    }
  );
  return next();
};
module.exports = authMiddleware;
