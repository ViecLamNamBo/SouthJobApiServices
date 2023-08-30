const mysql = require('mysql');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const objectConnection = require('../../../configs/database.config');
const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} = require('../helpers/authHelper');
const responseMessage = require('../helpers/responseMessage');
const bcrypt = require('bcrypt');

// REGISTER FOR USER
const registerUser = async (req, res) => {
  try {
    const passwordHashed = await hashPassword(req.body.password);
    const connection = mysql.createPool(objectConnection);
    const sqlQuery = 'CALL RegisterCandidate(?,?,?,?)';
    connection.query(
      sqlQuery,
      [req.body.full_name, req.body.phone, req.body.email, passwordHashed],
      function checkErrorOfQuery(err) {
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
      async function checkErrorOfQuery(err, result) {
        if (err) {
          return res
            .status(400)
            .json(responseMessage(err.sqlMessage, null, 'Fail', null));
        }
        // Get data from result
        let candidateInformation = result[0].map((item) =>
          JSON.parse(item.data)
        );
        // compare password from req body with password from DB
        const validPassword = await bcrypt.compare(
          req.body.password,
          candidateInformation[0].password
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
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
          });
          const { password, ...otherInformation } = candidateInformation[0];
          return res
            .status(200)
            .json(
              responseMessage(
                'Đăng nhập thành công!',
                otherInformation,
                'Success.',
                { accessToken: accessToken }
              )
            );
        }
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error....', null, 'Error', null));
  }
};
// Refresh token
const requestRefreshToken = async (req, res) => {
  // Take refresh token from user
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json(responseMessage('You are not authenticated!', null, 'Fail', null));
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECERET, (err, user) => {
    if (err) {
      console.log(
        '🚀 ~ file: user.controller.js:123 ~ requestRefreshToken ~ err:',
        err
      );
    }
    // Create new accessToken and refreshToken
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    res
      .status(200)
      .json(
        responseMessage(
          'Tạo mới accessToken thành công!',
          { accessToken: newAccessToken },
          'Success!',
          null
        )
      );
  });
};
module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
};
