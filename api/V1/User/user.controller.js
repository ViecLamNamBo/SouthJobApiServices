const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const objectConnection = require('../../../configs/database.config');
const client = require('../helpers/connection_redis');
const responseMessage = require('../helpers/responseMessage');
const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../helpers/authHelper');
require('dotenv').config();

// REGISTER FOR USER
const registerUser = async (req, res) => {
  try {
    const passwordHashed = await hashPassword(req.body.password);
    const connection = mysql.createPool(objectConnection);
    const sqlQuery = 'CALL RegisterCandidate(?,?,?,?)';
    connection.query(
      sqlQuery,
      [req.body.full_name, req.body.phone, req.body.email, passwordHashed],
      function handleQuery(err) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, 'Fail', null));
        }
        return res
          .status(200)
          .json(
            responseMessage('Đăng ký thành công.!', null, 'Success.', null)
          );
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error.....', null, 'Error', null));
  }
  return null;
};

const loginUser = async (req, res) => {
  try {
    const connection = mysql.createPool(objectConnection);
    const sqlQuery = 'CALL GetCandidateInfoByEmail(?)';

    connection.query(
      sqlQuery,
      [req.body.email, req.body.password],
      async function handleQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, 'Fail', null));
        }
        // Get data from result
        const candidateInformation = result[0].map((item) =>
          JSON.parse(item.data)
        );
        // compare password from req body with password from DB
        // If user using google account to login , password  on db default = null, so  must be check it
        const validPassword = await bcrypt.compare(
          req.body.password,
          candidateInformation[0].password === null
            ? ''
            : candidateInformation[0].password
        );
        //  password invalid
        if (!validPassword) {
          return res
            .status(404)
            .json(
              responseMessage(
                'Mật khẩu không đúng , vui lòng thử lại !',
                null,
                'Fail',
                null
              )
            );
        }
        // valid password and candidate information not empty
        if (candidateInformation && validPassword) {
          const accessToken = generateAccessToken(candidateInformation[0]);
          const refreshToken = generateRefreshToken(candidateInformation[0]);
          client.set(candidateInformation[0].email.toString(), refreshToken, {
            EX: 8 * 24 * 60 * 60,
          });
          res
            .cookie('refreshToken', refreshToken, {
              httpOnly: true,
              secure: false,
              path: '/',
              sameSite: 'strict',
            })
            .cookie('accessToken', accessToken, {
              httpOnly: true,
              secure: false,
              path: '/',
              sameSite: 'strict',
            });
          // const { password, ...otherInformation } = candidateInformation[0];
          return res.status(200).json(
            responseMessage('Đăng nhập thành công!', null, 'Success.', {
              accessToken,
            })
          );
        }
        return null;
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error....', null, 'Error', null));
  }
  return null;
};
// Refresh token
const requestRefreshToken = async (req, res) => {
  // Take refresh token from user
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json(responseMessage('You are not authenticated!', null, 'Fail', null));
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    function (err, user) {
      if (err) {
        return res
          .status(403)
          .json(
            responseMessage('You are not authenticated !', null, 'Fail', null)
          );
      }
      const userToken = client.get('loc281202@gmail.com').then((token) => {
        return token;
      });
      userToken.then(function (reply) {
        // if (err) {
        //   return res
        //     .status(500)
        //     .json(responseMessage('Server Error', null, 'Error', null));
        // }
        if (refreshToken === reply) {
          console.log('giong nhau');
          // Create new accessToken and refreshToken
          const newAccessToken = generateAccessToken(user);
          // const newRefreshToken = generateRefreshToken(user);
          // Save new access  token  into cookie
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
          });
          return res
            .status(200)
            .json(
              responseMessage(
                'Tạo mới accessToken thành công!',
                { accessToken: newAccessToken },
                'Success!',
                null
              )
            );
        }
        return res
          .status(401)
          .json(
            responseMessage('You are not authenticated!', reply, 'Fail', null)
          );
      });
      return null;
    }
  );
  return null;
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res
      .status(200)
      .json(responseMessage('Đăng xuất thành công !', null, 'Success', null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error...', null, 'Error', null));
  }
  return null;
};
module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
};
