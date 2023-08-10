const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.header.token.split(' ')[1]; // get token from  req heder of  user
  if (!accessToken) {
    return res.status(404).json({
      message: 'Token is  invalid!',
    });
  }
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    function checkAuthentication(err, user) {
      if (err) {
        return res.status(404).json({
          message: 'The user are not authentication!',
        });
      }
      return res.status(200).json({
        message: 'Authentication successfully!',
        user,
      });
    }
  );
  return next();
};
export default authMiddleware;
