const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// The function using to generate a  new access token
const generateAccessToken = (data) => {
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s',
  });
  return accessToken;
};

// The function using to generate a  new refresh token
const generateRefreshToken = (data) => {
  const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '2h',
  });
  return refreshToken;
};
// using bcrypt to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(password, salt);
  return passwordHashed;
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
};
