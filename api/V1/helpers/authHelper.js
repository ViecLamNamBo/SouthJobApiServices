const jwt = require('jsonwebtoken');
// The function using to generate a  new access token
const generalAccessToken = (data) => {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m',
  });
  return accessToken;
};

// The function using to generate a  new refresh token
const generalRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '365d',
  });
  return refreshToken;
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
};
