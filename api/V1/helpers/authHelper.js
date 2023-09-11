const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('./connection_redis');
const responseMessage = require('./responseMessage');
// The function using to generate a  new access token
const generateAccessToken = (data) => {
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h',
  });
  return accessToken;
};
const generateRefreshToken = (data) => {
  const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  client.set(data.toString(), refreshToken, {
    EX: 8 * 24 * 60 * 60,
  });

  return refreshToken;
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          console.log('Error verifying refresh token:', err);
          return reject(err);
        }
        try {
          const storedToken = await client.get(payload.data.toString());
          if (refreshToken === storedToken) {
            console.log('Refresh token verified successfully.');
            return resolve(payload.data);
          }
          console.log('Refresh token does not match.');
          return reject(new Error('Refresh token does not match'));
        } catch (error) {
          console.log('Error retrieving stored token:', error);
          return reject(error);
        }
      }
    );
  });
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
  verifyRefreshToken,
};
