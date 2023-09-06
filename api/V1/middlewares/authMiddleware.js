const jwt = require('jsonwebtoken');
const responseMessage = require('../helpers/responseMessage');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.token.split(' ')[1]; // get token from  req heder of  user
  // const accessToken = await req.headers['token'];
  if (!accessToken) {
    return res
      .status(403)
      .json(responseMessage('No token provided.', null, 'Fail.', null));
  }
  //  verifies secret and  checks exp
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    function checkAuthentication(err, user) {
      if (err) {
        return res
          .status(401)
          .json(responseMessage('Unauthorized access !', null, 'Fail!', null));
      }
      // return res
      //   .status(200)
      //   .json(
      //     responseMessage(
      //       'Authentication successfully!',
      //       user,
      //       'Successfully!',
      //       null
      //     )
      //   );
      req.user = user;
      next();
      return null;
    }
  );
  return null;
};
module.exports = authMiddleware;
