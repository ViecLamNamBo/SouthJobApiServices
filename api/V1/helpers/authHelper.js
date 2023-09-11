const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// The function using to generate a  new access token
const generalAccessToken = (data) => {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h',
  });
  return accessToken;
};

// The function using to generate a  new refresh token
const generalRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '2h',
  });
  return refreshToken;
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);
  return passwordHashed;
};
module.exports = {
  generalAccessToken,
  generalRefreshToken,
  hashPassword,
};
