const mysql = require('mysql');
const bcrypt = require('bcrypt');
const objectConnection = require('../../../configs/database.config');
const client = require('../helpers/connection_redis');
const responseMessage = require('../helpers/responseMessage');
const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../helpers/authHelper');
require('dotenv').config();

const getInfoOfUser = async (req, res) => {
  return res.status(200).json(
    responseMessage(
      'Get Information of user successfully',
      {
        username: 'locpham',
        age: 21,
        email: 'loc281202@gmail.com',
      },
      'success',
      null
    )
  );
};
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
          const accessToken = generateAccessToken(
            candidateInformation[0].candidate_id
          );
          const refreshToken = await generateRefreshToken(
            candidateInformation[0].candidate_id
          );
          res
            .cookie('refreshToken', refreshToken, {
              maxAge: 7 * 24 * 60 * 1000, // 7 days
              httpOnly: true,
              secure: false,
              path: '/',
              sameSite: 'strict',
            })
            .cookie('accessToken', accessToken, {
              maxAge: 2 * 60 * 60 * 1000, // 2 hour
              httpOnly: true,
              secure: false,
              path: '/',
              sameSite: 'strict',
            });
          // const { password, ...otherInformation } = candidateInformation[0];
          return res.status(200).json(
            responseMessage(
              'Đăng nhập thành công!',
              {
                accessToken,
              },
              'Success.',
              null
            )
          );
        }
        return null;
      }
    );
  } catch (err) {
    console.log('🚀 ~ file: user.controller.js:119 ~ loginUser ~ err:', err);
    return res
      .status(500)
      .json(responseMessage('Error....', null, 'Error', null));
  }
  return null;
};
// Refresh token
const requestRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json(
          responseMessage('You are not authenticated!', null, 'Fail', null)
        );
    }
    const userId = await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(userId);
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
          'Tạo mới access token thành công !',
          { accessToken: newAccessToken },
          'Success',
          null
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(responseMessage('Server Error', null, 'Error', null));
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await client.del(req.user.data.toString());
    return res
      .status(200)
      .json(responseMessage('Đăng xuất thành công !', null, 'Success', null));
  } catch (err) {
    return res
      .status(500)
      .json(responseMessage('Error...', null, 'Error', null));
  }
};
module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
  getInfoOfUser,
};
